import { User } from '../user/user.entity';
import { MentorStatus } from '../../constants';
import { Skill } from '../skill/skill.entity';
export declare enum AvailabilityStatus {
    AVAILABLE = "available",
    BUSY = "busy",
    UNAVAILABLE = "unavailable"
}
export declare class Mentor {
    id: string;
    user: User;
    userId: string;
    nid: string;
    phone: string;
    avatar: string;
    cvUrl: string;
    portfolioUrl: string;
    shortDescription: string;
    fullBio: string;
    status: MentorStatus;
    rejectionReason: string;
    approvedAt: Date;
    title: string;
    company: string;
    yearsOfExperience: number;
    skills: Skill[];
    rating: number;
    totalSessions: number;
    availabilityStatus: AvailabilityStatus;
    profileCompleteness: number;
    createdAt: Date;
    updatedAt: Date;
    feedbacks: any;
}
