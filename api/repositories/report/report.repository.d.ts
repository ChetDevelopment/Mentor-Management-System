import { Repository } from 'typeorm';
import { Report } from '../../entities/report/report.entity';
export declare class ReportRepository {
    private repository;
    constructor(repository: Repository<Report>);
    findAll(query?: any): Promise<Report[]>;
    findById(id: string): Promise<Report | null>;
    create(data: Partial<Report>): Promise<Report>;
    update(id: string, data: Partial<Report>): Promise<Report>;
    remove(id: string): Promise<void>;
}
