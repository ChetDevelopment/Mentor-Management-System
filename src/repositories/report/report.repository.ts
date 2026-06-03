import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../../entities/report/report.entity';

@Injectable()
export class ReportRepository {
  constructor(
    @InjectRepository(Report)
    private repository: Repository<Report>,
  ) {}

  async findAll(query?: any): Promise<Report[]> {
    return this.repository.find({ where: query, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Report | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<Report>): Promise<Report> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<Report>): Promise<Report> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
