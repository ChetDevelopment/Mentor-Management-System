import { Injectable, NotFoundException } from '@nestjs/common';
import { AvailabilityRepository } from '../../repositories/availability/availability.repository';
import { BlockedDateRepository } from '../../repositories/blocked-date/blocked-date.repository';
import { CreateAvailabilityDto, UpdateAvailabilityDto, BlockDateDto } from '../../dto/availability/availability.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly availabilityRepo: AvailabilityRepository,
    private readonly blockedDateRepo: BlockedDateRepository,
  ) {}

  async getAvailability(mentorId: string) {
    return this.availabilityRepo.findByMentorId(mentorId);
  }

  async setSchedule(dto: CreateAvailabilityDto) {
    return this.availabilityRepo.create(dto);
  }

  async updateSchedule(id: string, dto: UpdateAvailabilityDto) {
    const existing = await this.availabilityRepo.findById(id);
    if (!existing) throw new NotFoundException(`Availability ${id} not found`);
    return this.availabilityRepo.update(id, dto);
  }

  async blockDate(dto: BlockDateDto) {
    return this.blockedDateRepo.create(dto);
  }

  async unblockDate(id: string) {
    const existing = await this.blockedDateRepo.findById(id);
    if (!existing) throw new NotFoundException(`Blocked date ${id} not found`);
    return this.blockedDateRepo.delete(id);
  }

  async getAvailableSlots(mentorId: string, date: string) {
    // Step 1: Get mentor availability by day of week
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    const availability = await this.availabilityRepo.findByMentorId(mentorId);
    const slots = availability.filter(a => a.dayOfWeek === dayOfWeek && a.isActive);

    // Step 2: Check if date is blocked
    const blocked = await this.blockedDateRepo.findByMentorId(mentorId);
    if (blocked.some(b => b.blockedDate === date)) {
      return []; // no slots available
    }

    // Step 3: Return open slots
    return slots.map(s => ({
      startTime: s.startTime,
      endTime: s.endTime,
    }));
  }
}
