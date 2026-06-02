import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { SessionStatus } from '../../constants';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  mentorId: string;

  @IsString()
  @IsNotEmpty()
  menteeId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string;

  @IsInt()
  @Min(15)
  @Max(180)
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  meetingLink?: string;
}

export class UpdateSessionDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsEnum(SessionStatus)
  @IsOptional()
  status?: SessionStatus;

  @IsString()
  @IsOptional()
  meetingLink?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
