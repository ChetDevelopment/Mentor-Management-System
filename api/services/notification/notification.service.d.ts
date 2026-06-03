import { NotificationRepository } from '../../repositories/notification/notification.repository';
import { CreateNotificationDto, UpdateNotificationDto } from '../../dto/notification';
export declare class NotificationService {
    private notificationRepository;
    constructor(notificationRepository: NotificationRepository);
    create(createNotificationDto: CreateNotificationDto): Promise<import("../../entities/notification.entity").Notification>;
    createNotification(createNotificationDto: CreateNotificationDto): Promise<import("../../entities/notification.entity").Notification>;
    findAll(userId: string, query?: any): Promise<import("../../entities/notification.entity").Notification[]>;
    findById(id: string): Promise<import("../../entities/notification.entity").Notification>;
    findUnread(userId: string): Promise<import("../../entities/notification.entity").Notification[]>;
    markAsRead(id: string): Promise<import("../../entities/notification.entity").Notification>;
    markAllAsRead(userId: string): Promise<void>;
    update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<import("../../entities/notification.entity").Notification>;
    remove(id: string): Promise<void>;
}
