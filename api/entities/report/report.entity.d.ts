export declare enum ReportStatus {
    PENDING = "pending",
    REVIEWED = "reviewed",
    DISMISSED = "dismissed"
}
export declare class Report {
    id: string;
    reporterId: string;
    reportedId: string;
    reason: string;
    description: string;
    status: ReportStatus;
    adminNote: string;
    createdAt: Date;
    updatedAt: Date;
}
