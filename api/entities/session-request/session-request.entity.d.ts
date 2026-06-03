export declare enum SessionRequestStatus {
    PENDING = "pending",
    APPROVED = "approved",
    DECLINED = "declined"
}
export declare class SessionRequest {
    id: string;
    sessionId: string;
    message: string;
    requestStatus: SessionRequestStatus;
    respondedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
