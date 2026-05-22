import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { SkillService } from '../../services/skill/skill.service';
import { CreateSkillDto, UpdateSkillDto } from '../../dto/skill';
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../constants';

@Controller('skills')
@UseGuards(AuthGuard)
export class SkillController {
  constructor(private skillService: SkillService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.skillService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.skillService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillService.create(createSkillDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.skillService.remove(id);
  }
}
