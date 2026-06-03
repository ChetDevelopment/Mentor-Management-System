import { ReportRepository } from '../../repositories/report/report.repository';
import { CreateReportDto, UpdateReportDto } from '../../dto/report';
export declare class ReportService {
    private reportRepository;
    constructor(reportRepository: ReportRepository);
    fileReport(dto: CreateReportDto): Promise<import("../../entities/report/report.entity").Report>;
    getReports(): Promise<import("../../entities/report/report.entity").Report[]>;
    handleReport(id: string, dto: UpdateReportDto): Promise<import("../../entities/report/report.entity").Report>;
    dismissReport(id: string): Promise<import("../../entities/report/report.entity").Report>;
}
