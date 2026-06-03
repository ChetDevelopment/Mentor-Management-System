import { MentorService } from '../../services/mentor/mentor.service';
import { CreateMentorDto, UpdateMentorDto } from '../../dto/mentor';
export declare class MentorController {
    private readonly mentorService;
    constructor(mentorService: MentorService);
    findAll(query: any): Promise<import("../../entities/mentor/mentor.entity").Mentor[]>;
    findOne(id: string): Promise<import("../../entities/mentor/mentor.entity").Mentor>;
    create(createMentorDto: CreateMentorDto): Promise<import("../../entities/mentor/mentor.entity").Mentor>;
    updateMentor(id: string, updateMentorDto: UpdateMentorDto, user: any): Promise<import("../../entities/mentor/mentor.entity").Mentor>;
    deleteMentor(id: string): Promise<void>;
    approveMentor(id: string): Promise<import("../../entities/mentor/mentor.entity").Mentor>;
    rejectMentor(id: string, reason: string): Promise<{
        message: string;
    }>;
    suspendMentor(id: string): Promise<import("../../entities/mentor/mentor.entity").Mentor>;
    uploadAvatar(file: any, user: any): Promise<{
        message: string;
        filePath: any;
    }>;
    uploadCv(file: any, user: any): Promise<{
        message: string;
        filePath: any;
    }>;
}
