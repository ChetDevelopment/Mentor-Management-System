import { Injectable, NotFoundException } from '@nestjs/common';
import { SessionRepository } from '../../repositories/session/session.repository';
import { CreateSessionDto, UpdateSessionDto } from '../../dto/session';
import { Session } from '../../entities/session/session.entity';

@Injectable()
export class SessionService {
  constructor(private sessionRepository: SessionRepository) {}

  async create(createSessionDto: CreateSessionDto, user: any) {
    const sessionData: Partial<Session> = {
      mentorId: createSessionDto.mentorId,
      menteeId: createSessionDto.menteeId,
      title: createSessionDto.title,
      description: createSessionDto.description,
      scheduledAt: new Date(createSessionDto.scheduledAt),
      duration: createSessionDto.duration ? Number(createSessionDto.duration) : undefined,
      meetingLink: createSessionDto.meetingLink,
    };

    return this.sessionRepository.create(sessionData);
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
    const sessionData: Partial<Session> = {
      title: updateSessionDto.title,
      description: updateSessionDto.description,
      meetingLink: updateSessionDto.meetingLink,
      notes: updateSessionDto.notes,
    };

    if (updateSessionDto.scheduledAt) {
      sessionData.scheduledAt = new Date(updateSessionDto.scheduledAt);
    }

    if (updateSessionDto.status) {
      sessionData.status = updateSessionDto.status;
    }

    return this.sessionRepository.update(id, sessionData);
  }

  async remove(id: string) {
    return this.sessionRepository.remove(id);
  }
}
