import { Skill } from '../skill/skill.entity';
export declare class Category {
    id: string;
    name: string;
    description: string;
    slug: string;
    isActive: boolean;
    skills: Skill[];
    createdAt: Date;
    updatedAt: Date;
    generateSlug(): void;
}
