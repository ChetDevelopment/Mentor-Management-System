import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsArray, IsEnum, MaxLength } from 'class-validator';
import { MentorStatus } from '../../constants';

export class CreateMentorDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  nid: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  cvUrl?: string;

  @IsString()
  @IsOptional()
  portfolioUrl?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  fullBio?: string;

  @IsEnum(MentorStatus)
  @IsOptional()
  status?: MentorStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsNumber()
  @IsOptional()
  yearsOfExperience?: number;

  @IsArray()
  @IsOptional()
  skills?: string[];
}

export class UpdateMentorDto {
  @IsString()
  @IsOptional()
  nid?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  cvUrl?: string;

  @IsString()
  @IsOptional()
  portfolioUrl?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  fullBio?: string;

  @IsEnum(MentorStatus)
  @IsOptional()
  status?: MentorStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsNumber()
  @IsOptional()
  yearsOfExperience?: number;

  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
