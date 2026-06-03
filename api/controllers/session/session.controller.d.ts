import { SessionService } from '../../services/session/session.service';
import { CreateSessionDto, UpdateSessionDto } from '../../dto/session';
export declare class SessionController {
    private sessionService;
    constructor(sessionService: SessionService);
    findAll(query: any, user: any): Promise<import("../../entities/session/session.entity").Session[]>;
    findOne(id: string, user: any): Promise<import("../../entities/session/session.entity").Session>;
    create(createSessionDto: CreateSessionDto, user: any): Promise<import("../../entities/session/session.entity").Session>;
    update(id: string, updateSessionDto: UpdateSessionDto, user: any): Promise<import("../../entities/session/session.entity").Session>;
    remove(id: string, user: any): Promise<void>;
    accept(id: string, user: any): Promise<import("../../entities/session/session.entity").Session>;
    decline(id: string, user: any): Promise<import("../../entities/session/session.entity").Session>;
    complete(id: string, user: any): Promise<import("../../entities/session/session.entity").Session>;
    cancel(id: string, user: any): Promise<import("../../entities/session/session.entity").Session>;
    noShow(id: string, user: any): Promise<import("../../entities/session/session.entity").Session>;
    private verifySessionAccess;
}
