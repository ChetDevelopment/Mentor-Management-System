import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { MentorService } from '../../services/mentor/mentor.service';
import { CreateMentorDto, UpdateMentorDto } from '../../dto/mentor';
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../constants';

@Controller('mentors')
@UseGuards(AuthGuard)
export class MentorController {
  constructor(private mentorService: MentorService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.mentorService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.mentorService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() createMentorDto: CreateMentorDto) {
    return this.mentorService.create(createMentorDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMentorDto: UpdateMentorDto) {
    return this.mentorService.update(id, updateMentorDto);
  }

  @Post(':id/reject')
  @Roles(UserRole.ADMIN)
  async reject(@Param('id') id: string, @Body('reason') reason: string) {
    return this.mentorService.reject(id, reason);
  }

  @Post(':id/suspend')
  @Roles(UserRole.ADMIN)
  async suspend(@Param('id') id: string) {
    return this.mentorService.suspend(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.mentorService.remove(id);
  }
}
