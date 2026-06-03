import { AvailabilityRepository } from '../../repositories/availability/availability.repository';
import { BlockedDateRepository } from '../../repositories/blocked-date/blocked-date.repository';
import { CreateAvailabilityDto, UpdateAvailabilityDto, BlockDateDto } from '../../dto/availability/availability.entity';
export declare class AvailabilityService {
    private readonly availabilityRepo;
    private readonly blockedDateRepo;
    constructor(availabilityRepo: AvailabilityRepository, blockedDateRepo: BlockedDateRepository);
    getAvailability(mentorId: string): Promise<import("../../entities/availability/availability.entity").Availability[]>;
    findById(id: string): Promise<import("../../entities/availability/availability.entity").Availability>;
    setSchedule(dto: CreateAvailabilityDto, user?: any): Promise<import("../../entities/availability/availability.entity").Availability>;
    updateSchedule(id: string, dto: UpdateAvailabilityDto): Promise<import("../../entities/availability/availability.entity").Availability>;
    blockDate(dto: BlockDateDto): Promise<import("../../entities/blocked-date.entity").BlockedDate>;
    unblockDate(id: string): Promise<void>;
    removeSchedule(id: string): Promise<void>;
    getAvailableSlots(mentorId: string, date: string): Promise<{
        startTime: string;
        endTime: string;
    }[]>;
}
