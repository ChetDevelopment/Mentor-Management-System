import { ActivityType } from '../../constants';
export declare class ActivityLog {
    id: string;
    userId: string;
    action: ActivityType;
    entity: string;
    entityId: string;
    description: string;
    ipAddress: string;
    userAgent: string;
    metadata: string;
    createdAt: Date;
}
