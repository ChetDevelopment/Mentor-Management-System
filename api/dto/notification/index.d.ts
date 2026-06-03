import { NotificationType } from '../../constants';
export declare class CreateNotificationDto {
    userId: string;
    title: string;
    message: string;
    type?: NotificationType;
    actionUrl?: string;
    metadata?: string;
}
export declare class UpdateNotificationDto {
    isRead?: boolean;
}
