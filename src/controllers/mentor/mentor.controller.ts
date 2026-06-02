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
} from '@nestjs/common';
import { MentorService } from '../../services/mentor/mentor.service';
import { UpdateMentorDto } from '../../dto/mentor/update-mentor.dto';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarUploadConfig, cvUploadConfig } from '../../common/upload.config';

@Controller('mentors')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

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
  @Roles(UserRole.ADMIN)
  async deleteMentor(@Param('id') id: string) {
    return this.mentorService.delete(id);
  }

  // ✅ Approve mentor (admin only)
  @Post(':id/approve')
  @Roles(UserRole.ADMIN)
  async approveMentor(@Param('id') id: string) {
    return this.mentorService.approve(id);
  }

  // ✅ Reject mentor (admin only, with reason)
  @Post(':id/reject')
  @Roles(UserRole.ADMIN)
  async rejectMentor(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.mentorService.reject(id, reason);
  }

  // ✅ Suspend mentor (admin only)
  @Post(':id/suspend')
  @Roles(UserRole.ADMIN)
  async suspendMentor(@Param('id') id: string) {
    return this.mentorService.suspend(id);
  }

  // ✅ Upload avatar (mentor uploads photo)
  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('file', avatarUploadConfig))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return { message: 'Avatar uploaded successfully', filePath: file.path };
  }

  // ✅ Upload CV (mentor uploads PDF resume)
  @Post('upload/cv')
  @UseInterceptors(FileInterceptor('file', cvUploadConfig))
  async uploadCv(@UploadedFile() file: Express.Multer.File) {
    return { message: 'CV uploaded successfully', filePath: file.path };
  }
}
