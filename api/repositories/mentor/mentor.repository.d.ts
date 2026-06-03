import { Repository } from 'typeorm';
import { Mentor } from '../../entities/mentor/mentor.entity';
import { MentorStatus } from '../../constants';
export declare class MentorRepository {
    private repository;
    delete(id: string): void;
    constructor(repository: Repository<Mentor>);
    create(data: Partial<Mentor>): Promise<Mentor>;
    findAll(query?: any): Promise<Mentor[]>;
    findAllWithSkills(query?: any): Promise<Mentor[]>;
    findById(id: string): Promise<Mentor | null>;
    findByUserId(userId: string): Promise<Mentor | null>;
    update(id: string, data: Partial<Mentor>): Promise<Mentor>;
    findPending(): Promise<Mentor[]>;
    updateStatus(id: string, status: MentorStatus, reason?: string): Promise<Mentor>;
    remove(id: string): Promise<void>;
}
