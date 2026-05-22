import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from '../../entities/skill/skill.entity';

@Injectable()
export class SkillRepository {
  constructor(
    @InjectRepository(Skill)
    private repository: Repository<Skill>,
  ) {}

  async create(data: Partial<Skill>): Promise<Skill> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findAll(query?: any): Promise<Skill[]> {
    return this.repository.find({ where: query });
  }

  async findById(id: string): Promise<Skill | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Skill | null> {
    return this.repository.findOne({ where: { name } });
  }

  async update(id: string, data: Partial<Skill>): Promise<Skill> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
