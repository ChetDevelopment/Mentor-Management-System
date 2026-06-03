import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionRequest } from '../../entities/session-request/session-request.entity';

@Injectable()
export class SessionRequestRepository {
  constructor(
    @InjectRepository(SessionRequest)
    private repository: Repository<SessionRequest>,
  ) {}

  async create(data: Partial<SessionRequest>): Promise<SessionRequest> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findBySessionId(sessionId: string): Promise<SessionRequest | null> {
    return this.repository.findOne({ where: { sessionId } });
  }

  async update(id: string, data: Partial<SessionRequest>): Promise<SessionRequest> {
    await this.repository.update(id, data);
    return this.repository.findOne({ where: { id } });
  }
}
