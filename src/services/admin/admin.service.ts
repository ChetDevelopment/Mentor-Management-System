import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/user/user.repository';
import { MentorRepository } from '../../repositories/mentor/mentor.repository';
import { MenteeRepository } from '../../repositories/mentee/mentee.repository';
import { MentorStatus } from '../../constants';

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
  ) {}

  async getDashboardStats() {
    const users = await this.userRepo.findAll();
    const mentors = await this.mentorRepo.findAll();
    const mentees = await this.menteeRepo.findAll();
    return {
      totalUsers: users.length,
      totalMentors: mentors.length,
      totalMentees: mentees.length,
    };
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
