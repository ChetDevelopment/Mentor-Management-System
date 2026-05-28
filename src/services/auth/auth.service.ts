import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from '../../repositories/auth/auth.repository';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto } from '../../dto/auth';
import { jwtConfig } from '../../config';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

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

    const resetToken = this.jwtService.sign(
      { userId: user.id, email: user.email },
      { expiresIn: '1h' },
    );

    return { message: 'Password reset email sent', resetToken };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const payload = await this.jwtService.verifyAsync(resetPasswordDto.token, {
        secret: jwtConfig.secret,
      });

      const hashedPassword = await this.userService.hashPassword(resetPasswordDto.password);
      await this.userService.updatePassword(payload.userId, hashedPassword);

      return { message: 'Password reset successful' };
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async logout(userId: string) {
    await this.authRepository.deactivateByUserId(userId);
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
