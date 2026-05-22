import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from '../controllers/notification/notification.controller';
import { NotificationService } from '../../services/notification/notification.service';
import { NotificationRepository } from '../../repositories/notification/notification.repository';
import { Notification } from '../../entities/notification/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService],
})
export class NotificationModule {}
