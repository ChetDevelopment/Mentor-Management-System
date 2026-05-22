import { Injectable, NotFoundException } from '@nestjs/common';
import { SessionRepository } from '../../repositories/session/session.repository';
import { CreateSessionDto, UpdateSessionDto } from '../../dto/session';

@Injectable()
export class SessionService {
  constructor(private sessionRepository: SessionRepository) {}

  async create(createSessionDto: CreateSessionDto, user: any) {
    return this.sessionRepository.create(createSessionDto);
  }

  async findAll(query?: any, user?: any) {
    return this.sessionRepository.findAll(query);
  }

  async findById(id: string) {
    const session = await this.sessionRepository.findById(id);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  async findByMentorId(mentorId: string) {
    return this.sessionRepository.findByMentorId(mentorId);
  }

  async findByMenteeId(menteeId: string) {
    return this.sessionRepository.findByMenteeId(menteeId);
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    return this.sessionRepository.update(id, updateSessionDto);
  }

  async remove(id: string) {
    return this.sessionRepository.remove(id);
  }
}
