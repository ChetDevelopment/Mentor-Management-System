import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/user/user.repository';
import { MentorRepository } from '../../repositories/mentor/mentor.repository';
import { MenteeRepository } from '../../repositories/mentee/mentee.repository';

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
}
