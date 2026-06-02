import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { MatchingService } from '../../services/matching/matching.service';
import { CreateMatchingDto, UpdateMatchingDto } from '../../dto/matching';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../constants';

@Controller('matchings')
@UseGuards(AuthGuard)
export class MatchingController {
  constructor(private matchingService: MatchingService) {}

  @UseGuards(RolesGuard)
  @Get('recommended')
  @Roles(UserRole.MENTEE)
  async getRecommended(@Query('menteeId') menteeId: string, @Query('skill') skill?: string) {
    return this.matchingService.getRecommendedMentors(menteeId, skill);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.matchingService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.matchingService.findById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createMatchingDto: CreateMatchingDto) {
    return this.matchingService.create(createMatchingDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMatchingDto: UpdateMatchingDto) {
    return this.matchingService.update(id, updateMatchingDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.matchingService.remove(id);
  }
}
