import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MentorModule } from './modules/mentor/mentor.module';
import { MenteeModule } from './modules/mentee/mentee.module';
import { SkillModule } from './modules/skill/skill.module';
import { SessionModule } from './modules/session/session.module';
import { MatchingModule } from './modules/matching/matching.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AdminModule } from './modules/admin/admin.module';
import { ActivityLogModule } from './modules/activity-log/activity-log.module';
import { ResourceModule } from './modules/resource/resource.module';
import { ReportModule } from './modules/report/report.module';
import { CategoryModule } from './modules/category/category.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { MessageModule } from './modules/message/message.module';
import { SharedModule } from './modules/shared/shared.module';
import { HealthController } from './controllers/health.controller';
import { AuthGuard } from './guards/auth.guard';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    MentorModule,
    MenteeModule,
    SkillModule,
    SessionModule,
    MatchingModule,
    FeedbackModule,
    NotificationModule,
    AdminModule,
    ActivityLogModule,
    ResourceModule,
    ReportModule,
    CategoryModule,
    AvailabilityModule,
    MessageModule,
    SharedModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
