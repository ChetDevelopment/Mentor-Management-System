import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenteeController } from '../controllers/mentee/mentee.controller';
import { MenteeService } from '../../services/mentee/mentee.service';
import { MenteeRepository } from '../../repositories/mentee/mentee.repository';
import { Mentee } from '../../entities/mentee/mentee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mentee])],
  controllers: [MenteeController],
  providers: [MenteeService, MenteeRepository],
  exports: [MenteeService],
})
export class MenteeModule {}
