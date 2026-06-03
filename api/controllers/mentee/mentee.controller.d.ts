import { MenteeService } from '../../services/mentee/mentee.service';
import { CreateMenteeDto, UpdateMenteeDto } from '../../dto/mentee';
export declare class MenteeController {
    private menteeService;
    constructor(menteeService: MenteeService);
    findAll(query: any): Promise<import("../../entities/mentee/mentee.entity").Mentee[]>;
    findOne(id: string): Promise<import("../../entities/mentee/mentee.entity").Mentee>;
    create(createMenteeDto: CreateMenteeDto, user: any): Promise<import("../../entities/mentee/mentee.entity").Mentee>;
    update(id: string, updateMenteeDto: UpdateMenteeDto, user: any): Promise<import("../../entities/mentee/mentee.entity").Mentee>;
    remove(id: string): Promise<void>;
}
