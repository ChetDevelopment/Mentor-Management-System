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

    async findById(id: string) {
        const availability = await this.availabilityRepo.findById(id);
        if (!availability) throw new NotFoundException(`Availability ${id} not found`);
        return availability;
    }

    async setSchedule(dto: CreateAvailabilityDto, user?: any) {
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

    async removeSchedule(id: string) {
        const existing = await this.availabilityRepo.findById(id);
        if (!existing) throw new NotFoundException(`Availability ${id} not found`);
        return this.availabilityRepo.remove(id);
    }

    async getAvailableSlots(mentorId: string, date: string) {
        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
        const availability = await this.availabilityRepo.findByMentorId(mentorId);
        const slots = availability.filter(a => a.dayOfWeek === dayOfWeek && a.isActive);

        const blocked = await this.blockedDateRepo.findByMentorId(mentorId);
        if (blocked.some(b => b.blockedDate === date)) {
            return [];
        }

        return slots.map(s => ({
            startTime: s.startTime,
            endTime: s.endTime,
        }));
    }
}
