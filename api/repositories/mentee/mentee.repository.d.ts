import { Repository } from 'typeorm';
import { Mentee } from '../../entities/mentee/mentee.entity';
export declare class MenteeRepository {
    private repository;
    constructor(repository: Repository<Mentee>);
    create(data: Partial<Mentee>): Promise<Mentee>;
    findAll(query?: any): Promise<Mentee[]>;
    findById(id: string): Promise<Mentee | null>;
    findByUserId(userId: string): Promise<Mentee | null>;
    update(id: string, data: Partial<Mentee>): Promise<Mentee>;
    remove(id: string): Promise<void>;
}
