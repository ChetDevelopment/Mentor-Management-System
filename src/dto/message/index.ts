import { IsString, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;
}

export class MarkAsReadDto {
  @IsUUID()
  @IsNotEmpty()
  senderId: string;
}
