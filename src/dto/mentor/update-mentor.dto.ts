import { IsString, IsOptional, IsNumber, IsArray, IsBoolean, IsEnum, Matches, MaxLength } from 'class-validator';
import { MentorStatus } from '../../constants';

export class UpdateMentorDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  @MaxLength(160)
  shortDescription?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  fullBio?: string;

  @IsNumber()
  @IsOptional()
  yearsOfExperience?: number;

  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsString()
  @IsOptional()
  @Matches(/^\d{10}$|^\d{17}$/, { message: 'NID must be 10 or 17 digits' })
  nid?: string;

  @IsString()
  @IsOptional()
  @Matches(/^01[3-9]\d{8}$/, { message: 'Phone must be a valid Bangladeshi number' })
  phone?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsEnum(MentorStatus)
  @IsOptional()
  status?: MentorStatus;
}
