import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportRepository } from '../../repositories/report/report.repository';
import { CreateReportDto, UpdateReportDto } from '../../dto/report';

@Injectable()
export class ReportService {
  constructor(private reportRepository: ReportRepository) {}

  async fileReport(dto: CreateReportDto) {
    return this.reportRepository.create(dto);
  }

  async getReports() {
    return this.reportRepository.findAll();
  }

  async handleReport(id: string, dto: UpdateReportDto) {
    const report = await this.reportRepository.findById(id);
    if (!report) throw new NotFoundException('Report not found');
    return this.reportRepository.update(id, dto);
  }

  async dismissReport(id: string) {
    const report = await this.reportRepository.findById(id);
    if (!report) throw new NotFoundException('Report not found');
    return this.reportRepository.update(id, { status: 'dismissed' as any });
  }
}
