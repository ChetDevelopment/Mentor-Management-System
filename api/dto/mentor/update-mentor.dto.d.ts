import { MentorStatus } from '../../constants';
export declare class UpdateMentorDto {
    title?: string;
    company?: string;
    shortDescription?: string;
    fullBio?: string;
    yearsOfExperience?: number;
    skills?: string[];
    nid?: string;
    phone?: string;
    isAvailable?: boolean;
    status?: MentorStatus;
}
