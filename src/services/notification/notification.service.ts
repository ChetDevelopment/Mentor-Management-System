import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from '../../repositories/notification/notification.repository';
import { CreateNotificationDto, UpdateNotificationDto } from '../../dto/notification';

@Injectable()
export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  async create(createNotificationDto: CreateNotificationDto) {
    return this.notificationRepository.create(createNotificationDto);
  }

  async findAll(query?: any, user?: any) {
    return this.notificationRepository.findByUserId(user.userId, query);
  }

  async findById(id: string) {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async findUnread(userId: string) {
    return this.notificationRepository.findUnreadByUserId(userId);
  }

  async markAsRead(id: string) {
    const notification = await this.findById(id);
    notification.isRead = true;
    notification.readAt = new Date();
    return this.notificationRepository.update(id, notification);
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return this.notificationRepository.update(id, updateNotificationDto);
  }

  async remove(id: string) {
    return this.notificationRepository.remove(id);
  }
}
