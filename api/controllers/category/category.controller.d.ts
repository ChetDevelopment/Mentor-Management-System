import { CategoryService } from '../../services/category/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../../dto/category';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    findAll(): Promise<import("../../entities/category/category.entity").Category[]>;
    findById(id: string): Promise<import("../../entities/category/category.entity").Category>;
    create(dto: CreateCategoryDto): Promise<import("../../entities/category/category.entity").Category>;
    update(id: string, dto: UpdateCategoryDto): Promise<import("../../entities/category/category.entity").Category>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
