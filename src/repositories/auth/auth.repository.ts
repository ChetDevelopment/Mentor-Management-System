import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthToken } from '../../entities/auth/auth-token.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(AuthToken)
    private repository: Repository<AuthToken>,
  ) {}

  async create(data: Partial<AuthToken>): Promise<AuthToken> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findByUserId(userId: string): Promise<AuthToken | null> {
    return this.repository.findOne({ where: { userId, isActive: true } });
  }

  async findByToken(token: string): Promise<AuthToken | null> {
    return this.repository.findOne({ where: { token } });
  }

  async deactivateByUserId(userId: string): Promise<void> {
    await this.repository.update({ userId, isActive: true }, { isActive: false });
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
