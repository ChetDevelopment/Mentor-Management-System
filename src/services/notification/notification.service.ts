import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from '../../repositories/notification/notification.repository';
import { CreateNotificationDto, UpdateNotificationDto } from '../../dto/notification';

@Injectable()
export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  async create(createNotificationDto: CreateNotificationDto) {
    return this.createNotification(createNotificationDto);
  }

  async createNotification(createNotificationDto: CreateNotificationDto) {
    return this.notificationRepository.create(createNotificationDto);
  }

  async findAll(userId: string, query?: any) {
    return this.notificationRepository.findByUserId(userId, query);
  }

  async findById(id: string) {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async findUnread(userId: string) {
    return this.notificationRepository.findUnread(userId);
  }

  async markAsRead(id: string) {
    await this.findById(id);
    return this.notificationRepository.markAsRead(id);
  }

  async markAllAsRead(userId: string) {
    return this.notificationRepository.markAllAsRead(userId);
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return this.notificationRepository.update(id, updateNotificationDto);
  }

  async remove(id: string) {
    return this.notificationRepository.remove(id);
  }
}
