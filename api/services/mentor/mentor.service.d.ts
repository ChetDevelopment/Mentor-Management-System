import { MentorRepository } from '../../repositories/mentor/mentor.repository';
import { CreateMentorDto, UpdateMentorDto } from '../../dto/mentor';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';
export declare class MentorService {
    private mentorRepository;
    private notificationService;
    private userService;
    constructor(mentorRepository: MentorRepository, notificationService: NotificationService, userService: UserService);
    create(createMentorDto: CreateMentorDto): Promise<import("../../entities/mentor/mentor.entity").Mentor>;
    findAll(query?: any): Promise<import("../../entities/mentor/mentor.entity").Mentor[]>;
    findById(id: string): Promise<import("../../entities/mentor/mentor.entity").Mentor>;
    findByUserId(userId: string): Promise<import("../../entities/mentor/mentor.entity").Mentor>;
    update(id: string, updateMentorDto: UpdateMentorDto): Promise<import("../../entities/mentor/mentor.entity").Mentor>;
    approve(id: string): Promise<import("../../entities/mentor/mentor.entity").Mentor>;
    reject(id: string, reason: string): Promise<{
        message: string;
    }>;
    suspend(id: string): Promise<import("../../entities/mentor/mentor.entity").Mentor>;
    remove(id: string): Promise<void>;
    delete(id: string): Promise<void>;
    private toSkillRefs;
}
