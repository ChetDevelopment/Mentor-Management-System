import { Repository } from 'typeorm';
import { BlockedDate } from '../../entities/blocked-date.entity';
export declare class BlockedDateRepository {
    private repository;
    constructor(repository: Repository<BlockedDate>);
    findById(id: string): Promise<BlockedDate | null>;
    findByMentorId(mentorId: string): Promise<BlockedDate[]>;
    create(data: Partial<BlockedDate>): Promise<BlockedDate>;
    delete(id: string): Promise<void>;
}
