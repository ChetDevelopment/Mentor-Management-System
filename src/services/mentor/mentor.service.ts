import { Injectable, NotFoundException } from '@nestjs/common';
import { MentorRepository } from '../../repositories/mentor/mentor.repository';
import { CreateMentorDto, UpdateMentorDto } from '../../dto/mentor';

@Injectable()
export class MentorService {
  constructor(private mentorRepository: MentorRepository) {}

  async create(createMentorDto: CreateMentorDto) {
    return this.mentorRepository.create(createMentorDto);
  }

  async findAll(query?: any) {
    return this.mentorRepository.findAll(query);
  }

  async findById(id: string) {
    const mentor = await this.mentorRepository.findById(id);
    if (!mentor) {
      throw new NotFoundException('Mentor not found');
    }
    return mentor;
  }

  async findByUserId(userId: string) {
    return this.mentorRepository.findByUserId(userId);
  }

  async update(id: string, updateMentorDto: UpdateMentorDto) {
    return this.mentorRepository.update(id, updateMentorDto);
  }

  async remove(id: string) {
    return this.mentorRepository.remove(id);
  }
}
