import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ActivityLogService } from '../../services/activity-log/activity-log.service';
import { CreateActivityLogDto } from '../../dto/activity-log';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../constants';

@Controller('activity-logs')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ActivityLogController {
  constructor(private activityLogService: ActivityLogService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.activityLogService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.activityLogService.findById(id);
  }

  @Post()
  async create(@Body() createActivityLogDto: CreateActivityLogDto) {
    return this.activityLogService.create(createActivityLogDto);
  }
}
