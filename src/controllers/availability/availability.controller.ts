import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Public } from '../../decorators/public.decorator';
import { UserRole } from '../../constants';
import { AvailabilityService } from '../../services/availability/availability.service';
import { CreateAvailabilityDto, UpdateAvailabilityDto, BlockDateDto } from '../../dto/availability/availability.entity';

@Controller('availabilities')
export class AvailabilityController {
    constructor(private readonly availabilityService: AvailabilityService) { }

    @Public()
    @Get(':mentorId')
    async findByMentorId(@Param('mentorId') mentorId: string) {
        return this.availabilityService.getAvailability(mentorId);
    }

    @Public()
    @Get(':mentorId/slots')
    async findSlotsByDate(@Param('mentorId') mentorId: string, @Query('date') date: string) {
        return this.availabilityService.getAvailableSlots(mentorId, date);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MENTOR)
    @Post()
    async create(@Body() dto: CreateAvailabilityDto){
        return this.availabilityService.setSchedule(dto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MENTOR)
    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateAvailabilityDto){
        return this.availabilityService.updateSchedule(id, dto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MENTOR)
    @Delete(':id')
    async remove(@Param('id') id: string){
        return this.availabilityService.removeSchedule(id);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MENTOR)
    @Post('block')
    async blockDate(@Body() dto: BlockDateDto){
        return this.availabilityService.blockDate(dto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MENTOR)
    @Delete('block/:id')
    async unblockDate(@Param('id') id: string){
        return this.availabilityService.unblockDate(id);
    }
}