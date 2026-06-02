import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/user/user.repository';
import { MentorRepository } from '../../repositories/mentor/mentor.repository';
import { MenteeRepository } from '../../repositories/mentee/mentee.repository';
import { MentorStatus } from '../../constants';

@Injectable()
export class AdminService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly mentorRepo: MentorRepository,
    private readonly menteeRepo: MenteeRepository,
  ) {}

  async getAllUsers() {
    return this.userRepo.findAll();
  }

  async getDashboardStats() {
    const [users, mentors, mentees] = await Promise.all([
      this.userRepo.findAll(),
      this.mentorRepo.findAll(),
      this.menteeRepo.findAll(),
    ]);

    return {
      totalUsers: users.length,
      activeUsers: users.filter((user) => user.isActive).length,
      totalMentors: mentors.length,
      pendingMentors: mentors.filter(
        (mentor) => mentor.status === MentorStatus.PENDING,
      ).length,
      activeMentors: mentors.filter(
        (mentor) => mentor.status === MentorStatus.ACTIVE,
      ).length,
      totalMentees: mentees.length,
      activeMentees: mentees.filter((mentee) => mentee.isActive).length,
    };
  }

  async findAllUsers(query?: Record<string, any>) {
    return this.filterByQuery(await this.userRepo.findAll(), query);
  }

  async findAllMentors(query?: Record<string, any>) {
    return this.mentorRepo.findAll(query);
  }

  async findAllMentees(query?: Record<string, any>) {
    return this.menteeRepo.findAll(query);
  }

  async deactivateUser(id: string) {
    return this.userRepo.update(id, { isActive: false });
  }

  async deleteUser(id: string) {
    return this.userRepo.delete(id);
  }

  private filterByQuery<T extends Record<string, any>>(
    items: T[],
    query?: Record<string, any>,
  ) {
    if (!query || Object.keys(query).length === 0) {
      return items;
    }

    return items.filter((item) =>
      Object.entries(query).every(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          return true;
        }

        const itemValue = item[key];
        if (typeof itemValue === 'boolean') {
          return String(itemValue) === String(value);
        }

        return itemValue === value;
      }),
    );
  }
}
