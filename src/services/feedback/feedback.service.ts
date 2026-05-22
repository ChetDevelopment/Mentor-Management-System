import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedbackRepository } from '../../repositories/feedback/feedback.repository';
import { CreateFeedbackDto, UpdateFeedbackDto } from '../../dto/feedback';

@Injectable()
export class FeedbackService {
  constructor(private feedbackRepository: FeedbackRepository) {}

  async create(createFeedbackDto: CreateFeedbackDto, user: any) {
    return this.feedbackRepository.create(createFeedbackDto);
  }

  async findAll(query?: any) {
    return this.feedbackRepository.findAll(query);
  }

  async findById(id: string) {
    const feedback = await this.feedbackRepository.findById(id);
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }
    return feedback;
  }

  async findByMentorId(mentorId: string) {
    return this.feedbackRepository.findByMentorId(mentorId);
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackRepository.update(id, updateFeedbackDto);
  }

  async remove(id: string) {
    return this.feedbackRepository.remove(id);
  }
}
