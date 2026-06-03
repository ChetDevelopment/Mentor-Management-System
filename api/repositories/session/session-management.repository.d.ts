import { Repository } from 'typeorm';
import { UserSession } from '../../entities/auth/session.entity';
export declare class SessionManagementRepository {
    private repository;
    constructor(repository: Repository<UserSession>);
    hashToken(token: string): string;
    createSession(data: {
        userId: string;
        accessToken: string;
        refreshToken?: string;
        deviceName?: string;
        deviceType?: string;
        os?: string;
        browser?: string;
        ipAddress?: string;
        userAgent?: string;
        expiresAt: Date;
    }): Promise<UserSession>;
    findActiveByUserId(userId: string): Promise<UserSession[]>;
    findById(id: string): Promise<UserSession | null>;
    revokeSession(id: string): Promise<void>;
    revokeAllUserSessions(userId: string): Promise<number>;
    updateLastActivity(sessionId: string): Promise<void>;
    findSessionByTokenHash(tokenHash: string): Promise<UserSession | null>;
    cleanupExpired(): Promise<number>;
    getActiveSessionCount(userId: string): Promise<number>;
}
