import { UserRole } from '../../constants';
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: UserRole;
    phone?: string;
}
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
    role?: UserRole;
    isActive?: boolean;
}
export declare class UserResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    phone?: string;
    avatar?: string;
    isActive: boolean;
}
