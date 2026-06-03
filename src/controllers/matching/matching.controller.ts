import {
    Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query,
    ForbiddenException,
} from '@nestjs/common';
import { MatchingService } from '../../services/matching/matching.service';
import { CreateMatchingDto, UpdateMatchingDto } from '../../dto/matching';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { User } from '../../decorators/user.decorator';
import { UserRole } from '../../constants';

@Controller('matchings')
@UseGuards(AuthGuard)
export class MatchingController {
    constructor(private matchingService: MatchingService) {}

    @UseGuards(RolesGuard)
    @Get('recommended')
    @Roles(UserRole.MENTEE)
    async getRecommended(@Query('skill') skill?: string, @User() user?: any) {
        return this.matchingService.getRecommendedMentors(user.userId, skill);
    }

    @Get()
    async findAll(@Query() query: any) {
        return this.matchingService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @User() user: any) {
        const matching = await this.matchingService.findById(id);
        if (matching.menteeId !== user.userId &&
            matching.mentorId !== user.userId &&
            user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Access denied');
        }
        return matching;
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    async create(@Body() createMatchingDto: CreateMatchingDto) {
        return this.matchingService.create(createMatchingDto);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateMatchingDto: UpdateMatchingDto,
        @User() user: any,
    ) {
        const matching = await this.matchingService.findById(id);
        if (matching.menteeId !== user.userId &&
            matching.mentorId !== user.userId &&
            user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Access denied');
        }
        return this.matchingService.update(id, updateMatchingDto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    async remove(@Param('id') id: string) {
        return this.matchingService.remove(id);
    }
}
