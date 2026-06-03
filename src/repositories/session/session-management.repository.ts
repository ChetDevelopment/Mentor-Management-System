import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import * as crypto from 'crypto';
import { UserSession } from '../../entities/auth/session.entity';

@Injectable()
export class SessionManagementRepository {
    constructor(
        @InjectRepository(UserSession)
        private repository: Repository<UserSession>,
    ) {}

    hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    async createSession(data: {
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
    }): Promise<UserSession> {
        const session = this.repository.create({
            userId: data.userId,
            tokenHash: this.hashToken(data.accessToken),
            refreshTokenHash: data.refreshToken ? this.hashToken(data.refreshToken) : undefined,
            deviceName: data.deviceName,
            deviceType: data.deviceType,
            os: data.os,
            browser: data.browser,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
            lastActivityAt: new Date(),
            expiresAt: data.expiresAt,
            isActive: true,
        });
        return this.repository.save(session);
    }

    async findActiveByUserId(userId: string): Promise<UserSession[]> {
        return this.repository.find({
            where: { userId, isActive: true },
            order: { lastActivityAt: 'DESC' },
        });
    }

    async findById(id: string): Promise<UserSession | null> {
        return this.repository.findOne({ where: { id } });
    }

    async revokeSession(id: string): Promise<void> {
        await this.repository.update(id, {
            isActive: false,
            loggedOutAt: new Date(),
        });
    }

    async revokeAllUserSessions(userId: string): Promise<number> {
        const result = await this.repository.update(
            { userId, isActive: true },
            { isActive: false, loggedOutAt: new Date() },
        );
        return result.affected || 0;
    }

    async updateLastActivity(sessionId: string): Promise<void> {
        await this.repository.update(sessionId, { lastActivityAt: new Date() });
    }

    async findSessionByTokenHash(tokenHash: string): Promise<UserSession | null> {
        return this.repository.findOne({
            where: { tokenHash, isActive: true },
        });
    }

    async cleanupExpired(): Promise<number> {
        const result = await this.repository.delete({
            expiresAt: LessThan(new Date()) as any,
        });
        return result.affected || 0;
    }

    async getActiveSessionCount(userId: string): Promise<number> {
        return this.repository.count({
            where: { userId, isActive: true },
        });
    }
}
