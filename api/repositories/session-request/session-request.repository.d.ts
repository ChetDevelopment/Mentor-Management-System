import { Repository } from 'typeorm';
import { SessionRequest } from '../../entities/session-request/session-request.entity';
export declare class SessionRequestRepository {
    private repository;
    constructor(repository: Repository<SessionRequest>);
    create(data: Partial<SessionRequest>): Promise<SessionRequest>;
    findBySessionId(sessionId: string): Promise<SessionRequest | null>;
    update(id: string, data: Partial<SessionRequest>): Promise<SessionRequest>;
}
