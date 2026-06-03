import { Repository } from 'typeorm';
import { Session } from '../../entities/session/session.entity';
import { SessionStatus } from '../../constants';
export declare class SessionRepository {
    private repository;
    constructor(repository: Repository<Session>);
    create(data: Partial<Session>): Promise<Session>;
    findAll(query?: any): Promise<Session[]>;
    findById(id: string): Promise<Session | null>;
    findByMentorId(mentorId: string): Promise<Session[]>;
    findByMenteeId(menteeId: string): Promise<Session[]>;
    update(id: string, data: Partial<Session>): Promise<Session>;
    updateStatus(id: string, status: SessionStatus): Promise<Session>;
    remove(id: string): Promise<void>;
}
