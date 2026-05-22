import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogController } from '../controllers/activity-log/activity-log.controller';
import { ActivityLogService } from '../../services/activity-log/activity-log.service';
import { ActivityLogRepository } from '../../repositories/activity-log/activity-log.repository';
import { ActivityLog } from '../../entities/activity-log/activity-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog])],
  controllers: [ActivityLogController],
  providers: [ActivityLogService, ActivityLogRepository],
  exports: [ActivityLogService],
})
export class ActivityLogModule {}
