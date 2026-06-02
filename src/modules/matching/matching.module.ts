import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchingController } from '../../controllers/matching/matching.controller';
import { MatchingService } from '../../services/matching/matching.service';
import { MatchingRepository } from '../../repositories/matching/matching.repository';
import { Matching } from '../../entities/matching/matching.entity';
import { MentorModule } from '../mentor/mentor.module';
import { AvailabilityModule } from '../availability/availability.module';

@Module({
  imports: [TypeOrmModule.forFeature([Matching]), MentorModule, AvailabilityModule],
  controllers: [MatchingController],
  providers: [MatchingService, MatchingRepository],
  exports: [MatchingService],
})
export class MatchingModule {}
