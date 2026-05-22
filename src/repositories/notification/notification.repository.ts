import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification/notification.entity';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private repository: Repository<Notification>,
  ) {}

  async create(data: Partial<Notification>): Promise<Notification> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findAll(query?: any): Promise<Notification[]> {
    return this.repository.find({
      where: query,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Notification | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: string, query?: any): Promise<Notification[]> {
    return this.repository.find({
      where: { userId, ...query },
      order: { createdAt: 'DESC' },
    });
  }

  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    return this.repository.find({
      where: { userId, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, data: Partial<Notification>): Promise<Notification> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
