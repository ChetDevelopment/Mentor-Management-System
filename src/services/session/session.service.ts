import {
    Injectable, NotFoundException, BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { SessionRepository } from '../../repositories/session/session.repository';
import { CreateSessionDto, UpdateSessionDto } from '../../dto/session';
import { Session } from '../../entities/session/session.entity';
import { SessionStatus, UserRole } from '../../constants';
import { NotificationService } from '../notification/notification.service';
import { SessionRequestRepository } from '../../repositories/session-request/session-request.repository';
import { AuditLogger, SecurityEvent } from '../../security/audit.logger';

@Injectable()
export class SessionService {
    constructor(
        private sessionRepository: SessionRepository,
        private notificationService: NotificationService,
        private sessionRequestRepository: SessionRequestRepository,
        private auditLogger: AuditLogger,
    ) {}

    async create(createSessionDto: CreateSessionDto, user: any) {
        const scheduledDate = new Date(createSessionDto.scheduledAt);
        if (scheduledDate < new Date()) {
            throw new BadRequestException('Cannot book a session in the past');
        }

        // Ensure user can only create sessions for themselves
        if (user.role !== UserRole.ADMIN && createSessionDto.menteeId !== user.userId) {
            throw new ForbiddenException('You can only create sessions for yourself');
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
        await this.sessionRequestRepository.create({
            sessionId: session.id,
            message: createSessionDto.description,
        });
        return session;
    }

    async findAll(query?: any, user?: any) {
        if (user.role === UserRole.ADMIN) {
            return this.sessionRepository.findAll(query);
        }
        if (user.role === UserRole.MENTOR) {
            return this.sessionRepository.findByMentorId(user.userId);
        }
        return this.sessionRepository.findByMenteeId(user.userId);
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

    async update(id: string, updateSessionDto: UpdateSessionDto, user: any) {
        const session = await this.findById(id);

        // Ownership check
        const isOwner = session.menteeId === user.userId || session.mentorId === user.userId;
        if (!isOwner && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('You do not have permission to update this session');
        }

        const sessionData: Partial<Session> = {
            title: updateSessionDto.title,
            description: updateSessionDto.description,
            meetingLink: updateSessionDto.meetingLink,
            notes: updateSessionDto.notes,
        };

        if (updateSessionDto.scheduledAt) {
            sessionData.scheduledAt = new Date(updateSessionDto.scheduledAt);
        }

        // Only admin can change status via update
        if (updateSessionDto.status && user.role === UserRole.ADMIN) {
            sessionData.status = updateSessionDto.status;
        }

        return this.sessionRepository.update(id, sessionData);
    }

    async remove(id: string, user: any) {
        const session = await this.findById(id);
        const isOwner = session.menteeId === user.userId || session.mentorId === user.userId;
        if (!isOwner && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('You do not have permission to delete this session');
        }
        return this.sessionRepository.remove(id);
    }

    async accept(id: string, user?: any) {
        const session = await this.findById(id);

        // Mentor can only accept sessions assigned to them
        if (user?.role === UserRole.MENTOR && session.mentorId !== user.userId) {
            throw new ForbiddenException('This session is not assigned to you');
        }

        await this.updateStatus(id, SessionStatus.CONFIRMED);
        const request = await this.sessionRequestRepository.findBySessionId(id);
        if (request) {
            await this.sessionRequestRepository.update(request.id, {
                requestStatus: 'approved' as any,
                respondedAt: new Date(),
            });
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

        if (user?.role === UserRole.MENTOR && session.mentorId !== user.userId) {
            throw new ForbiddenException('This session is not assigned to you');
        }

        await this.updateStatus(id, SessionStatus.CANCELLED);
        const request = await this.sessionRequestRepository.findBySessionId(id);
        if (request) {
            await this.sessionRequestRepository.update(request.id, {
                requestStatus: 'declined' as any,
                respondedAt: new Date(),
            });
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
        const session = await this.findById(id);
        this.verifyOwnership(session, user);
        return this.updateStatus(id, SessionStatus.COMPLETED);
    }

    async cancel(id: string, user?: any) {
        const session = await this.findById(id);
        this.verifyOwnership(session, user);
        return this.updateStatus(id, SessionStatus.CANCELLED);
    }

    async noShow(id: string, user?: any) {
        const session = await this.findById(id);
        this.verifyOwnership(session, user);
        return this.updateStatus(id, SessionStatus.NO_SHOW);
    }

    private verifyOwnership(session: any, user: any) {
        if (user.role === UserRole.ADMIN) return;
        if (session.mentorId !== user.userId && session.menteeId !== user.userId) {
            throw new ForbiddenException('You do not have access to this session');
        }
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
            throw new BadRequestException(
                `Cannot transition from ${session.status} to ${status}`,
            );
        }
        const updateData: any = { status };
        if (status === SessionStatus.COMPLETED) {
            updateData.completedAt = new Date();
        }
        this.auditLogger.log(SecurityEvent.PROFILE_UPDATED, session.menteeId, {
            action: 'session_status_change',
            from: session.status,
            to: status,
            sessionId: id,
        });
        return this.sessionRepository.update(id, updateData);
    }
}
