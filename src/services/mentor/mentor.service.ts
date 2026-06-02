import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MentorRepository } from '../../repositories/mentor/mentor.repository';
import { CreateMentorDto, UpdateMentorDto } from '../../dto/mentor';
import { MentorStatus } from '../../constants';

@Injectable()
export class MentorService {
  constructor(private mentorRepository: MentorRepository) {}

  async create(createMentorDto: CreateMentorDto) {
    return this.mentorRepository.create(createMentorDto as any);
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
    return this.mentorRepository.update(id, updateMentorDto as any);
  }

  async approve(id: string) {
    await this.findById(id);
    return this.mentorRepository.updateStatus(id, MentorStatus.APPROVED);
  }

  async reject(id: string, reason: string) {
    await this.findById(id);
    if (!reason || reason.trim().length === 0) {
      throw new BadRequestException('Rejection reason is required');
    }
    await this.mentorRepository.updateStatus(id, MentorStatus.REJECTED, reason);
    return { message: 'Mentor rejected' };
  }

  async suspend(id: string) {
    await this.findById(id);
    return this.mentorRepository.updateStatus(id, MentorStatus.SUSPENDED);
  }

  async remove(id: string) {
    return this.mentorRepository.remove(id);
  }
}
