import { UserRole } from '../../constants';
export declare class AdminUpdateUserDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: UserRole;
    isActive?: boolean;
}
