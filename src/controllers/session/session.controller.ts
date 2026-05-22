import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { SessionService } from '../../services/session/session.service';
import { CreateSessionDto, UpdateSessionDto } from '../../dto/session';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../../decorators/user.decorator';

@Controller('sessions')
@UseGuards(AuthGuard)
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Get()
  async findAll(@Query() query: any, @User() user: any) {
    return this.sessionService.findAll(query, user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sessionService.findById(id);
  }

  @Post()
  async create(@Body() createSessionDto: CreateSessionDto, @User() user: any) {
    return this.sessionService.create(createSessionDto, user);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionService.update(id, updateSessionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sessionService.remove(id);
  }
}
