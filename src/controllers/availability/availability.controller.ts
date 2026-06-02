import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Public } from '../../decorators/public.decorator';
import { UserRole } from '../../constants';

@Controller('availabilities')
export class AvailabilityController {
    constructor() { }

    @Public()
    @Get(':mentorId')
    async findByMentorId(@Param('mentorId') mentorId: string) {
        return;
    }

    @Public()
    @Get(':mentorId/slots')
    async findSlotsByDate(@Param('mentorId') mentorId: string, @Query('date') date: string) {
        return;
    }

    @UseGuards(AuthGuard)
    @Roles(UserRole.MENTOR)
    @Post()
    async create(@Body() body: any){
        return;
    }

    @UseGuards(AuthGuard)
    @Roles(UserRole.MENTOR)
    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any){
        return;
    }

    @UseGuards(AuthGuard)
    @Roles(UserRole.MENTOR)
    @Delete(':id')
    async remove(@Param('id') id: string){
        return;
    }

    @UseGuards(AuthGuard)
    @Roles(UserRole.MENTOR)
    @Post('block')
    async blockDate(@Body() body: any){
        return;
    }

    @UseGuards(AuthGuard)
    @Roles(UserRole.MENTOR)
    @Delete('block/:id')
    async unblockDate(@Param('id') id: string){
        return;
    }
}