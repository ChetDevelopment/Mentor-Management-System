import {
    Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query,
    ForbiddenException,
} from '@nestjs/common';
import { SessionService } from '../../services/session/session.service';
import { CreateSessionDto, UpdateSessionDto } from '../../dto/session';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { User } from '../../decorators/user.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../constants';

@Controller('sessions')
@UseGuards(AuthGuard)
export class SessionController {
    constructor(private sessionService: SessionService) {}

    @Get()
    async findAll(@Query() query: any, @User() user: any) {
        return this.sessionService.findAll(query, user);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @User() user: any) {
        const session = await this.sessionService.findById(id);
        this.verifySessionAccess(session, user);
        return session;
    }

    @Post()
    async create(@Body() createSessionDto: CreateSessionDto, @User() user: any) {
        return this.sessionService.create(createSessionDto, user);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateSessionDto: UpdateSessionDto,
        @User() user: any,
    ) {
        return this.sessionService.update(id, updateSessionDto, user);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @User() user: any) {
        return this.sessionService.remove(id, user);
    }

    @Post(':id/accept')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MENTOR)
    async accept(@Param('id') id: string, @User() user: any) {
        return this.sessionService.accept(id, user);
    }

    @Post(':id/decline')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MENTOR)
    async decline(@Param('id') id: string, @User() user: any) {
        return this.sessionService.decline(id, user);
    }

    @Post(':id/complete')
    async complete(@Param('id') id: string, @User() user: any) {
        const session = await this.sessionService.findById(id);
        this.verifySessionAccess(session, user);
        return this.sessionService.complete(id, user);
    }

    @Post(':id/cancel')
    async cancel(@Param('id') id: string, @User() user: any) {
        const session = await this.sessionService.findById(id);
        this.verifySessionAccess(session, user);
        return this.sessionService.cancel(id, user);
    }

    @Post(':id/no-show')
    async noShow(@Param('id') id: string, @User() user: any) {
        const session = await this.sessionService.findById(id);
        this.verifySessionAccess(session, user);
        return this.sessionService.noShow(id, user);
    }

    private verifySessionAccess(session: any, user: any) {
        if (user.role === UserRole.ADMIN) return;
        if (session.mentorId !== user.userId && session.menteeId !== user.userId) {
            throw new ForbiddenException('You do not have access to this session');
        }
    }
}
