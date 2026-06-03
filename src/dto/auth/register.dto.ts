import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum, Matches } from 'class-validator';
import { UserRole } from '../../constants';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(12)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)',
    })
    password: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}
