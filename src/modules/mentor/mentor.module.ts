import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorController } from '../../controllers/mentor/mentor.controller';
import { MentorService } from '../../services/mentor/mentor.service';
import { MentorRepository } from '../../repositories/mentor/mentor.repository';
import { Mentor } from '../../entities/mentor/mentor.entity';
import { Skill } from '../../entities/skill/skill.entity';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Mentor, Skill]), NotificationModule, UserModule],
  controllers: [MentorController],
  providers: [MentorService, MentorRepository],
  exports: [MentorService, MentorRepository],
})
export class MentorModule {}
