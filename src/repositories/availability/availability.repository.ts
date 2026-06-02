import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Availability } from '../../entities/availability.entity';

@Injectable()
export class AvailabilityRepository {
  constructor(
    @InjectRepository(Availability)
    private repository: Repository<Availability>,
  ) {}

  async findByMentorId(mentorId: string): Promise<Availability[]> {
    return this.repository.find({ where: { mentorId } });
  }

  async create(data: Partial<Availability>): Promise<Availability> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<Availability>): Promise<Availability> {
    await this.repository.update(id, data);
    return this.repository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
