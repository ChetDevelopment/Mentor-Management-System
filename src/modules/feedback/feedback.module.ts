import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackController } from '../../controllers/feedback/feedback.controller';
import { FeedbackService } from '../../services/feedback/feedback.service';
import { FeedbackRepository } from '../../repositories/feedback/feedback.repository';
import { Feedback } from '../../entities/feedback/feedback.entity';
import { SessionModule } from '../session/session.module';
import { MentorModule } from '../mentor/mentor.module';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback]), SessionModule, MentorModule],
  controllers: [FeedbackController],
  providers: [FeedbackService, FeedbackRepository],
  exports: [FeedbackService],
})
export class FeedbackModule {}
