import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Matching } from '../../entities/matching/matching.entity';

@Injectable()
export class MatchingRepository {
  constructor(
    @InjectRepository(Matching)
    private repository: Repository<Matching>,
  ) {}

  async create(data: Partial<Matching>): Promise<Matching> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findAll(query?: any): Promise<Matching[]> {
    return this.repository.find({ where: query });
  }

  async findById(id: string): Promise<Matching | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByMentorId(mentorId: string): Promise<Matching[]> {
    return this.repository.find({ where: { mentorId } });
  }

  async findByMenteeId(menteeId: string): Promise<Matching[]> {
    return this.repository.find({ where: { menteeId } });
  }

  async update(id: string, data: Partial<Matching>): Promise<Matching> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
