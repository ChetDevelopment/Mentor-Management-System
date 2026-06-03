import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../../controllers/auth/auth.controller';
import { AuthService } from '../../services/auth/auth.service';
import { AuthRepository } from '../../repositories/auth/auth.repository';
import { AuthToken } from '../../entities/auth/auth-token.entity';
import { UserModule } from '../user/user.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Global()
@Module({
    imports: [
        UserModule,
        ActivityLogModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        TypeOrmModule.forFeature([AuthToken]),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthRepository],
    exports: [AuthService, AuthRepository],
})
export class AuthModule {}
