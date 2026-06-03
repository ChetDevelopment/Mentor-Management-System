import { Repository } from 'typeorm';
import { TokenBlacklist } from '../../entities/auth/token-blacklist.entity';
export declare class BlacklistRepository {
    private repository;
    constructor(repository: Repository<TokenBlacklist>);
    hashToken(token: string): string;
    add(token: string, expiresAt: Date): Promise<void>;
    isBlacklisted(token: string): Promise<boolean>;
    cleanExpired(): Promise<number>;
}
