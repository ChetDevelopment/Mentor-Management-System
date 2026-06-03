import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ReportStatus } from '../../entities/report/report.entity';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  reporterId: string;

  @IsString()
  @IsNotEmpty()
  reportedId: string;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateReportDto {
  @IsEnum(ReportStatus)
  @IsOptional()
  status?: ReportStatus;

  @IsString()
  @IsOptional()
  adminNote?: string;
}
