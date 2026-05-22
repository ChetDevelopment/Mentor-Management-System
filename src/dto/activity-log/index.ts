import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ActivityType } from '../../constants';

export class CreateActivityLogDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsEnum(ActivityType)
  @IsNotEmpty()
  action: ActivityType;

  @IsString()
  @IsNotEmpty()
  entity: string;

  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  ipAddress?: string;

  @IsString()
  @IsOptional()
  userAgent?: string;

  @IsString()
  @IsOptional()
  metadata?: string;
}
