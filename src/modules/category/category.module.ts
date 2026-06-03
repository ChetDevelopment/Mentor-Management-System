import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from '../../controllers/category/category.controller';
import { CategoryService } from '../../services/category/category.service';
import { CategoryRepository } from '../../repositories/category/category.repository';
import { Category } from '../../entities/category/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
