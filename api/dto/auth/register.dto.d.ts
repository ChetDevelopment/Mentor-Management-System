import { UserRole } from '../../constants';
export declare class RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: UserRole;
}
