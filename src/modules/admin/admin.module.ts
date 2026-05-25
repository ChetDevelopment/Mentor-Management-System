import { Module } from '@nestjs/common';
import { AdminController } from '../../controllers/admin/admin.controller';
import { AdminService } from '../../services/admin/admin.service';
import { UserModule } from '../user/user.module';
import { MentorModule } from '../mentor/mentor.module';
import { MenteeModule } from '../mentee/mentee.module';

@Module({
  imports: [UserModule, MentorModule, MenteeModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
