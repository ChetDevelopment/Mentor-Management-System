import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { MatchingStatus } from '../../constants';

export class CreateMatchingDto {
  @IsString()
  @IsNotEmpty()
  mentorId: string;

  @IsString()
  @IsNotEmpty()
  menteeId: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class UpdateMatchingDto {
  @IsEnum(MatchingStatus)
  @IsOptional()
  status?: MatchingStatus;

  @IsString()
  @IsOptional()
  reason?: string;
}
