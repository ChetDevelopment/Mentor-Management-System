import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';

export class CreateMentorDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

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
