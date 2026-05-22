import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackController } from '../controllers/feedback/feedback.controller';
import { FeedbackService } from '../../services/feedback/feedback.service';
import { FeedbackRepository } from '../../repositories/feedback/feedback.repository';
import { Feedback } from '../../entities/feedback/feedback.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback])],
  controllers: [FeedbackController],
  providers: [FeedbackService, FeedbackRepository],
  exports: [FeedbackService],
})
export class FeedbackModule {}
