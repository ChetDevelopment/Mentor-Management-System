import { AuthService } from '../../services/auth/auth.service';
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto } from '../../dto/auth';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, req: any): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            role: any;
        };
    }>;
    register(registerDto: RegisterDto, req: any): Promise<{
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
    logout(req: any, authHeader: string, sessionId?: string): Promise<{
        message: string;
    }>;
    logoutAll(req: any, authHeader: string): Promise<{
        message: string;
    }>;
    refreshToken(req: any, refreshToken: string, fullReq: any): Promise<{
        accessToken: string;
        refreshToken: string;
    } | {
        message: string;
    }>;
    getSessions(req: any): Promise<{
        id: string;
        deviceName: string;
        deviceType: string;
        os: string;
        browser: string;
        ipAddress: string;
        lastActivityAt: Date;
        createdAt: Date;
    }[]>;
    revokeSession(req: any, sessionId: string): Promise<{
        message: string;
    }>;
    private extractDeviceInfo;
}
