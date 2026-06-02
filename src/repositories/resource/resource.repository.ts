import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../../entities/resource/resource.entity';

@Injectable()
export class ResourceRepository {
  constructor(
    @InjectRepository(Resource)
    private repository: Repository<Resource>,
  ) {}

  async create(data: Partial<Resource>): Promise<Resource> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findByMentorId(mentorId: string): Promise<Resource[]> {
    return this.repository.find({ where: { mentorId } });
  }

  async findById(id: string): Promise<Resource | null> {
    return this.repository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
