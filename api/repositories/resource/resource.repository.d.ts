import { Repository } from 'typeorm';
import { Resource } from '../../entities/resource/resource.entity';
export declare class ResourceRepository {
    private repository;
    constructor(repository: Repository<Resource>);
    create(data: Partial<Resource>): Promise<Resource>;
    findByMentorId(mentorId: string): Promise<Resource[]>;
    findById(id: string): Promise<Resource | null>;
    remove(id: string): Promise<void>;
}
