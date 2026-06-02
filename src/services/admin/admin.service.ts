import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/user/user.repository';
import { MentorRepository } from '../../repositories/mentor/mentor.repository';
import { MenteeRepository } from '../../repositories/mentee/mentee.repository';
import { SessionRepository } from '../../repositories/session/session.repository';
import { FeedbackService } from '../feedback/feedback.service';
import { MentorStatus, SessionStatus } from '../../constants';

@Injectable()
export class AdminService {
  getMentors(arg0: { page: number; limit: number; }) {
    throw new Error('Method not implemented.');
  }
  getUsers(arg0: { search: string; filter: string; page: number; limit: number; }) {
    throw new Error('Method not implemented.');
  }
  handleReport(id: string, body: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly userRepo: UserRepository,
    private readonly mentorRepo: MentorRepository,
    private readonly menteeRepo: MenteeRepository,
    private readonly sessionRepo: SessionRepository,
    private readonly feedbackService: FeedbackService,
  ) {}

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
        session => session.status === SessionStatus.SCHEDULED,
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

  async findAllUsers(query?: any) {
    return this.userRepo.findAll();
  }

  async findAllMentors(query?: any) {
    return this.mentorRepo.findAll(query);
  }

  async findAllMentees(query?: any) {
    return this.menteeRepo.findAll();
  }

  async deactivateUser(id: string) {
    return this.userRepo.update(id, { isActive: false });
  }

  async deleteUser(id: string) {
    return this.userRepo.delete(id);
  }
}
