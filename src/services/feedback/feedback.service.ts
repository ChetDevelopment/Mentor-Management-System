import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FeedbackRepository } from '../../repositories/feedback/feedback.repository';
import { SessionRepository } from '../../repositories/session/session.repository';
import { MentorRepository } from '../../repositories/mentor/mentor.repository';
import { CreateFeedbackDto, UpdateFeedbackDto } from '../../dto/feedback';
import { SessionStatus } from '../../constants';

@Injectable()
export class FeedbackService {
  constructor(
    private feedbackRepository: FeedbackRepository,
    private sessionRepository: SessionRepository,
    private mentorRepository: MentorRepository,
  ) {}

  async submitFeedback(createFeedbackDto: CreateFeedbackDto, user: any) {
    const { sessionId, mentorId } = createFeedbackDto;

    if (sessionId) {
      const session = await this.sessionRepository.findById(sessionId);
      if (!session) {
        throw new NotFoundException('Session not found');
      }
      if (session.status !== SessionStatus.COMPLETED) {
        throw new BadRequestException('Session must be completed before submitting feedback');
      }

      const existing = await this.feedbackRepository.findBySessionId(sessionId);
      if (existing) {
        throw new BadRequestException('Feedback already submitted for this session');
      }
    }

    const feedback = await this.feedbackRepository.create(createFeedbackDto);

    await this.updateMentorRating(mentorId);

    return feedback;
  }

  async updateMentorRating(mentorId: string) {
    const feedbacks = await this.feedbackRepository.findByMentorId(mentorId);
    const total = feedbacks.reduce((sum, f) => sum + f.rating, 0);
    const average = feedbacks.length > 0 ? Math.round((total / feedbacks.length) * 100) / 100 : 0;
    await this.mentorRepository.update(mentorId, { rating: average });
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
