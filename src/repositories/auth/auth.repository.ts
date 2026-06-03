import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as crypto from 'crypto';
import { AuthToken } from '../../entities/auth/auth-token.entity';

@Injectable()
export class AuthRepository {
    constructor(
        @InjectRepository(AuthToken)
        private repository: Repository<AuthToken>,
    ) {}

    hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    async create(data: Partial<AuthToken>): Promise<AuthToken> {
        const entity = this.repository.create(data);
        return this.repository.save(entity);
    }

    async findActiveByUserId(userId: string): Promise<AuthToken[]> {
        return this.repository.find({
            where: { userId, isActive: true },
            order: { createdAt: 'DESC' },
        });
    }

    async findActiveByRefreshHash(refreshHash: string): Promise<AuthToken | null> {
        return this.repository.findOne({
            where: { refreshTokenHash: refreshHash, isActive: true },
        });
    }

    async deactivateByUserId(userId: string): Promise<number> {
        const result = await this.repository.update(
            { userId, isActive: true },
            { isActive: false },
        );
        return result.affected || 0;
    }

    async deactivateByRefreshHash(refreshHash: string): Promise<void> {
        await this.repository.update(
            { refreshTokenHash: refreshHash, isActive: true },
            { isActive: false },
        );
    }

    async removeExpired(): Promise<number> {
        const result = await this.repository.delete({
            expiresAt: LessThan(new Date()),
        });
        return result.affected || 0;
    }
}
