import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from '../../entities/activity-log/activity-log.entity';

@Injectable()
export class ActivityLogRepository {
  constructor(
    @InjectRepository(ActivityLog)
    private repository: Repository<ActivityLog>,
  ) {}

  async create(data: Partial<ActivityLog>): Promise<ActivityLog> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findAll(query?: any): Promise<ActivityLog[]> {
    return this.repository.find({
      where: query,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<ActivityLog | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<ActivityLog[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
