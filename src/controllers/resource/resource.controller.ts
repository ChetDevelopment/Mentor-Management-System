import {
    Controller, Get, Post, Delete, Body, Param, UseGuards,
    ForbiddenException,
} from '@nestjs/common';
import { ResourceService } from '../../services/resource/resource.service';
import { CreateResourceDto } from '../../dto/resource';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Public } from '../../decorators/public.decorator';
import { User } from '../../decorators/user.decorator';
import { UserRole } from '../../constants';

@Controller('resources')
export class ResourceController {
    constructor(private resourceService: ResourceService) {}

    @Public()
    @Get(':mentorId')
    async getResources(@Param('mentorId') mentorId: string) {
        return this.resourceService.getResources(mentorId);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MENTOR)
    @Post()
    async uploadResource(
        @Body() createResourceDto: CreateResourceDto,
        @User() user: any,
    ) {
        if (createResourceDto.mentorId !== user.userId) {
            throw new ForbiddenException('You can only upload resources for yourself');
        }
        return this.resourceService.uploadResource(createResourceDto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MENTOR)
    @Delete(':id')
    async deleteResource(@Param('id') id: string, @User() user: any) {
        return this.resourceService.deleteResource(id);
    }
}
