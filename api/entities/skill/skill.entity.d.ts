import { Category } from '../category/category.entity';
import { Mentor } from '../mentor/mentor.entity';
export declare class Skill {
    id: string;
    name: string;
    description: string;
    category: Category;
    categoryId: string;
    isActive: boolean;
    mentors: Mentor[];
    createdAt: Date;
    updatedAt: Date;
}
