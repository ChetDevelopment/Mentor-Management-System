import { Repository } from 'typeorm';
import { Category } from '../../entities/category/category.entity';
export declare class CategoryRepository {
    private repo;
    constructor(repo: Repository<Category>);
    findAll(): Promise<Category[]>;
    findById(id: string): Promise<Category>;
    findBySlug(slug: string): Promise<Category>;
    findByName(name: string): Promise<Category>;
    create(data: Partial<Category>): Promise<Category>;
    update(id: string, data: Partial<Category>): Promise<Category>;
    delete(id: string): Promise<import("typeorm").DeleteResult>;
}
