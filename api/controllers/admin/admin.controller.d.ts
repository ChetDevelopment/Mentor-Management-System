import { AdminService } from '../../services/admin/admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        totalUsers: number;
        totalMentors: number;
        totalMentees: number;
        activeSessions: number;
        sessionsByStatus: {};
        completionRate: number;
        averagePlatformRating: number;
        topMentorsByRating: {
            id: any;
            userId: any;
            name: string;
            title: any;
            rating: number;
            totalSessions: number;
        }[];
        topMentorsByTotalSessions: {
            id: any;
            userId: any;
            name: string;
            title: any;
            rating: number;
            totalSessions: number;
        }[];
        mostRequestedSkills: {
            id: string;
            name: string;
            count: number;
        }[];
        pendingMentorApprovals: number;
    }>;
    getUsers(search?: string, filter?: string, page?: number, limit?: number): Promise<{
        data: import("../../entities/user/user.entity").User[];
        total: number;
        page: number;
        limit: number;
    }>;
    getMentors(page?: number, limit?: number): Promise<{
        data: import("../../entities/mentor/mentor.entity").Mentor[];
        total: number;
        page: number;
        limit: number;
    }>;
    getMentees(page?: number, limit?: number): Promise<{
        data: import("../../entities/mentee/mentee.entity").Mentee[];
        total: number;
        page: number;
        limit: number;
    }>;
    deactivateUser(id: string): Promise<{
        message: string;
    }>;
    resetPassword(id: string): Promise<{
        message: string;
        newPassword: string;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    deleteFeedback(id: string): Promise<void>;
    getReports(): Promise<any[]>;
    handleReport(id: string, body: any): Promise<import("../../entities/report/report.entity").Report>;
}
