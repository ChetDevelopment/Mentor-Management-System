import { CategoryRepository } from '../../repositories/category/category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from '../../dto/category';
export declare class CategoryService {
    private readonly categoryRepo;
    constructor(categoryRepo: CategoryRepository);
    findAll(): Promise<import("../../entities/category/category.entity").Category[]>;
    findById(id: string): Promise<import("../../entities/category/category.entity").Category>;
    findBySlug(slug: string): Promise<import("../../entities/category/category.entity").Category>;
    create(dto: CreateCategoryDto): Promise<import("../../entities/category/category.entity").Category>;
    update(id: string, dto: UpdateCategoryDto): Promise<import("../../entities/category/category.entity").Category>;
    delete(id: string): Promise<import("typeorm").DeleteResult>;
}
