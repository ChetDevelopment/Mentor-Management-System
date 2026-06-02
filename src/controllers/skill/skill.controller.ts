import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { SkillService } from '../../services/skill/skill.service';
import { CreateSkillDto, UpdateSkillDto } from '../../dto/skill';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Public } from '../../decorators/public.decorator';
import { UserRole } from '../../constants';


@Controller('skills')
export class SkillController {
  constructor(private skillService: SkillService) { }

  @Public()
  @Get()
  async findAll(@Query() query: any) {
    return this.skillService.findAll(query);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.skillService.findById(id);
  }

  @Public()
  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string) {
    return this.skillService.findByCategory(categoryId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillService.create(createSkillDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillService.update(id, updateSkillDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.skillService.remove(id);
  }

}