import { ReportStatus } from '../../entities/report/report.entity';
export declare class CreateReportDto {
    reporterId: string;
    reportedId: string;
    reason: string;
    description?: string;
}
export declare class UpdateReportDto {
    status?: ReportStatus;
    adminNote?: string;
}
