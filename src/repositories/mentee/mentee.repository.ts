import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mentee } from '../../entities/mentee/mentee.entity';

@Injectable()
export class MenteeRepository {
  constructor(
    @InjectRepository(Mentee)
    private repository: Repository<Mentee>,
  ) {}

  async create(data: Partial<Mentee>): Promise<Mentee> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findAll(query?: any): Promise<Mentee[]> {
    return this.repository.find({
      where: query,
      relations: ['user'],
    });
  }

  async findById(id: string): Promise<Mentee | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string): Promise<Mentee | null> {
    return this.repository.findOne({
      where: { userId },
      relations: ['user'],
    });
  }

  async update(id: string, data: Partial<Mentee>): Promise<Mentee> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
