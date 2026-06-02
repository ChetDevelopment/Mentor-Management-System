import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ResourceType } from '../../entities/resource/resource.entity';

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  mentorId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ResourceType)
  @IsOptional()
  type?: ResourceType;

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsString()
  @IsOptional()
  linkUrl?: string;

  @IsString()
  @IsOptional()
  sessionId?: string;
}
