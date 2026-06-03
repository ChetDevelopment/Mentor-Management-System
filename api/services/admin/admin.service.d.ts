import { UserRepository } from '../../repositories/user/user.repository';
import { MentorRepository } from '../../repositories/mentor/mentor.repository';
import { MenteeRepository } from '../../repositories/mentee/mentee.repository';
import { SessionRepository } from '../../repositories/session/session.repository';
import { FeedbackService } from '../feedback/feedback.service';
import { ReportService } from '../report/report.service';
import { AuthRepository } from '../../repositories/auth/auth.repository';
import { SessionManagementRepository } from '../../repositories/session/session-management.repository';
export declare class AdminService {
    private readonly userRepo;
    private readonly mentorRepo;
    private readonly menteeRepo;
    private readonly sessionRepo;
    private readonly feedbackService;
    private readonly reportService;
    private readonly authRepo;
    private readonly sessionMgmtRepo;
    constructor(userRepo: UserRepository, mentorRepo: MentorRepository, menteeRepo: MenteeRepository, sessionRepo: SessionRepository, feedbackService: FeedbackService, reportService: ReportService, authRepo: AuthRepository, sessionMgmtRepo: SessionManagementRepository);
    getUsers({ search, filter, page, limit }: {
        search?: string;
        filter?: string;
        page: number;
        limit: number;
    }): Promise<{
        data: import("../../entities/user/user.entity").User[];
        total: number;
        page: number;
        limit: number;
    }>;
    getMentors({ page, limit }: {
        page: number;
        limit: number;
    }): Promise<{
        data: import("../../entities/mentor/mentor.entity").Mentor[];
        total: number;
        page: number;
        limit: number;
    }>;
    getMentees({ page, limit }: {
        page: number;
        limit: number;
    }): Promise<{
        data: import("../../entities/mentee/mentee.entity").Mentee[];
        total: number;
        page: number;
        limit: number;
    }>;
    handleReport(id: string, body: any): Promise<import("../../entities/report/report.entity").Report>;
    getDashboardStats(): Promise<{
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
    deactivateUser(id: string): Promise<{
        message: string;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    resetPassword(id: string): Promise<{
        message: string;
        newPassword: string;
    }>;
    deleteFeedback(id: string): Promise<void>;
    getReports(): Promise<any[]>;
    private getTopMentorsByRating;
    private getTopMentorsByTotalSessions;
    private getMostRequestedSkills;
    private mapMentorSummary;
    private roundToTwo;
    findAllUsers(): Promise<import("../../entities/user/user.entity").User[]>;
    findAllMentors(query?: any): Promise<import("../../entities/mentor/mentor.entity").Mentor[]>;
    findAllMentees(): Promise<import("../../entities/mentee/mentee.entity").Mentee[]>;
}
