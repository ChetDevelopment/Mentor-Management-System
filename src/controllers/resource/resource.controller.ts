import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ResourceService } from '../../services/resource/resource.service';
import { CreateResourceDto } from '../../dto/resource';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Public } from '../../decorators/public.decorator';
import { UserRole } from '../../constants';

@Controller('resources')
export class ResourceController {
  constructor(private resourceService: ResourceService) {}

  @Public()
  @Get(':mentorId')
  async getResources(@Param('mentorId') mentorId: string) {
    return this.resourceService.getResources(mentorId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR)
  @Post()
  async uploadResource(@Body() createResourceDto: CreateResourceDto) {
    return this.resourceService.uploadResource(createResourceDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MENTOR)
  @Delete(':id')
  async deleteResource(@Param('id') id: string) {
    return this.resourceService.deleteResource(id);
  }
}
