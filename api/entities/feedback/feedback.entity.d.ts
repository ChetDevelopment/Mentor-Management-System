import { Mentor } from '../mentor/mentor.entity';
import { Mentee } from '../mentee/mentee.entity';
import { Session } from '../session/session.entity';
export declare class Feedback {
    id: string;
    mentorId: string;
    menteeId: string;
    sessionId: string;
    ratingKnowledge: number;
    ratingCommunication: number;
    ratingHelpfulness: number;
    overallRating: number;
    comment?: string;
    isAnonymous: boolean;
    rating: number;
    mentorResponse: string;
    createdAt: Date;
    mentor: Mentor;
    mentee: Mentee;
    session: Session;
}
