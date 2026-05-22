import { Injectable, NotFoundException } from '@nestjs/common';
import { MenteeRepository } from '../../repositories/mentee/mentee.repository';
import { CreateMenteeDto, UpdateMenteeDto } from '../../dto/mentee';

@Injectable()
export class MenteeService {
  constructor(private menteeRepository: MenteeRepository) {}

  async create(createMenteeDto: CreateMenteeDto) {
    return this.menteeRepository.create(createMenteeDto);
  }

  async findAll(query?: any) {
    return this.menteeRepository.findAll(query);
  }

  async findById(id: string) {
    const mentee = await this.menteeRepository.findById(id);
    if (!mentee) {
      throw new NotFoundException('Mentee not found');
    }
    return mentee;
  }

  async findByUserId(userId: string) {
    return this.menteeRepository.findByUserId(userId);
  }

  async update(id: string, updateMenteeDto: UpdateMenteeDto) {
    return this.menteeRepository.update(id, updateMenteeDto);
  }

  async remove(id: string) {
    return this.menteeRepository.remove(id);
  }
}
