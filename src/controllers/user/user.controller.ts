import {
    Controller,
    Get,
    Put,
    Delete,
    Param,
    Body,
    UseGuards,
    ForbiddenException,
} from '@nestjs/common';
import { UserService } from '../../services/user/user.service';
import { UpdateUserDto } from '../../dto/user/update_user.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../constants';
import { User } from '../../decorators/user.decorator';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('profile')
    async getProfile(@User() user: any) {
        return this.userService.findById(user.userId);
    }

    @Put('profile')
    async updateProfile(
        @User() user: any,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.userService.update(user.userId, updateUserDto);
    }

    @Get()
    @Roles(UserRole.ADMIN)
    async findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    @Roles(UserRole.ADMIN)
    async findById(@Param('id') id: string) {
        return this.userService.findById(id);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN)
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    async deleteUser(@Param('id') id: string) {
        return this.userService.delete(id);
    }
}
