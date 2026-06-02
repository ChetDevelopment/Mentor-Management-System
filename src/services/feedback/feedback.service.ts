import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { FeedbackRepository } from '../../repositories/feedback/feedback.repository';
import { SessionRepository } from '../../repositories/session/session.repository';
import { CreateFeedbackDto } from '../../dto/feedback';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepo: FeedbackRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  // 10.24 Submit feedback — check session completed first
  async submitFeedback(dto: CreateFeedbackDto) {
    const session = await this.sessionRepo.findById(dto.sessionId);
    if (!session) throw new NotFoundException('Session not found');
    if (session.status !== 'completed') {
      throw new BadRequestException('Feedback can only be submitted for completed sessions');
    }

    // 10.25 Duplicate feedback check
    const existing = await this.feedbackRepo.findBySessionId(dto.sessionId);
    if (existing.some(f => f.menteeId === dto.menteeId)) {
      throw new BadRequestException('Feedback already submitted for this session');
    }

    const feedback = await this.feedbackRepo.create(dto);

    // 10.26 Update mentor rating
    await this.updateMentorRating(dto.mentorId);

    return feedback;
  }

  async updateMentorRating(mentorId: string) {
    const feedbacks = await this.feedbackRepo.findByMentorId(mentorId);
    if (feedbacks.length === 0) return;

    const avg = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;

    // Update mentor entity (assuming MentorRepository exists)
    // Example:
    // await this.mentorRepo.update(mentorId, { averageRating: avg });
  }

  async getFeedbackByMentor(mentorId: string) {
    return this.feedbackRepo.findByMentorId(mentorId);
  }

  async deleteFeedback(id: string) {
    const feedback = await this.feedbackRepo.findById(id);
    if (!feedback) throw new NotFoundException('Feedback not found');
    return this.feedbackRepo.delete(id);
  }
}
