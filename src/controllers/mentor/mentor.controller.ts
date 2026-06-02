import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { MentorService } from '../../services/mentor/mentor.service';
import { CreateMentorDto, UpdateMentorDto } from '../../dto/mentor';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthGuard } from '../../guards/auth.guard';
import { Public } from '../../decorators/public.decorator';
import { UserRole } from '../../constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarUploadConfig, cvUploadConfig } from '../../common/upload.config';

@Controller('mentors')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  // ✅ List all mentors with filters
  @Public()
  @Get()
  async findAll(@Query() query: any) {
    return this.mentorService.findAll(query);
  }

  // ✅ Get single mentor
  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.mentorService.findById(id);
  }

  // ✅ Create mentor (admin only)
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createMentorDto: CreateMentorDto) {
    return this.mentorService.create(createMentorDto);
  }

  // ✅ Update mentor profile
  @Put(':id')
  async updateMentor(
    @Param('id') id: string,
    @Body() updateMentorDto: UpdateMentorDto,
  ) {
    return this.mentorService.update(id, updateMentorDto);
  }

  // ✅ Delete mentor (admin only)
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteMentor(@Param('id') id: string) {
    return this.mentorService.remove(id);
  }

  // ✅ Approve mentor (admin only)
  @Post(':id/approve')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async approveMentor(@Param('id') id: string) {
    return this.mentorService.approve(id);
  }

  // ✅ Reject mentor (admin only, with reason)
  @Post(':id/reject')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async rejectMentor(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.mentorService.reject(id, reason);
  }

  // ✅ Suspend mentor (admin only)
  @Post(':id/suspend')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async suspendMentor(@Param('id') id: string) {
    return this.mentorService.suspend(id);
  }

  // ✅ Upload avatar (mentor uploads photo)
  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('file', avatarUploadConfig))
  async uploadAvatar(@UploadedFile() file: any) {
    return { message: 'Avatar uploaded successfully', filePath: file.path };
  }

  // ✅ Upload CV (mentor uploads PDF resume)
  @Post('upload/cv')
  @UseInterceptors(FileInterceptor('file', cvUploadConfig))
  async uploadCv(@UploadedFile() file: any) {
    return { message: 'CV uploaded successfully', filePath: file.path };
  }
}
