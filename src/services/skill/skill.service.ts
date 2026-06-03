import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SkillRepository } from '../../repositories/skill/skill.repository';
import { CreateSkillDto, UpdateSkillDto } from '../../dto/skill';

@Injectable()
export class SkillService {
  constructor(private skillRepository: SkillRepository) {}

  async create(createSkillDto: CreateSkillDto) {
    const existing = await this.skillRepository.findByName(createSkillDto.name);
    if (existing) {
      throw new BadRequestException('Skill already exists');
    }

    const { category, ...rest } = createSkillDto;
    return this.skillRepository.create({
      ...rest,
      categoryId: category,
    });
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

  async findByCategory(categoryId: string) {
    return this.skillRepository.findByCategory(categoryId);
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    const { category, ...rest } = updateSkillDto;
    return this.skillRepository.update(id, {
      ...rest,
      categoryId: category,
    });
  }

  async remove(id: string) {
    return this.skillRepository.remove(id);
  }
}
