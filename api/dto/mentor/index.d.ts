export declare class CreateMentorDto {
    userId: string;
    nid: string;
    phone?: string;
    avatar?: string;
    cvUrl?: string;
    portfolioUrl?: string;
    shortDescription?: string;
    fullBio?: string;
    title?: string;
    company?: string;
    yearsOfExperience?: number;
    skills?: string[];
}
export declare class MentorSelfUpdateDto {
    phone?: string;
    avatar?: string;
    cvUrl?: string;
    portfolioUrl?: string;
    shortDescription?: string;
    fullBio?: string;
    title?: string;
    company?: string;
    yearsOfExperience?: number;
    skills?: string[];
}
export { MentorSelfUpdateDto as UpdateMentorDto };
