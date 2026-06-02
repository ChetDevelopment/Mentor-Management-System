import { IsEmail, MinLength, IsEnum } from 'class-validator';

enum UserRole {
  ADMIN = 'ADMIN',
  MENTOR = 'MENTOR',
  MENTEE = 'MENTEE',
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @MinLength(2)
  firstName: string;

  @MinLength(2)
  lastName: string;

  @IsEnum(UserRole)
  role: UserRole;
}
