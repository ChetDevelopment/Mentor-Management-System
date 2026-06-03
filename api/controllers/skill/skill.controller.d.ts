import { SkillService } from '../../services/skill/skill.service';
import { CreateSkillDto, UpdateSkillDto } from '../../dto/skill';
export declare class SkillController {
    private skillService;
    constructor(skillService: SkillService);
    findAll(query: any): Promise<import("../../entities/skill/skill.entity").Skill[]>;
    findOne(id: string): Promise<import("../../entities/skill/skill.entity").Skill>;
    findByCategory(categoryId: string): Promise<import("../../entities/skill/skill.entity").Skill[]>;
    create(createSkillDto: CreateSkillDto): Promise<import("../../entities/skill/skill.entity").Skill>;
    update(id: string, updateSkillDto: UpdateSkillDto): Promise<import("../../entities/skill/skill.entity").Skill>;
    remove(id: string): Promise<void>;
}
