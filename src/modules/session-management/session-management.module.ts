import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSession } from '../../entities/auth/session.entity';
import { SessionManagementRepository } from '../../repositories/session/session-management.repository';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([UserSession])],
    providers: [SessionManagementRepository],
    exports: [SessionManagementRepository],
})
export class SessionManagementModule {}
