import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { SessionService } from '../../services/session/session.service';
import { CreateSessionDto, UpdateSessionDto } from '../../dto/session';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../../decorators/user.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../constants';

@Controller('sessions')
@UseGuards(AuthGuard)
export class SessionController {
  constructor(private sessionService: SessionService) { }

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
  @Roles(UserRole.MENTOR)
  @Post(':id/accept')
  async accept(@Param('id') id: string, @User() user: any) {
    return this.sessionService.accept(id, user);
  }

  @Roles(UserRole.MENTOR)
  @Post(':id/decline')
  async decline(@Param('id') id: string, @User() user: any) {
    return this.sessionService.decline(id, user);
  }

  @Post(':id/complete')
  async complete(@Param('id') id: string, @User() user: any) {
    return this.sessionService.complete(id, user);
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string, @User() user: any) {
    return this.sessionService.cancel(id, user);
  }

  @Post(':id/no-show')
  async noShow(@Param('id') id: string, @User() user: any) {
    return this.sessionService.noShow(id, user);
  }
}
