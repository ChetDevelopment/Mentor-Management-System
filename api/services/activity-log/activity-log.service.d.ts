import { ActivityLogRepository } from '../../repositories/activity-log/activity-log.repository';
import { CreateActivityLogDto } from '../../dto/activity-log';
import { ActivityType } from '../../constants';
export declare class ActivityLogService {
    private activityLogRepository;
    constructor(activityLogRepository: ActivityLogRepository);
    log(userId: string, action: ActivityType, entity: string, entityId: string, description?: string, metadata?: any): Promise<import("../../entities/activity-log/activity-log.entity").ActivityLog>;
    create(createActivityLogDto: CreateActivityLogDto): Promise<import("../../entities/activity-log/activity-log.entity").ActivityLog>;
    findAll(query?: any): Promise<import("../../entities/activity-log/activity-log.entity").ActivityLog[]>;
    findById(id: string): Promise<import("../../entities/activity-log/activity-log.entity").ActivityLog>;
    findByUserId(userId: string): Promise<import("../../entities/activity-log/activity-log.entity").ActivityLog[]>;
    remove(id: string): Promise<void>;
}
