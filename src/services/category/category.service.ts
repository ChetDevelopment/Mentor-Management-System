import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../../repositories/category/category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from '../../dto/category/insex';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async findAll() {
    return this.categoryRepo.findAll();
  }

  async findById(id: string) {
    const category = await this.categoryRepo.findById(id);
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.categoryRepo.findBySlug(slug);
    if (!category) throw new NotFoundException(`Category ${slug} not found`);
    return category;
  }

  async create(dto: CreateCategoryDto) {
    return this.categoryRepo.create(dto);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findById(id);
    return this.categoryRepo.update(id, dto);
  }

  async delete(id: string) {
    await this.findById(id);
    return this.categoryRepo.delete(id);
  }
}
