import {
    Controller, Get, Post, Put, Delete, Param, Body, UseGuards,
    UploadedFile, UseInterceptors, Query, ForbiddenException,
} from '@nestjs/common';
import { MentorService } from '../../services/mentor/mentor.service';
import { CreateMentorDto, UpdateMentorDto } from '../../dto/mentor';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthGuard } from '../../guards/auth.guard';
import { Public } from '../../decorators/public.decorator';
import { User } from '../../decorators/user.decorator';
import { UserRole } from '../../constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarUploadConfig, cvUploadConfig } from '../../common/upload.config';

@Controller('mentors')
export class MentorController {
    constructor(private readonly mentorService: MentorService) {}

    @Public()
    @Get()
    async findAll(@Query() query: any) {
        return this.mentorService.findAll(query);
    }

    @Public()
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.mentorService.findById(id);
    }

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async create(@Body() createMentorDto: CreateMentorDto) {
        return this.mentorService.create(createMentorDto);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async updateMentor(
        @Param('id') id: string,
        @Body() updateMentorDto: UpdateMentorDto,
        @User() user: any,
    ) {
        // Only the mentor themselves or admin can update
        const mentor = await this.mentorService.findById(id);
        if (mentor.userId !== user.userId && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('You can only update your own mentor profile');
        }
        return this.mentorService.update(id, updateMentorDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async deleteMentor(@Param('id') id: string) {
        return this.mentorService.remove(id);
    }

    @Post(':id/approve')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async approveMentor(@Param('id') id: string) {
        return this.mentorService.approve(id);
    }

    @Post(':id/reject')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async rejectMentor(
        @Param('id') id: string,
        @Body('reason') reason: string,
    ) {
        return this.mentorService.reject(id, reason);
    }

    @Post(':id/suspend')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async suspendMentor(@Param('id') id: string) {
        return this.mentorService.suspend(id);
    }

    @Post('upload/avatar')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file', avatarUploadConfig))
    async uploadAvatar(@UploadedFile() file: any, @User() user: any) {
        if (!file) throw new ForbiddenException('No file provided');
        return { message: 'Avatar uploaded successfully', filePath: file.path };
    }

    @Post('upload/cv')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file', cvUploadConfig))
    async uploadCv(@UploadedFile() file: any, @User() user: any) {
        if (!file) throw new ForbiddenException('No file provided');
        return { message: 'CV uploaded successfully', filePath: file.path };
    }
}
