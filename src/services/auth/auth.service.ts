import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AuthRepository } from '../../repositories/auth/auth.repository';
import { BlacklistRepository } from '../../repositories/blacklist/blacklist.repository';
import { SessionManagementRepository } from '../../repositories/session/session-management.repository';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto } from '../../dto/auth';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { AuditLogger, SecurityEvent } from '../../security/audit.logger';
import { ActivityType } from '../../constants';

@Injectable()
export class AuthService {
    constructor(
        private authRepository: AuthRepository,
        private blacklistRepo: BlacklistRepository,
        private sessionRepo: SessionManagementRepository,
        private jwtService: JwtService,
        private userService: UserService,
        private activityLogService: ActivityLogService,
        private auditLogger: AuditLogger,
    ) {}

    async validateUser(email: string, password: string, ip?: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            this.auditLogger.log(SecurityEvent.LOGIN_FAILED, null, { email, reason: 'user_not_found' }, ip);
            return null;
        }

        if (!user.isActive) {
            this.auditLogger.log(SecurityEvent.LOGIN_FAILED, user.id, { reason: 'account_inactive' }, ip);
            return null;
        }

        if (user.lockedUntil && new Date() < user.lockedUntil) {
            this.auditLogger.log(SecurityEvent.LOGIN_FAILED, user.id, { reason: 'account_locked' }, ip);
            return null;
        }

        const isPasswordValid = await this.userService.comparePassword(password, user.password);
        if (isPasswordValid) {
            await this.userService.update(user.id, { failedLoginCount: 0, lastLogin: new Date() } as any);
            const { password: _, ...result } = user;
            this.auditLogger.log(SecurityEvent.LOGIN_SUCCESS, user.id, { email }, ip);
            return result;
        }

        const failed = (user.failedLoginCount || 0) + 1;
        const update: any = { failedLoginCount: failed };

        if (failed >= 5) {
            update.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
            this.auditLogger.log(SecurityEvent.ACCOUNT_LOCKED, user.id, { failedAttempts: failed }, ip);
        }

        await this.userService.update(user.id, update);
        this.auditLogger.log(SecurityEvent.LOGIN_FAILED, user.id, { failedAttempt: failed }, ip);
        return null;
    }

    async login(loginDto: LoginDto, deviceInfo?: any, ip?: string) {
        const user = await this.validateUser(loginDto.email, loginDto.password, ip);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const tokens = await this.generateTokens(user);
        await this.storeSession(
            user.id,
            tokens,
            deviceInfo,
            ip,
        );

        await this.activityLogService.log(user.id, ActivityType.LOGIN, 'user', user.id);
        this.auditLogger.log(SecurityEvent.LOGIN_SUCCESS, user.id, { email: user.email }, ip);

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            ...tokens,
        };
    }

    async register(registerDto: RegisterDto, deviceInfo?: any, ip?: string) {
        const existingUser = await this.userService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new BadRequestException('Email already registered');
        }

        const user = await this.userService.create(registerDto);
        const tokens = await this.generateTokens(user);
        await this.storeSession(user.id, tokens, deviceInfo, ip);

        await this.activityLogService.log(user.id, ActivityType.LOGIN, 'user', user.id);
        this.auditLogger.log(SecurityEvent.LOGIN_SUCCESS, user.id, { email: user.email }, ip);

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            ...tokens,
        };
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const user = await this.userService.findByEmail(forgotPasswordDto.email);

        if (!user) {
            return { message: 'If that email is registered, a password reset link has been sent' };
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = await this.userService.hashPassword(rawToken);
        const expiry = new Date(Date.now() + 60 * 60 * 1000);

        await this.userService.update(user.id, {
            resetToken: hashedToken,
            resetTokenExpiry: expiry,
        } as any);

        this.auditLogger.log(SecurityEvent.PASSWORD_RESET_REQUEST, user.id);

        return { message: 'If that email is registered, a password reset link has been sent', resetToken: rawToken };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { token, password } = resetPasswordDto;

        const users = await this.userService.findAll();
        let matchedUser: any = null;

        for (const user of users) {
            if (user.resetToken) {
                const isMatch = await this.userService.comparePassword(token, user.resetToken);
                if (isMatch) {
                    matchedUser = user;
                    break;
                }
            }
        }

        if (!matchedUser) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        if (matchedUser.resetTokenExpiry && new Date() > matchedUser.resetTokenExpiry) {
            await this.userService.update(matchedUser.id, { resetToken: null, resetTokenExpiry: null } as any);
            throw new BadRequestException('Reset token has expired');
        }

        const hashedPassword = await this.userService.hashPassword(password);
        await this.userService.updatePassword(matchedUser.id, hashedPassword);
        await this.userService.update(matchedUser.id, {
            resetToken: null,
            resetTokenExpiry: null,
            failedLoginCount: 0,
            lockedUntil: null,
        } as any);

        // Revoke ALL existing sessions — force re-login
        await this.sessionRepo.revokeAllUserSessions(matchedUser.id);
        await this.authRepository.deactivateByUserId(matchedUser.id);
        await this.blacklistRepo.add(token, new Date(Date.now() + 3600000));

        this.auditLogger.log(SecurityEvent.PASSWORD_RESET_COMPLETED, matchedUser.id);

        return { message: 'Password has been reset successfully. Please login with your new password.' };
    }

    async logout(userId: string, accessToken: string, sessionId?: string) {
        let expiresAt = new Date(Date.now() + 3600000);
        try {
            const decoded = this.jwtService.decode(accessToken) as any;
            if (decoded?.exp) {
                expiresAt = new Date(decoded.exp * 1000);
            }
        } catch {
            // fallback
        }

        // Blacklist the access token
        await this.blacklistRepo.add(accessToken, expiresAt);

        // Revoke specific session or all sessions
        if (sessionId) {
            await this.sessionRepo.revokeSession(sessionId);
        } else {
            await this.sessionRepo.revokeAllUserSessions(userId);
        }

        // Revoke all refresh tokens
        await this.authRepository.deactivateByUserId(userId);

        await this.activityLogService.log(userId, ActivityType.LOGOUT, 'user', userId);
        this.auditLogger.log(SecurityEvent.LOGOUT, userId);

        return { message: 'Logged out successfully' };
    }

    async logoutAllDevices(userId: string, currentAccessToken: string) {
        // Blacklist current token
        let expiresAt = new Date(Date.now() + 3600000);
        try {
            const decoded = this.jwtService.decode(currentAccessToken) as any;
            if (decoded?.exp) expiresAt = new Date(decoded.exp * 1000);
        } catch {}
        await this.blacklistRepo.add(currentAccessToken, expiresAt);

        // Revoke ALL sessions
        await this.sessionRepo.revokeAllUserSessions(userId);
        await this.authRepository.deactivateByUserId(userId);

        await this.activityLogService.log(userId, ActivityType.LOGOUT, 'user', userId);
        this.auditLogger.log(SecurityEvent.SESSION_REVOKED, userId, { allDevices: true });

        return { message: 'Logged out from all devices successfully' };
    }

    async refreshToken(userId: string, oldRefreshToken: string, deviceInfo?: any, ip?: string) {
        const refreshHash = this.authRepository.hashToken(oldRefreshToken);

        // Find by hashed refresh token
        const storedToken = await this.authRepository.findActiveByRefreshHash(refreshHash);
        if (!storedToken) {
            // Possible token reuse attack — revoke ALL tokens for user
            await this.authRepository.deactivateByUserId(userId);
            await this.sessionRepo.revokeAllUserSessions(userId);
            this.auditLogger.log(SecurityEvent.SUSPICIOUS_ACTIVITY, userId, {
                reason: 'refresh_token_reuse_attempt',
            }, ip);
            throw new UnauthorizedException('Refresh token has been revoked');
        }

        if (storedToken.expiresAt && new Date() > storedToken.expiresAt) {
            await this.authRepository.deactivateByUserId(userId);
            throw new UnauthorizedException('Refresh token has expired');
        }

        // Rotate: deactivate old tokens
        await this.authRepository.deactivateByRefreshHash(refreshHash);

        // Generate new tokens
        const user = await this.userService.findById(userId);
        if (!user || !user.isActive) {
            throw new UnauthorizedException('Account is inactive');
        }

        const tokens = await this.generateTokens(user);
        await this.storeSession(userId, tokens, deviceInfo, ip);

        this.auditLogger.log(SecurityEvent.TOKEN_REFRESH, userId);

        return tokens;
    }

    async verifyEmail(token: string) {
        const users = await this.userService.findAll();
        const user = users.find((u: any) => u.emailVerificationToken && 
            bcrypt.compareSync(token, u.emailVerificationToken));
        if (!user) throw new BadRequestException('Invalid verification token');

        await this.userService.update(user.id, {
            isEmailVerified: true,
            emailVerificationToken: null,
            emailVerifiedAt: new Date(),
        } as any);

        this.auditLogger.log(SecurityEvent.EMAIL_VERIFIED, user.id);

        return { message: 'Email verified successfully' };
    }

    async resendVerification(email: string) {
        const user = await this.userService.findByEmail(email);

        if (!user) {
            return { message: 'If your email is registered, a verification link has been sent' };
        }

        if (user.isEmailVerified) {
            return { message: 'If your email is registered, a verification link has been sent' };
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = await this.userService.hashPassword(rawToken);
        await this.userService.update(user.id, { emailVerificationToken: hashedToken } as any);

        this.auditLogger.log(SecurityEvent.EMAIL_VERIFICATION_REQUESTED, user.id);

        return { message: 'If your email is registered, a verification link has been sent', verificationToken: rawToken };
    }

    async getActiveSessions(userId: string) {
        const sessions = await this.sessionRepo.findActiveByUserId(userId);
        return sessions.map((s) => ({
            id: s.id,
            deviceName: s.deviceName,
            deviceType: s.deviceType,
            os: s.os,
            browser: s.browser,
            ipAddress: s.ipAddress,
            lastActivityAt: s.lastActivityAt,
            createdAt: s.createdAt,
        }));
    }

    async revokeSessionById(userId: string, sessionId: string) {
        const session = await this.sessionRepo.findById(sessionId);
        if (!session || session.userId !== userId) {
            throw new BadRequestException('Session not found');
        }
        await this.sessionRepo.revokeSession(sessionId);
        this.auditLogger.log(SecurityEvent.SESSION_REVOKED, userId, { sessionId });
        return { message: 'Session revoked' };
    }

    private async generateTokens(user: any) {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, { expiresIn: '15m' }),
            this.jwtService.signAsync(payload, { expiresIn: '7d' }),
        ]);

        return { accessToken, refreshToken };
    }

    private async storeSession(
        userId: string,
        tokens: { accessToken: string; refreshToken: string },
        deviceInfo?: any,
        ip?: string,
    ) {
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        // Store hashed tokens in auth_tokens
        await this.authRepository.create({
            userId,
            tokenHash: this.authRepository.hashToken(tokens.accessToken),
            refreshTokenHash: this.authRepository.hashToken(tokens.refreshToken),
            expiresAt,
            deviceInfo: deviceInfo ? JSON.stringify(deviceInfo) : undefined,
            ipAddress: ip,
        });

        // Store session record with device info
        await this.sessionRepo.createSession({
            userId,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            deviceName: deviceInfo?.deviceName,
            deviceType: deviceInfo?.deviceType,
            os: deviceInfo?.os,
            browser: deviceInfo?.browser,
            ipAddress: ip,
            userAgent: deviceInfo?.userAgent,
            expiresAt,
        });
    }
}
