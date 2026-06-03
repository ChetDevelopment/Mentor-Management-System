import { NotificationType } from '../constants';
export declare class Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    readAt: Date;
    actionUrl: string;
    metadata: string;
    createdAt: Date;
    updatedAt: Date;
}
