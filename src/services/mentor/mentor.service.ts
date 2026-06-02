import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MentorRepository } from '../../repositories/mentor/mentor.repository';
import { CreateMentorDto, UpdateMentorDto } from '../../dto/mentor';
import { MentorStatus } from '../../constants';
import { Skill } from '../../entities/skill/skill.entity';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';

@Injectable()
export class MentorService {
  constructor(
    private mentorRepository: MentorRepository,
    private notificationService: NotificationService,
    private userService: UserService,
  ) {}

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
    const mentor = await this.findById(id);
    await this.mentorRepository.updateStatus(id, MentorStatus.APPROVED);
    await this.notificationService.createNotification({
      userId: mentor.userId,
      title: 'Mentor Approved',
      message: 'Your mentor application has been approved!',
      type: 'in_app' as any,
    });
    return mentor;
  }

  async reject(id: string, reason: string) {
    const mentor = await this.findById(id);
    if (!reason || reason.trim().length === 0) {
      throw new BadRequestException('Rejection reason is required');
    }
    await this.mentorRepository.updateStatus(id, MentorStatus.REJECTED, reason);
    await this.notificationService.createNotification({
      userId: mentor.userId,
      title: 'Mentor Rejected',
      message: `Your mentor application has been rejected. Reason: ${reason}`,
      type: 'in_app' as any,
    });
    return { message: 'Mentor rejected' };
  }

  async suspend(id: string) {
    await this.findById(id);
    return this.mentorRepository.updateStatus(id, MentorStatus.SUSPENDED);
  }

  async remove(id: string) {
    return this.mentorRepository.remove(id);
  }

  async delete(id: string) {
    return this.remove(id);
  }

  private toSkillRefs(skillIds?: string[]): Skill[] | undefined {
    return skillIds?.map((id) => ({ id }) as Skill);
  }
}
