import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../../repositories/auth/auth.repository';
import { BlacklistRepository } from '../../repositories/blacklist/blacklist.repository';
import { SessionManagementRepository } from '../../repositories/session/session-management.repository';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto } from '../../dto/auth';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { AuditLogger } from '../../security/audit.logger';
export declare class AuthService {
    private authRepository;
    private blacklistRepo;
    private sessionRepo;
    private jwtService;
    private userService;
    private activityLogService;
    private auditLogger;
    constructor(authRepository: AuthRepository, blacklistRepo: BlacklistRepository, sessionRepo: SessionManagementRepository, jwtService: JwtService, userService: UserService, activityLogService: ActivityLogService, auditLogger: AuditLogger);
    validateUser(email: string, password: string, ip?: string): Promise<any>;
    login(loginDto: LoginDto, deviceInfo?: any, ip?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            role: any;
        };
    }>;
    register(registerDto: RegisterDto, deviceInfo?: any, ip?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: import("../../constants").UserRole;
        };
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
        resetToken?: undefined;
    } | {
        message: string;
        resetToken: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    logout(userId: string, accessToken: string, sessionId?: string): Promise<{
        message: string;
    }>;
    logoutAllDevices(userId: string, currentAccessToken: string): Promise<{
        message: string;
    }>;
    refreshToken(userId: string, oldRefreshToken: string, deviceInfo?: any, ip?: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    resendVerification(email: string): Promise<{
        message: string;
        verificationToken?: undefined;
    } | {
        message: string;
        verificationToken: string;
    }>;
    getActiveSessions(userId: string): Promise<{
        id: string;
        deviceName: string;
        deviceType: string;
        os: string;
        browser: string;
        ipAddress: string;
        lastActivityAt: Date;
        createdAt: Date;
    }[]>;
    revokeSessionById(userId: string, sessionId: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    private storeSession;
}
