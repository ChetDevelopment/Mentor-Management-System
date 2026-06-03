import {
    Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards,
    ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Public } from '../../decorators/public.decorator';
import { User } from '../../decorators/user.decorator';
import { UserRole } from '../../constants';
import { AvailabilityService } from '../../services/availability/availability.service';
import { CreateAvailabilityDto, UpdateAvailabilityDto, BlockDateDto } from '../../dto/availability/availability.entity';

@Controller('availabilities')
export class AvailabilityController {
    constructor(private readonly availabilityService: AvailabilityService) {}

    @Public()
    @Get(':mentorId')
    async findByMentorId(@Param('mentorId') mentorId: string) {
        return this.availabilityService.getAvailability(mentorId);
    }

    @Public()
    @Get(':mentorId/slots')
    async findSlotsByDate(
        @Param('mentorId') mentorId: string,
        @Query('date') date: string,
    ) {
        return this.availabilityService.getAvailableSlots(mentorId, date);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MENTOR)
    @Post()
    async create(@Body() dto: CreateAvailabilityDto, @User() user: any) {
        if (dto.mentorId !== user.userId) {
            throw new ForbiddenException('You can only set availability for yourself');
        }
        return this.availabilityService.setSchedule(dto, user);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MENTOR)
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateAvailabilityDto,
        @User() user: any,
    ) {
        const availability = await this.availabilityService.findById(id);
        if (availability.mentorId !== user.userId && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('You can only update your own availability');
        }
        return this.availabilityService.updateSchedule(id, dto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MENTOR)
    @Delete(':id')
    async remove(@Param('id') id: string, @User() user: any) {
        const availability = await this.availabilityService.findById(id);
        if (availability.mentorId !== user.userId && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('You can only delete your own availability');
        }
        return this.availabilityService.removeSchedule(id);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MENTOR)
    @Post('block')
    async blockDate(@Body() dto: BlockDateDto, @User() user: any) {
        if (dto.mentorId !== user.userId) {
            throw new ForbiddenException('You can only block dates for yourself');
        }
        return this.availabilityService.blockDate(dto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MENTOR)
    @Delete('block/:id')
    async unblockDate(@Param('id') id: string, @User() user: any) {
        return this.availabilityService.unblockDate(id);
    }
}
