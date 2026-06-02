import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { NotificationService } from '../../services/notification/notification.service';
import { CreateNotificationDto } from '../../dto/notification';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../constants';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // 12.16 Get all notifications for a user
  @Get(':userId')
  async findAll(@Param('userId') userId: string) {
    return this.notificationService.findAll(userId);
  }

  // 12.16 Get unread notifications
  @Get('unread/:userId')
  async findUnread(@Param('userId') userId: string) {
    return this.notificationService.findUnread(userId);
  }

  // 12.16 Get single notification
  @Get('detail/:id')
  async findById(@Param('id') id: string) {
    return this.notificationService.findById(id);
  }

  // 12.17 Create notification — admin only
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateNotificationDto) {
    return this.notificationService.createNotification(dto);
  }

  // 12.18 Mark as read
  @Put(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  // 12.18 Mark all as read
  @Put('read-all/:userId')
  async markAllAsRead(@Param('userId') userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }

  // 12.19 Delete notification
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }
}
