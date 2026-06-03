import { Module } from '@nestjs/common';
import { AdminController } from '../../controllers/admin/admin.controller';
import { AdminService } from '../../services/admin/admin.service';
import { UserModule } from '../user/user.module';
import { MentorModule } from '../mentor/mentor.module';
import { MenteeModule } from '../mentee/mentee.module';
import { SessionModule } from '../session/session.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { ReportModule } from '../report/report.module';

@Module({
  imports: [UserModule, MentorModule, MenteeModule, SessionModule, FeedbackModule, ReportModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
