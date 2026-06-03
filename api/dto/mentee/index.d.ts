export declare enum MenteeLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced"
}
export declare class CreateMenteeDto {
    userId: string;
    currentLevel?: MenteeLevel;
    organization?: string;
    careerGoal?: string;
    interests?: string[];
}
export declare class UpdateMenteeDto {
    currentLevel?: MenteeLevel;
    organization?: string;
    careerGoal?: string;
    interests?: string[];
}
