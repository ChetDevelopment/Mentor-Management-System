import {IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString} from 'class-validator';

export class CreateAvailabilityDto {
    @IsString()
    @IsNotEmpty()
    mentorId: string;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsNotEmpty()
    startTime: string;

    @IsString()
    @IsNotEmpty()
    endTime: string;

    @IsBoolean()
    @IsOptional()
    isBlocked?: boolean;
}

export class UpdateAvailabilityDto {
    @IsDateString()
    @IsOptional()
    date?: string;

    @IsString()
    @IsOptional()
    startTime?: string;

    @IsString()
    @IsOptional()
    endTime?: string;

    @IsBoolean()
    @IsOptional()
    isBlocked?: boolean;
}