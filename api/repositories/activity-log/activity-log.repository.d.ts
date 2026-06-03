import { Repository } from 'typeorm';
import { ActivityLog } from '../../entities/activity-log/activity-log.entity';
export declare class ActivityLogRepository {
    private repository;
    constructor(repository: Repository<ActivityLog>);
    create(data: Partial<ActivityLog>): Promise<ActivityLog>;
    findAll(query?: any): Promise<ActivityLog[]>;
    findById(id: string): Promise<ActivityLog | null>;
    findByUserId(userId: string): Promise<ActivityLog[]>;
    remove(id: string): Promise<void>;
}
