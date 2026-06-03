import { Repository } from 'typeorm';
import { AuthToken } from '../../entities/auth/auth-token.entity';
export declare class AuthRepository {
    private repository;
    constructor(repository: Repository<AuthToken>);
    hashToken(token: string): string;
    create(data: Partial<AuthToken>): Promise<AuthToken>;
    findActiveByUserId(userId: string): Promise<AuthToken[]>;
    findActiveByRefreshHash(refreshHash: string): Promise<AuthToken | null>;
    deactivateByUserId(userId: string): Promise<number>;
    deactivateByRefreshHash(refreshHash: string): Promise<void>;
    removeExpired(): Promise<number>;
}
