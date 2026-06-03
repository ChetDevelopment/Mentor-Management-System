import { MatchingStatus } from '../../constants';
export declare class CreateMatchingDto {
    mentorId: string;
    menteeId: string;
    reason?: string;
}
export declare class UpdateMatchingDto {
    status?: MatchingStatus;
    reason?: string;
}
