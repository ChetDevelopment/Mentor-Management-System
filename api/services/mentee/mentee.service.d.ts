import { MenteeRepository } from '../../repositories/mentee/mentee.repository';
import { CreateMenteeDto, UpdateMenteeDto } from '../../dto/mentee';
export declare class MenteeService {
    private menteeRepository;
    constructor(menteeRepository: MenteeRepository);
    create(createMenteeDto: CreateMenteeDto): Promise<import("../../entities/mentee/mentee.entity").Mentee>;
    findAll(query?: any): Promise<import("../../entities/mentee/mentee.entity").Mentee[]>;
    findById(id: string): Promise<import("../../entities/mentee/mentee.entity").Mentee>;
    findByUserId(userId: string): Promise<import("../../entities/mentee/mentee.entity").Mentee>;
    update(id: string, updateMenteeDto: UpdateMenteeDto): Promise<import("../../entities/mentee/mentee.entity").Mentee>;
    remove(id: string): Promise<void>;
}
