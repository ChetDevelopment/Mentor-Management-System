import { MatchingStatus } from '../../constants';
export declare class Matching {
    id: string;
    mentorId: string;
    menteeId: string;
    status: MatchingStatus;
    reason: string;
    matchedBy: string;
    matchedAt: Date;
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
