import { User } from '../user/user.entity';
export declare enum MenteeLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced"
}
export declare class Mentee {
    id: string;
    user: User;
    userId: string;
    currentLevel: MenteeLevel;
    organization: string;
    careerGoal: string;
    interests: string[];
    isActive: boolean;
    profileCompleteness: number;
    createdAt: Date;
    updatedAt: Date;
    feedbacks: any;
}
