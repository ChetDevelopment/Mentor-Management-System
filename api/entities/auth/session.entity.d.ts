export declare class UserSession {
    id: string;
    userId: string;
    tokenHash: string;
    refreshTokenHash: string;
    deviceName: string;
    deviceType: string;
    os: string;
    browser: string;
    ipAddress: string;
    userAgent: string;
    location: string;
    isActive: boolean;
    lastActivityAt: Date;
    expiresAt: Date;
    loggedOutAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
