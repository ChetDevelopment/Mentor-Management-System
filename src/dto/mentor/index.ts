import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, MaxLength } from 'class-validator';

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

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    company?: string;

    @IsNumber()
    @IsOptional()
    yearsOfExperience?: number;

    @IsArray()
    @IsOptional()
    skills?: string[];
}

export class MentorSelfUpdateDto {
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

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    company?: string;

    @IsNumber()
    @IsOptional()
    yearsOfExperience?: number;

    @IsArray()
    @IsOptional()
    skills?: string[];
}

export { MentorSelfUpdateDto as UpdateMentorDto };
