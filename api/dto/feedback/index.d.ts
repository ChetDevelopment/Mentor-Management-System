export declare class CreateFeedbackDto {
    mentorId: string;
    menteeId: string;
    sessionId?: string;
    ratingKnowledge?: number;
    ratingCommunication?: number;
    ratingHelpfulness?: number;
    rating?: number;
    comment?: string;
    isAnonymous?: boolean;
}
export declare class UpdateFeedbackDto {
    rating?: number;
    comment?: string;
}
export declare class RespondFeedbackDto {
    mentorResponse: string;
}
