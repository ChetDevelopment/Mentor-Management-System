import {
    Controller, Get, Post, Put, Delete, Param, Body, UseGuards,
    ForbiddenException,
} from '@nestjs/common';
import { NotificationService } from '../../services/notification/notification.service';
import { CreateNotificationDto } from '../../dto/notification';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../constants';
import { User } from '../../decorators/user.decorator';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Get()
    async findAll(@User() user: any) {
        return this.notificationService.findAll(user.userId);
    }

    @Get('unread')
    async findUnread(@User() user: any) {
        return this.notificationService.findUnread(user.userId);
    }

    @Get('detail/:id')
    async findById(@Param('id') id: string, @User() user: any) {
        const notification = await this.notificationService.findById(id);
        if (notification.userId !== user.userId && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Access denied');
        }
        return notification;
    }

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async create(@Body() dto: CreateNotificationDto) {
        return this.notificationService.createNotification(dto);
    }

    @Put(':id/read')
    async markAsRead(@Param('id') id: string, @User() user: any) {
        const notification = await this.notificationService.findById(id);
        if (notification.userId !== user.userId && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Access denied');
        }
        return this.notificationService.markAsRead(id);
    }

    @Put('read-all')
    async markAllAsRead(@User() user: any) {
        return this.notificationService.markAllAsRead(user.userId);
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @User() user: any) {
        const notification = await this.notificationService.findById(id);
        if (notification.userId !== user.userId && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Access denied');
        }
        return this.notificationService.remove(id);
    }
}
