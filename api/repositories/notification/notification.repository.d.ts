import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';
export declare class NotificationRepository {
    private repository;
    constructor(repository: Repository<Notification>);
    create(data: Partial<Notification>): Promise<Notification>;
    findAll(query?: any): Promise<Notification[]>;
    findById(id: string): Promise<Notification | null>;
    findByUserId(userId: string, query?: any): Promise<Notification[]>;
    findUnread(userId: string): Promise<Notification[]>;
    findUnreadByUserId(userId: string): Promise<Notification[]>;
    markAsRead(id: string): Promise<Notification>;
    markAllAsRead(userId: string): Promise<void>;
    update(id: string, data: Partial<Notification>): Promise<Notification>;
    remove(id: string): Promise<void>;
}
