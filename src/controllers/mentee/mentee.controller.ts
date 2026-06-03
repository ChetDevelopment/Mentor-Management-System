import {
    Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query,
    ForbiddenException,
} from '@nestjs/common';
import { MenteeService } from '../../services/mentee/mentee.service';
import { CreateMenteeDto, UpdateMenteeDto } from '../../dto/mentee';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { User } from '../../decorators/user.decorator';
import { UserRole } from '../../constants';

@Controller('mentees')
@UseGuards(AuthGuard)
export class MenteeController {
    constructor(private menteeService: MenteeService) {}

    @Get()
    async findAll(@Query() query: any) {
        return this.menteeService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.menteeService.findById(id);
    }

    @Post()
    async create(@Body() createMenteeDto: CreateMenteeDto, @User() user: any) {
        if (createMenteeDto.userId !== user.userId && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('You can only create a mentee profile for yourself');
        }
        return this.menteeService.create(createMenteeDto);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateMenteeDto: UpdateMenteeDto,
        @User() user: any,
    ) {
        const mentee = await this.menteeService.findById(id);
        if (mentee.userId !== user.userId && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('You can only update your own mentee profile');
        }
        return this.menteeService.update(id, updateMenteeDto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    async remove(@Param('id') id: string) {
        return this.menteeService.remove(id);
    }
}
