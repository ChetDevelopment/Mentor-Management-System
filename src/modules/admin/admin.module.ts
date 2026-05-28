import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from '../../controllers/admin/admin.controller';
import { AdminService } from '../../services/admin/admin.service';
import { UserRepository } from '../../repositories/user/user.repository';
import { MentorRepository } from '../../repositories/mentor/mentor.repository';
import { MenteeRepository } from '../../repositories/mentee/mentee.repository';
import { User } from '../../entities/user/user.entity';
import { Mentor } from '../../entities/mentor/mentor.entity';
import { Mentee } from '../../entities/mentee/mentee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Mentor, Mentee])],
  controllers: [AdminController],
  providers: [AdminService, UserRepository, MentorRepository, MenteeRepository],
})
export class AdminModule {}
