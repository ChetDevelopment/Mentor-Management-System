import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from '../../entities/feedback/feedback.entity';

@Injectable()
export class FeedbackRepository {
  constructor(
    @InjectRepository(Feedback)
    private repository: Repository<Feedback>,
  ) {}

  async create(data: Partial<Feedback>): Promise<Feedback> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findAll(query?: any): Promise<Feedback[]> {
    return this.repository.find({ where: query });
  }

  async findById(id: string): Promise<Feedback | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByMentorId(mentorId: string): Promise<Feedback[]> {
    return this.repository.find({ where: { mentorId } });
  }

  async findBySessionId(sessionId: string): Promise<Feedback | null> {
    return this.repository.findOne({ where: { sessionId } });
  }

  async update(id: string, data: Partial<Feedback>): Promise<Feedback> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
