import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { TokenBlacklist } from '../../entities/auth/token-blacklist.entity';
import * as crypto from 'crypto';

@Injectable()
export class BlacklistRepository {
    constructor(
        @InjectRepository(TokenBlacklist)
        private repository: Repository<TokenBlacklist>,
    ) {}

    hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    async add(token: string, expiresAt: Date): Promise<void> {
        const tokenHash = this.hashToken(token);
        await this.repository.insert({ tokenHash, expiresAt });
    }

    async isBlacklisted(token: string): Promise<boolean> {
        const tokenHash = this.hashToken(token);
        const count = await this.repository.count({
            where: { tokenHash, expiresAt: MoreThan(new Date()) as any },
        });
        return count > 0;
    }

    async cleanExpired(): Promise<number> {
        const result = await this.repository.delete({
            expiresAt: LessThan(new Date()) as any,
        });
        return result.affected || 0;
    }
}
