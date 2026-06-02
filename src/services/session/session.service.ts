import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SessionRepository } from '../../repositories/session/session.repository';
import { CreateSessionDto, UpdateSessionDto } from '../../dto/session';
import { Session } from '../../entities/session/session.entity';
import { SessionStatus } from '../../constants';
import { NotificationService } from '../notification/notification.service';
import { SessionRequestRepository } from '../../repositories/session-request/session-request.repository';

@Injectable()
export class SessionService {
  constructor(
    private sessionRepository: SessionRepository,
    private notificationService: NotificationService,
    private sessionRequestRepository: SessionRequestRepository,
  ) {}

  async create(createSessionDto: CreateSessionDto, user: any) {
    const scheduledDate = new Date(createSessionDto.scheduledAt);
    if (scheduledDate < new Date()) {
      throw new BadRequestException('Cannot book a session in the past');
    }
    const sessionData: Partial<Session> = {
      mentorId: createSessionDto.mentorId,
      menteeId: createSessionDto.menteeId,
      title: createSessionDto.title,
      description: createSessionDto.description,
      scheduledAt: scheduledDate,
      duration: createSessionDto.duration ? Number(createSessionDto.duration) : undefined,
      meetingLink: createSessionDto.meetingLink,
      status: SessionStatus.PENDING,
    };

    const session = await this.sessionRepository.create(sessionData);
    await this.sessionRequestRepository.create({ sessionId: session.id, message: createSessionDto.description });
    return session;
  }

  async findAll(query?: any, user?: any) {
    return this.sessionRepository.findAll(query);
  }

  async findById(id: string) {
    const session = await this.sessionRepository.findById(id);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  async findByMentorId(mentorId: string) {
    return this.sessionRepository.findByMentorId(mentorId);
  }

  async findByMenteeId(menteeId: string) {
    return this.sessionRepository.findByMenteeId(menteeId);
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    const sessionData: Partial<Session> = {
      title: updateSessionDto.title,
      description: updateSessionDto.description,
      meetingLink: updateSessionDto.meetingLink,
      notes: updateSessionDto.notes,
    };

    if (updateSessionDto.scheduledAt) {
      sessionData.scheduledAt = new Date(updateSessionDto.scheduledAt);
    }

    if (updateSessionDto.status) {
      sessionData.status = updateSessionDto.status;
    }

    return this.sessionRepository.update(id, sessionData);
  }

  async remove(id: string) {
    return this.sessionRepository.remove(id);
  }

  async accept(id: string, user?: any) {
    const session = await this.findById(id);
    await this.updateStatus(id, SessionStatus.CONFIRMED);
    const request = await this.sessionRequestRepository.findBySessionId(id);
    if (request) {
      await this.sessionRequestRepository.update(request.id, { requestStatus: 'approved' as any, respondedAt: new Date() });
    }
    await this.notificationService.createNotification({
      userId: session.menteeId,
      title: 'Session Accepted',
      message: `Your session "${session.title}" has been accepted.`,
      type: 'in_app' as any,
    });
    return session;
  }

  async decline(id: string, user?: any) {
    const session = await this.findById(id);
    await this.updateStatus(id, SessionStatus.CANCELLED);
    const request = await this.sessionRequestRepository.findBySessionId(id);
    if (request) {
      await this.sessionRequestRepository.update(request.id, { requestStatus: 'declined' as any, respondedAt: new Date() });
    }
    await this.notificationService.createNotification({
      userId: session.menteeId,
      title: 'Session Declined',
      message: `Your session "${session.title}" has been declined.`,
      type: 'in_app' as any,
    });
    return session;
  }

  async complete(id: string, user?: any) {
    return this.updateStatus(id, SessionStatus.COMPLETED);
  }

  async cancel(id: string, user?: any) {
    return this.updateStatus(id, SessionStatus.CANCELLED);
  }

  async noShow(id: string, user?: any) {
    return this.updateStatus(id, SessionStatus.NO_SHOW);
  }

  private async updateStatus(id: string, status: SessionStatus) {
    const session = await this.findById(id);
    const validTransitions: Record<string, string[]> = {
      [SessionStatus.PENDING]: [SessionStatus.CONFIRMED, SessionStatus.CANCELLED],
      [SessionStatus.CONFIRMED]: [SessionStatus.COMPLETED, SessionStatus.CANCELLED, SessionStatus.NO_SHOW],
      [SessionStatus.COMPLETED]: [],
      [SessionStatus.CANCELLED]: [],
      [SessionStatus.NO_SHOW]: [],
    };
    const allowed = validTransitions[session.status] || [];
    if (!allowed.includes(status)) {
      throw new BadRequestException(`Cannot transition from ${session.status} to ${status}`);
    }
    const updateData: any = { status };
    if (status === SessionStatus.COMPLETED) {
      updateData.completedAt = new Date();
    }
    return this.sessionRepository.update(id, updateData);
  }
}
