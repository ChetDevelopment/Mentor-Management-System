import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  findAll() {
    return this.repo.find();
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findBySlug(slug: string) {
    return this.repo.findOne({ where: { slug } });
  }

  findByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }

  async create(data: Partial<Category>) {
    const category = this.repo.create(data);
    return this.repo.save(category);
  }

  async update(id: string, data: Partial<Category>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}
