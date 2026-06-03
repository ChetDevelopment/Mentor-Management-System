import { Repository } from 'typeorm';
import { Matching } from '../../entities/matching/matching.entity';
export declare class MatchingRepository {
    private repository;
    constructor(repository: Repository<Matching>);
    create(data: Partial<Matching>): Promise<Matching>;
    findAll(query?: any): Promise<Matching[]>;
    findById(id: string): Promise<Matching | null>;
    findByMentorId(mentorId: string): Promise<Matching[]>;
    findByMenteeId(menteeId: string): Promise<Matching[]>;
    update(id: string, data: Partial<Matching>): Promise<Matching>;
    remove(id: string): Promise<void>;
}
