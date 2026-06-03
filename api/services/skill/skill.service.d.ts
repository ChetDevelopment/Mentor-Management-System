import { SkillRepository } from '../../repositories/skill/skill.repository';
import { CreateSkillDto, UpdateSkillDto } from '../../dto/skill';
export declare class SkillService {
    private skillRepository;
    constructor(skillRepository: SkillRepository);
    create(createSkillDto: CreateSkillDto): Promise<import("../../entities/skill/skill.entity").Skill>;
    findAll(query?: any): Promise<import("../../entities/skill/skill.entity").Skill[]>;
    findById(id: string): Promise<import("../../entities/skill/skill.entity").Skill>;
    findByName(name: string): Promise<import("../../entities/skill/skill.entity").Skill>;
    findByCategory(categoryId: string): Promise<import("../../entities/skill/skill.entity").Skill[]>;
    update(id: string, updateSkillDto: UpdateSkillDto): Promise<import("../../entities/skill/skill.entity").Skill>;
    remove(id: string): Promise<void>;
}
