import { IsString, IsNotEmpty, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateMenteeDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  occupation?: string;

  @IsString()
  @IsOptional()
  organization?: string;

  @IsString()
  @IsOptional()
  goals?: string;

  @IsArray()
  @IsOptional()
  interests?: string[];
}

export class UpdateMenteeDto {
  @IsString()
  @IsOptional()
  occupation?: string;

  @IsString()
  @IsOptional()
  organization?: string;

  @IsString()
  @IsOptional()
  goals?: string;

  @IsArray()
  @IsOptional()
  interests?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
