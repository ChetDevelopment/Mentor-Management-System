import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionController } from '../../controllers/session/session.controller';
import { SessionService } from '../../services/session/session.service';
import { SessionRepository } from '../../repositories/session/session.repository';
import { Session } from '../../entities/session/session.entity';
import { SessionRequest } from '../../entities/session-request/session-request.entity';
import { SessionRequestRepository } from '../../repositories/session-request/session-request.repository';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Session, SessionRequest]), NotificationModule],
  controllers: [SessionController],
  providers: [SessionService, SessionRepository, SessionRequestRepository],
  exports: [SessionService, SessionRepository],
})
export class SessionModule {}
