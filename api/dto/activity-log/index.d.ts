import { ActivityType } from '../../constants';
export declare class CreateActivityLogDto {
    userId?: string;
    action: ActivityType;
    entity: string;
    entityId: string;
    description?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: string;
}
