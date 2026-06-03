import { SessionStatus } from '../../constants';
import { Mentor } from '../mentor/mentor.entity';
import { Mentee } from '../mentee/mentee.entity';
export declare class Session {
    id: string;
    mentor: Mentor;
    mentorId: string;
    mentee: Mentee;
    menteeId: string;
    title: string;
    description: string;
    scheduledAt: Date;
    duration: number;
    status: SessionStatus;
    meetingLink: string;
    notes: string;
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    feedbacks: any;
}
