import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/user/user.repository';
import { MentorRepository } from '../../repositories/mentor/mentor.repository';
import { MenteeRepository } from '../../repositories/mentee/mentee.repository';

@Injectable()
export class AdminService {
  constructor(
    private userRepository: UserRepository,
    private mentorRepository: MentorRepository,
    private menteeRepository: MenteeRepository,
  ) {}

  async getDashboardStats() {
    const [totalUsers, totalMentors, totalMentees] = await Promise.all([
      this.userRepository.findAll(),
      this.mentorRepository.findAll(),
      this.menteeRepository.findAll(),
    ]);

    return {
      totalUsers: totalUsers.length,
      totalMentors: totalMentors.length,
      totalMentees: totalMentees.length,
      activeSessions: 0,
    };
  }

  async findAllUsers(query?: any) {
    return this.userRepository.findAll();
  }

  async findAllMentors(query?: any) {
    return this.mentorRepository.findAll(query);
  }

  async findAllMentees(query?: any) {
    return this.menteeRepository.findAll(query);
  }

  async deactivateUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.update(id, { isActive: false });
  }

  async deleteUser(id: string) {
    return this.userRepository.remove(id);
  }
}
