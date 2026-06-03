import { Repository } from 'typeorm';
import { Skill } from '../../entities/skill/skill.entity';
export declare class SkillRepository {
    private repository;
    constructor(repository: Repository<Skill>);
    create(data: Partial<Skill>): Promise<Skill>;
    findAll(query?: any): Promise<Skill[]>;
    findById(id: string): Promise<Skill | null>;
    findByName(name: string): Promise<Skill | null>;
    findByCategory(categoryId: string): Promise<Skill[]>;
    update(id: string, data: Partial<Skill>): Promise<Skill>;
    remove(id: string): Promise<void>;
}
