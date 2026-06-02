import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '../../entities/report/report.entity';
import { ReportRepository } from '../../repositories/report/report.repository';
import { ReportService } from '../../services/report/report.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  providers: [ReportService, ReportRepository],
  exports: [ReportService],
})
export class ReportModule {}
