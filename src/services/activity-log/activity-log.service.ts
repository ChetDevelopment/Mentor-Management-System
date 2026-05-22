import { Injectable, NotFoundException } from '@nestjs/common';
import { ActivityLogRepository } from '../../repositories/activity-log/activity-log.repository';
import { CreateActivityLogDto } from '../../dto/activity-log';

@Injectable()
export class ActivityLogService {
  constructor(private activityLogRepository: ActivityLogRepository) {}

  async create(createActivityLogDto: CreateActivityLogDto) {
    return this.activityLogRepository.create(createActivityLogDto);
  }

  async findAll(query?: any) {
    return this.activityLogRepository.findAll(query);
  }

  async findById(id: string) {
    const activityLog = await this.activityLogRepository.findById(id);
    if (!activityLog) {
      throw new NotFoundException('Activity log not found');
    }
    return activityLog;
  }

  async findByUserId(userId: string) {
    return this.activityLogRepository.findByUserId(userId);
  }

  async remove(id: string) {
    return this.activityLogRepository.remove(id);
  }
}
