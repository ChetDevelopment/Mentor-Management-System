import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from '../../repositories/auth/auth.repository';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto } from '../../dto/auth';
import { jwtConfig } from '../../config';
import * as crypto from 'crypto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ActivityType } from '../../constants';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private userService: UserService,
    private activityLogService: ActivityLogService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await this.userService.comparePassword(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);
    await this.storeToken(user.id, tokens);
    await this.activityLogService.log(user.id, ActivityType.LOGIN, 'user', user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const user = await this.userService.create(registerDto);
    const tokens = await this.generateTokens(user);
    await this.storeToken(user.id, tokens);
    await this.activityLogService.log(user.id, ActivityType.LOGIN, 'user', user.id);
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
      throw new BadRequestException('Email not found');
    }

    const rawToken = this.generateResetToken();
    const hashedToken = await this.userService.hashPassword(rawToken);
    const expiry = new Date(Date.now() + 1 * 60 * 60 * 1000);

    await this.userService.update(user.id, { resetToken: hashedToken, resetTokenExpiry: expiry } as any);

    return { message: 'Password reset token generated', resetToken: rawToken };
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
    await this.userService.update(matchedUser.id, { resetToken: null, resetTokenExpiry: null } as any);
    return { message: 'Password reset successful' };
  }

  private generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async logout(userId: string) {
    await this.authRepository.deactivateByUserId(userId);
    await this.activityLogService.log(userId, ActivityType.LOGOUT, 'user', userId);
    return { message: 'Logout successful' };
  }

  async refreshToken(user: any) {
    const tokens = await this.generateTokens(user);
    await this.storeToken(user.userId, tokens);
    return tokens;
  }

  private async generateTokens(user: any) {
    const payload = { userId: user.id, email: user.email, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return { accessToken, refreshToken };
  }

  private async storeToken(userId: string, tokens: any) {
    await this.authRepository.create({
      userId,
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }
}
