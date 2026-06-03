import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards
} from '@nestjs/common';
import { AdminService } from '../../services/admin/admin.service';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../constants';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 13.16 Dashboard stats
  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  // 13.17 Users with search + filter + pagination
  @Get('users')
  async getUsers(
    @Query('search') search?: string,
    @Query('filter') filter?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.adminService.getUsers({ search, filter, page, limit });
  }

  // 13.18 Mentors with pagination
  @Get('mentors')
  async getMentors(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.adminService.getMentors({ page, limit });
  }

  // 13.19 Mentees with pagination
  @Get('mentees')
  async getMentees(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.adminService.getMentees({ page, limit });
  }

  // 13.20 Deactivate user
  @Post('users/:id/deactivate')
  async deactivateUser(@Param('id') id: string) {
    return this.adminService.deactivateUser(id);
  }

  // 13.21 Reset user password
  @Post('users/:id/reset-password')
  async resetPassword(@Param('id') id: string) {
    return this.adminService.resetPassword(id);
  }

  // 13.22 Delete user
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // 13.23 Moderate feedback
  @Delete('feedback/:id')
  async deleteFeedback(@Param('id') id: string) {
    return this.adminService.deleteFeedback(id);
  }

  // 13.34 Reports integration (Person C)
  @Get('reports')
  async getReports() {
    return this.adminService.getReports();
  }

  @Post('reports/:id')
  async handleReport(@Param('id') id: string, @Body() body: any) {
    return this.adminService.handleReport(id, body);
  }
}
