import { SessionStatus } from '../../constants';
export declare class CreateSessionDto {
    mentorId: string;
    menteeId: string;
    title: string;
    description?: string;
    scheduledAt: string;
    duration?: number;
    meetingLink?: string;
}
export declare class UpdateSessionDto {
    title?: string;
    description?: string;
    scheduledAt?: string;
    status?: SessionStatus;
    meetingLink?: string;
    notes?: string;
}
