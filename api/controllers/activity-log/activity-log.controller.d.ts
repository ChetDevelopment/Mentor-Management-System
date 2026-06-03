import { ActivityLogService } from '../../services/activity-log/activity-log.service';
import { CreateActivityLogDto } from '../../dto/activity-log';
export declare class ActivityLogController {
    private activityLogService;
    constructor(activityLogService: ActivityLogService);
    findAll(query: any): Promise<import("../../entities/activity-log/activity-log.entity").ActivityLog[]>;
    findOne(id: string): Promise<import("../../entities/activity-log/activity-log.entity").ActivityLog>;
    create(createActivityLogDto: CreateActivityLogDto): Promise<import("../../entities/activity-log/activity-log.entity").ActivityLog>;
}
