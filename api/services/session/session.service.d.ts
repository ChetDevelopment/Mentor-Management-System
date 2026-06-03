import { SessionRepository } from '../../repositories/session/session.repository';
import { CreateSessionDto, UpdateSessionDto } from '../../dto/session';
import { Session } from '../../entities/session/session.entity';
import { NotificationService } from '../notification/notification.service';
import { SessionRequestRepository } from '../../repositories/session-request/session-request.repository';
import { AuditLogger } from '../../security/audit.logger';
export declare class SessionService {
    private sessionRepository;
    private notificationService;
    private sessionRequestRepository;
    private auditLogger;
    constructor(sessionRepository: SessionRepository, notificationService: NotificationService, sessionRequestRepository: SessionRequestRepository, auditLogger: AuditLogger);
    create(createSessionDto: CreateSessionDto, user: any): Promise<Session>;
    findAll(query?: any, user?: any): Promise<Session[]>;
    findById(id: string): Promise<Session>;
    findByMentorId(mentorId: string): Promise<Session[]>;
    findByMenteeId(menteeId: string): Promise<Session[]>;
    update(id: string, updateSessionDto: UpdateSessionDto, user: any): Promise<Session>;
    remove(id: string, user: any): Promise<void>;
    accept(id: string, user?: any): Promise<Session>;
    decline(id: string, user?: any): Promise<Session>;
    complete(id: string, user?: any): Promise<Session>;
    cancel(id: string, user?: any): Promise<Session>;
    noShow(id: string, user?: any): Promise<Session>;
    private verifyOwnership;
    private updateStatus;
}
