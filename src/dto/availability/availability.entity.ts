import { IsString, IsEnum, IsOptional, IsBoolean, Matches } from 'class-validator';

export enum DayOfWeek {
  MON = 'Mon',
  TUE = 'Tue',
  WED = 'Wed',
  THU = 'Thu',
  FRI = 'Fri',
  SAT = 'Sat',
  SUN = 'Sun',
}

export class CreateAvailabilityDto {
  @IsString()
  mentorId: string;

  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  startTime: string; // HH:mm

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  endTime: string; // HH:mm

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateAvailabilityDto {
  @IsOptional()
  @IsEnum(DayOfWeek)
  dayOfWeek?: DayOfWeek;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  startTime?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  endTime?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class BlockDateDto {
  @IsString()
  mentorId: string;

  @IsString()
  blockedDate: string; // YYYY-MM-DD

  @IsOptional()
  @IsString()
  reason?: string;
}
