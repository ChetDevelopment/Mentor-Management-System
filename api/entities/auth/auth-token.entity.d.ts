export declare class AuthToken {
    id: string;
    userId: string;
    tokenHash: string;
    refreshTokenHash: string;
    isActive: boolean;
    expiresAt: Date;
    deviceInfo: string;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
    updatedAt: Date;
}
