import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { NotificationService } from '../../services/notification/notification.service';
import { CreateNotificationDto, UpdateNotificationDto } from '../../dto/notification';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../../decorators/user.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../constants';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async findAll(@Query() query: any, @User() user: any) {
    return this.notificationService.findAll(query, user);
  }

  @Get('unread')
  async findUnread(@User() user: any) {
    return this.notificationService.findUnread(user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.notificationService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }
}
