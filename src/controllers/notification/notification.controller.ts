import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { NotificationService } from '../../services/notification/notification.service';
import { CreateNotificationDto } from '../../dto/notification';
import { AuthGuard } from '../../guards/auth.guard';
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
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateNotificationDto) {
    return this.notificationService.createNotification(dto);
  }

  // 12.18 Mark as read
  @Put(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Put('read-all')
  async markAllAsRead(@User() user: any) {
    return this.notificationService.markAllAsRead(user.userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.notificationService.delete(id);
  }
}
