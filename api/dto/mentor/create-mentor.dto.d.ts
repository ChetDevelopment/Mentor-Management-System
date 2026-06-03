import { MentorStatus } from '../../constants';
export declare class CreateMentorDto {
    userId: string;
    title?: string;
    company?: string;
    shortDescription?: string;
    fullBio?: string;
    yearsOfExperience?: number;
    skills?: string[];
    nid?: string;
    phone?: string;
    status?: MentorStatus;
}
