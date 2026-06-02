import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max, IsBoolean } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  mentorId: string;

  @IsString()
  @IsNotEmpty()
  menteeId: string;

  @IsString()
  @IsOptional()
  sessionId?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  ratingKnowledge?: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  ratingCommunication?: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  ratingHelpfulness?: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;
}

export class UpdateFeedbackDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class RespondFeedbackDto {
  @IsString()
  @IsNotEmpty()
  mentorResponse: string;
}
