import { Injectable, NotFoundException } from '@nestjs/common';
import { SkillRepository } from '../../repositories/skill/skill.repository';
import { CreateSkillDto, UpdateSkillDto } from '../../dto/skill';

@Injectable()
export class SkillService {
  constructor(private skillRepository: SkillRepository) {}

  async create(createSkillDto: CreateSkillDto) {
    return this.skillRepository.create(createSkillDto);
  }

  async findAll(query?: any) {
    return this.skillRepository.findAll(query);
  }

  async findById(id: string) {
    const skill = await this.skillRepository.findById(id);
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
    return skill;
  }

  async findByName(name: string) {
    return this.skillRepository.findByName(name);
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    return this.skillRepository.update(id, updateSkillDto);
  }

  async remove(id: string) {
    return this.skillRepository.remove(id);
  }
}
