import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../../entities/session/session.entity';
import { SessionStatus } from '../../constants';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(Session)
    private repository: Repository<Session>,
  ) {}

  async create(data: Partial<Session>): Promise<Session> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findAll(query?: any): Promise<Session[]> {
    return this.repository.find({
      where: query,
      relations: ['mentor', 'mentee'],
    });
  }

  async findById(id: string): Promise<Session | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['mentor', 'mentee'],
    });
  }

  async findByMentorId(mentorId: string): Promise<Session[]> {
    return this.repository.find({
      where: { mentorId },
      relations: ['mentor', 'mentee'],
    });
  }

  async findByMenteeId(menteeId: string): Promise<Session[]> {
    return this.repository.find({
      where: { menteeId },
      relations: ['mentor', 'mentee'],
    });
  }

  async update(id: string, data: Partial<Session>): Promise<Session> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async updateStatus(id: string, status: SessionStatus): Promise<Session> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
