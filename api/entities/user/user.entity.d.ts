import { UserRole } from '../../constants';
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    phone: string;
    avatar: string;
    isActive: boolean;
    isEmailVerified: boolean;
    emailVerificationToken: string;
    emailVerifiedAt: Date;
    failedLoginCount: number;
    lockedUntil: Date;
    lastLogin: Date;
    resetToken: string;
    resetTokenExpiry: Date;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
