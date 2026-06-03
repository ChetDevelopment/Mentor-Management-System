import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../repositories/user/user.repository';
import { MentorRepository } from '../../repositories/mentor/mentor.repository';
import { MenteeRepository } from '../../repositories/mentee/mentee.repository';
import { SessionRepository } from '../../repositories/session/session.repository';
import { FeedbackService } from '../feedback/feedback.service';
import { ReportService } from '../report/report.service';
import { AuthRepository } from '../../repositories/auth/auth.repository';
import { SessionManagementRepository } from '../../repositories/session/session-management.repository';
import { MentorStatus, SessionStatus } from '../../constants';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly mentorRepo: MentorRepository,
        private readonly menteeRepo: MenteeRepository,
        private readonly sessionRepo: SessionRepository,
        private readonly feedbackService: FeedbackService,
        private readonly reportService: ReportService,
        private readonly authRepo: AuthRepository,
        private readonly sessionMgmtRepo: SessionManagementRepository,
    ) {}

    async getUsers({ search, filter, page, limit }: { search?: string; filter?: string; page: number; limit: number }) {
        let users = await this.userRepo.findAll();
        if (filter) {
            users = users.filter(u => u.role === filter);
        }
        if (search) {
            const q = search.toLowerCase();
            users = users.filter(
                u => u.email.toLowerCase().includes(q) ||
                     u.firstName.toLowerCase().includes(q) ||
                     u.lastName.toLowerCase().includes(q),
            );
        }
        const start = (page - 1) * limit;
        return { data: users.slice(start, start + limit), total: users.length, page, limit };
    }

    async getMentors({ page, limit }: { page: number; limit: number }) {
        const mentors = await this.mentorRepo.findAll();
        const start = (page - 1) * limit;
        return { data: mentors.slice(start, start + limit), total: mentors.length, page, limit };
    }

    async getMentees({ page, limit }: { page: number; limit: number }) {
        const mentees = await this.menteeRepo.findAll();
        const start = (page - 1) * limit;
        return { data: mentees.slice(start, start + limit), total: mentees.length, page, limit };
    }

    async handleReport(id: string, body: any) {
        return this.reportService.handleReport(id, body);
    }

    async getDashboardStats() {
        const [users, mentors, mentorsWithSkills, mentees, sessions, feedbacks] =
            await Promise.all([
                this.userRepo.findAll(),
                this.mentorRepo.findAll(),
                this.mentorRepo.findAllWithSkills(),
                this.menteeRepo.findAll(),
                this.sessionRepo.findAll(),
                this.feedbackService.findAll(),
            ]);

        const sessionsByStatus = Object.values(SessionStatus).reduce(
            (summary, status) => ({
                ...summary,
                [status]: sessions.filter(session => session.status === status).length,
            }),
            {},
        );

        const completedSessions = sessions.filter(
            session => session.status === SessionStatus.COMPLETED,
        ).length;

        const averagePlatformRating =
            feedbacks.length > 0
                ? this.roundToTwo(
                      feedbacks.reduce((total, feedback) => total + feedback.rating, 0) /
                          feedbacks.length,
                  )
                : 0;

        return {
            totalUsers: users.length,
            totalMentors: mentors.length,
            totalMentees: mentees.length,
            activeSessions: sessions.filter(
                session => session.status === SessionStatus.CONFIRMED,
            ).length,
            sessionsByStatus,
            completionRate:
                sessions.length > 0
                    ? this.roundToTwo((completedSessions / sessions.length) * 100)
                    : 0,
            averagePlatformRating,
            topMentorsByRating: this.getTopMentorsByRating(mentors),
            topMentorsByTotalSessions: this.getTopMentorsByTotalSessions(mentors),
            mostRequestedSkills: this.getMostRequestedSkills(mentorsWithSkills),
            pendingMentorApprovals: mentors.filter(
                mentor => mentor.status === MentorStatus.PENDING,
            ).length,
        };
    }

    async deactivateUser(id: string) {
        const user = await this.userRepo.findById(id);
        if (!user) throw new NotFoundException('User not found');
        await this.userRepo.update(id, { isActive: false });
        // Revoke all sessions
        await this.sessionMgmtRepo.revokeAllUserSessions(id);
        await this.authRepo.deactivateByUserId(id);
        return { message: 'User deactivated' };
    }

    async deleteUser(id: string) {
        const user = await this.userRepo.findById(id);
        if (!user) throw new NotFoundException('User not found');
        await this.userRepo.update(id, { isActive: false });
        await this.sessionMgmtRepo.revokeAllUserSessions(id);
        await this.authRepo.deactivateByUserId(id);
        return { message: 'User deleted' };
    }

    async resetPassword(id: string) {
        const user = await this.userRepo.findById(id);
        if (!user) throw new NotFoundException('User not found');

        const newPassword = crypto.randomBytes(12).toString('hex');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userRepo.update(id, {
            password: hashedPassword,
            failedLoginCount: 0,
            lockedUntil: null,
        });

        // Revoke all sessions
        await this.sessionMgmtRepo.revokeAllUserSessions(id);
        await this.authRepo.deactivateByUserId(id);

        return { message: 'Password has been reset', newPassword };
    }

    async deleteFeedback(id: string) {
        return this.feedbackService.deleteFeedback(id);
    }

    async getReports() {
        return [];
    }

    private getTopMentorsByRating(mentors: any[]) {
        return [...mentors]
            .sort((a, b) => Number(b.rating) - Number(a.rating))
            .slice(0, 5)
            .map(mentor => this.mapMentorSummary(mentor));
    }

    private getTopMentorsByTotalSessions(mentors: any[]) {
        return [...mentors]
            .sort((a, b) => Number(b.totalSessions) - Number(a.totalSessions))
            .slice(0, 5)
            .map(mentor => this.mapMentorSummary(mentor));
    }

    private getMostRequestedSkills(mentors: any[]) {
        const skillCounts = new Map<string, { id: string; name: string; count: number }>();
        mentors.forEach(mentor => {
            mentor.skills?.forEach(skill => {
                const existing = skillCounts.get(skill.id) ?? {
                    id: skill.id,
                    name: skill.name,
                    count: 0,
                };
                skillCounts.set(skill.id, {
                    ...existing,
                    count: existing.count + 1,
                });
            });
        });
        return Array.from(skillCounts.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }

    private mapMentorSummary(mentor: any) {
        return {
            id: mentor.id,
            userId: mentor.userId,
            name: mentor.user
                ? `${mentor.user.firstName} ${mentor.user.lastName}`
                : undefined,
            title: mentor.title,
            rating: Number(mentor.rating),
            totalSessions: Number(mentor.totalSessions),
        };
    }

    private roundToTwo(value: number) {
        return Math.round(value * 100) / 100;
    }

    async findAllUsers() {
        return this.userRepo.findAll();
    }

    async findAllMentors(query?: any) {
        return this.mentorRepo.findAll(query);
    }

    async findAllMentees() {
        return this.menteeRepo.findAll();
    }
}
