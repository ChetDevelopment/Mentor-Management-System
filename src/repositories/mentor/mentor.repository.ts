import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mentor } from '../../entities/mentor/mentor.entity';
import { MentorStatus } from '../../constants';

@Injectable()
export class MentorRepository {
  constructor(
    @InjectRepository(Mentor)
    private repository: Repository<Mentor>,
  ) {}

  async create(data: Partial<Mentor>): Promise<Mentor> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findAll(query?: any): Promise<Mentor[]> {
    return this.repository.find({
      where: query,
      relations: ['user'],
    });
  }

  async findAllWithSkills(query?: any): Promise<Mentor[]> {
    return this.repository.find({
      where: query,
      relations: ['user', 'skills'],
    });
  }

  async findById(id: string): Promise<Mentor | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string): Promise<Mentor | null> {
    return this.repository.findOne({
      where: { userId },
      relations: ['user'],
    });
  }

  async update(id: string, data: Partial<Mentor>): Promise<Mentor> {
    const mentor = await this.findById(id);
    const entity = this.repository.merge(mentor, data);
    return this.repository.save(entity);
  }

  async findPending(): Promise<Mentor[]> {
    return this.repository.find({
      where: { status: MentorStatus.PENDING },
      relations: ['user'],
    });
  }

  async updateStatus(id: string, status: MentorStatus, reason?: string): Promise<Mentor> {
    const data: any = { status };
    if (reason) data.rejectionReason = reason;
    if (status === MentorStatus.APPROVED) data.approvedAt = new Date();
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
