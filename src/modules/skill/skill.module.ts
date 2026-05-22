import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillController } from '../controllers/skill/skill.controller';
import { SkillService } from '../../services/skill/skill.service';
import { SkillRepository } from '../../repositories/skill/skill.repository';
import { Skill } from '../../entities/skill/skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Skill])],
  controllers: [SkillController],
  providers: [SkillService, SkillRepository],
  exports: [SkillService],
})
export class SkillModule {}
