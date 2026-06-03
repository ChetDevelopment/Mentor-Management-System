import {
    Controller, Post, Get, Body, UseGuards, Request, Query, Req, Headers,
    Delete, Param,
} from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto } from '../../dto/auth';
import { Public } from '../../decorators/public.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Throttle({ default: { limit: 20, ttl: 60000 } })
    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Req() req: any,
    ) {
        const deviceInfo = this.extractDeviceInfo(req);
        return this.authService.login(loginDto, deviceInfo, req.ip);
    }

    @Public()
    @Throttle({ default: { limit: 20, ttl: 60000 } })
    @Post('register')
    async register(
        @Body() registerDto: RegisterDto,
        @Req() req: any,
    ) {
        const deviceInfo = this.extractDeviceInfo(req);
        return this.authService.register(registerDto, deviceInfo, req.ip);
    }

    @Public()
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Public()
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }

    @Public()
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @Get('verify-email')
    async verifyEmail(@Query('token') token: string) {
        return this.authService.verifyEmail(token);
    }

    @Public()
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @Post('resend-verification')
    async resendVerification(@Body('email') email: string) {
        return this.authService.resendVerification(email);
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(
        @Request() req,
        @Headers('authorization') authHeader: string,
        @Body('sessionId') sessionId?: string,
    ) {
        const token = authHeader?.split(' ')[1] || '';
        return this.authService.logout(req.user.userId, token, sessionId);
    }

    @UseGuards(AuthGuard)
    @Post('logout-all')
    async logoutAll(
        @Request() req,
        @Headers('authorization') authHeader: string,
    ) {
        const token = authHeader?.split(' ')[1] || '';
        return this.authService.logoutAllDevices(req.user.userId, token);
    }

    @UseGuards(AuthGuard)
    @Post('refresh-token')
    async refreshToken(
        @Request() req,
        @Body('refreshToken') refreshToken: string,
        @Req() fullReq: any,
    ) {
        if (!refreshToken) {
            return { message: 'Refresh token is required' };
        }
        const deviceInfo = this.extractDeviceInfo(fullReq);
        return this.authService.refreshToken(req.user.userId, refreshToken, deviceInfo, fullReq.ip);
    }

    @UseGuards(AuthGuard)
    @Get('sessions')
    async getSessions(@Request() req) {
        return this.authService.getActiveSessions(req.user.userId);
    }

    @UseGuards(AuthGuard)
    @Delete('sessions/:sessionId')
    async revokeSession(@Request() req, @Param('sessionId') sessionId: string) {
        return this.authService.revokeSessionById(req.user.userId, sessionId);
    }

    private extractDeviceInfo(req: any): any {
        const userAgent = req.headers['user-agent'] || '';
        return {
            userAgent,
            deviceName: req.headers['x-device-name'] || undefined,
            deviceType: req.headers['x-device-type'] || undefined,
            os: req.headers['x-device-os'] || undefined,
            browser: req.headers['x-device-browser'] || undefined,
        };
    }
}
