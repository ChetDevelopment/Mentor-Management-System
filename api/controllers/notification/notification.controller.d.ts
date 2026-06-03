import { NotificationService } from '../../services/notification/notification.service';
import { CreateNotificationDto } from '../../dto/notification';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    findAll(user: any): Promise<import("../../entities/notification.entity").Notification[]>;
    findUnread(user: any): Promise<import("../../entities/notification.entity").Notification[]>;
    findById(id: string, user: any): Promise<import("../../entities/notification.entity").Notification>;
    create(dto: CreateNotificationDto): Promise<import("../../entities/notification.entity").Notification>;
    markAsRead(id: string, user: any): Promise<import("../../entities/notification.entity").Notification>;
    markAllAsRead(user: any): Promise<void>;
    delete(id: string, user: any): Promise<void>;
}
