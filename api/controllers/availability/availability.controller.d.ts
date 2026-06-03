import { AvailabilityService } from '../../services/availability/availability.service';
import { CreateAvailabilityDto, UpdateAvailabilityDto, BlockDateDto } from '../../dto/availability/availability.entity';
export declare class AvailabilityController {
    private readonly availabilityService;
    constructor(availabilityService: AvailabilityService);
    findByMentorId(mentorId: string): Promise<import("../../entities/availability/availability.entity").Availability[]>;
    findSlotsByDate(mentorId: string, date: string): Promise<{
        startTime: string;
        endTime: string;
    }[]>;
    create(dto: CreateAvailabilityDto, user: any): Promise<import("../../entities/availability/availability.entity").Availability>;
    update(id: string, dto: UpdateAvailabilityDto, user: any): Promise<import("../../entities/availability/availability.entity").Availability>;
    remove(id: string, user: any): Promise<void>;
    blockDate(dto: BlockDateDto, user: any): Promise<import("../../entities/blocked-date.entity").BlockedDate>;
    unblockDate(id: string, user: any): Promise<void>;
}
