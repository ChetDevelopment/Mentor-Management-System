import { MatchingService } from '../../services/matching/matching.service';
import { CreateMatchingDto, UpdateMatchingDto } from '../../dto/matching';
export declare class MatchingController {
    private matchingService;
    constructor(matchingService: MatchingService);
    getRecommended(skill?: string, user?: any): Promise<{
        matchScore: number;
        id: string;
        user: import("../../entities/user/user.entity").User;
        userId: string;
        nid: string;
        phone: string;
        avatar: string;
        cvUrl: string;
        portfolioUrl: string;
        shortDescription: string;
        fullBio: string;
        status: import("../../constants").MentorStatus;
        rejectionReason: string;
        approvedAt: Date;
        title: string;
        company: string;
        yearsOfExperience: number;
        skills: import("../../entities/skill/skill.entity").Skill[];
        rating: number;
        totalSessions: number;
        availabilityStatus: import("../../entities/mentor/mentor.entity").AvailabilityStatus;
        profileCompleteness: number;
        createdAt: Date;
        updatedAt: Date;
        feedbacks: any;
    }[]>;
    findAll(query: any): Promise<import("../../entities/matching/matching.entity").Matching[]>;
    findOne(id: string, user: any): Promise<import("../../entities/matching/matching.entity").Matching>;
    create(createMatchingDto: CreateMatchingDto): Promise<import("../../entities/matching/matching.entity").Matching>;
    update(id: string, updateMatchingDto: UpdateMatchingDto, user: any): Promise<import("../../entities/matching/matching.entity").Matching>;
    remove(id: string): Promise<void>;
}
