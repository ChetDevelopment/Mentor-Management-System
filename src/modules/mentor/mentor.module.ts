import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorController } from '../controllers/mentor/mentor.controller';
import { MentorService } from '../../services/mentor/mentor.service';
import { MentorRepository } from '../../repositories/mentor/mentor.repository';
import { Mentor } from '../../entities/mentor/mentor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mentor])],
  controllers: [MentorController],
  providers: [MentorService, MentorRepository],
  exports: [MentorService],
})
export class MentorModule {}
