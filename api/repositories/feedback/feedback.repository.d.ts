import { Repository } from 'typeorm';
import { Feedback } from '../../entities/feedback/feedback.entity';
export declare class FeedbackRepository {
    private repository;
    constructor(repository: Repository<Feedback>);
    create(data: Partial<Feedback>): Promise<Feedback>;
    findAll(query?: any): Promise<Feedback[]>;
    findById(id: string): Promise<Feedback | null>;
    findByMentorId(mentorId: string): Promise<Feedback[]>;
    findBySessionId(sessionId: string): Promise<Feedback | null>;
    update(id: string, data: Partial<Feedback>): Promise<Feedback>;
    remove(id: string): Promise<void>;
}
