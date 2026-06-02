import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockedDate } from '../../entities/blocked-date.entity';

@Injectable()
export class BlockedDateRepository {
  constructor(
    @InjectRepository(BlockedDate)
    private repository: Repository<BlockedDate>,
  ) {}

  async findById(id: string): Promise<BlockedDate | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByMentorId(mentorId: string): Promise<BlockedDate[]> {
    return this.repository.find({ where: { mentorId } });
  }

  async create(data: Partial<BlockedDate>): Promise<BlockedDate> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
