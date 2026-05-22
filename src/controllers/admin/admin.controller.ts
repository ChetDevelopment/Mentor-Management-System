import { Controller, Get, Post, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { AdminService } from '../../services/admin/admin.service';
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../constants';

@Controller('admin')
@UseGuards(AuthGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  async getAllUsers(@Query() query: any) {
    return this.adminService.findAllUsers(query);
  }

  @Get('mentors')
  async getAllMentors(@Query() query: any) {
    return this.adminService.findAllMentors(query);
  }

  @Get('mentees')
  async getAllMentees(@Query() query: any) {
    return this.adminService.findAllMentees(query);
  }

  @Post('users/:id/deactivate')
  async deactivateUser(@Param('id') id: string) {
    return this.adminService.deactivateUser(id);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }
}
