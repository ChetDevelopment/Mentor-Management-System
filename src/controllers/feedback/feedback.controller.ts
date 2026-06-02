import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { FeedbackService } from '../../services/feedback/feedback.service';
import { CreateFeedbackDto, UpdateFeedbackDto, RespondFeedbackDto } from '../../dto/feedback';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../constants';
import { User } from '../../decorators/user.decorator';

@Controller('feedback')
@UseGuards(AuthGuard)
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.feedbackService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.feedbackService.findById(id);
  }

  @Get('mentor/:mentorId')
  async findByMentor(@Param('mentorId') mentorId: string) {
    return this.feedbackService.getFeedbackByMentor(mentorId);
  }

  @Post()
  async create(@Body() createFeedbackDto: CreateFeedbackDto, @User() user: any) {
    return this.feedbackService.submitFeedback(createFeedbackDto, user);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }

  @Post(':id/respond')
  @UseGuards(RolesGuard)
  @Roles(UserRole.MENTOR)
  async respond(@Param('id') id: string, @Body() dto: RespondFeedbackDto) {
    return this.feedbackService.respondToFeedback(id, dto.mentorResponse);
  }
}
