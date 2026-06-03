import { Repository } from 'typeorm';
import { Availability } from '../../entities/availability/availability.entity';
export declare class AvailabilityRepository {
    private repository;
    constructor(repository: Repository<Availability>);
    create(data: Partial<Availability>): Promise<Availability>;
    findByMentorId(mentorId: string): Promise<Availability[]>;
    findSlotsByDate(mentorId: string, date: string): Promise<Availability[]>;
    findById(id: string): Promise<Availability | null>;
    update(id: string, data: Partial<Availability>): Promise<Availability>;
    remove(id: string): Promise<void>;
}
