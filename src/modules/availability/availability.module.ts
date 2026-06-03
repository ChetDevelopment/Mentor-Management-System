import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Availability } from '../../entities/availability/availability.entity';
import { BlockedDate } from '../../entities/blocked-date.entity';
import { AvailabilityController } from '../../controllers/availability/availability.controller';
import { AvailabilityService } from '../../services/availability/availability.service';
import { AvailabilityRepository } from '../../repositories/availability/availability.repository';
import { BlockedDateRepository } from '../../repositories/blocked-date/blocked-date.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Availability, BlockedDate])],
  controllers: [AvailabilityController],
  providers: [AvailabilityService, AvailabilityRepository, BlockedDateRepository],
  exports: [AvailabilityService, AvailabilityRepository],
})
export class AvailabilityModule {}
