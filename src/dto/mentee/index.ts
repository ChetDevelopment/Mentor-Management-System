import { IsString, IsNotEmpty, IsOptional, IsArray, IsBoolean, IsEnum } from 'class-validator';

export enum MenteeLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export class CreateMenteeDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(MenteeLevel)
  @IsOptional()
  currentLevel?: MenteeLevel;

  @IsString()
  @IsOptional()
  organization?: string;

  @IsString()
  @IsOptional()
  careerGoal?: string;

  @IsArray()
  @IsOptional()
  interests?: string[];
}

export class UpdateMenteeDto {
  @IsEnum(MenteeLevel)
  @IsOptional()
  currentLevel?: MenteeLevel;

  @IsString()
  @IsOptional()
  organization?: string;

  @IsString()
  @IsOptional()
  careerGoal?: string;

  @IsArray()
  @IsOptional()
  interests?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
