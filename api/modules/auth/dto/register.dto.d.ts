declare enum UserRole {
    ADMIN = "ADMIN",
    MENTOR = "MENTOR",
    MENTEE = "MENTEE"
}
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}
export {};
