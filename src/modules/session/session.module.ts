import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionController } from '../../controllers/session/session.controller';
import { SessionService } from '../../services/session/session.service';
import { SessionRepository } from '../../repositories/session/session.repository';
import { Session } from '../../entities/session/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  controllers: [SessionController],
  providers: [SessionService, SessionRepository],
  exports: [SessionService, SessionRepository],
})
export class SessionModule {}
