import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../../config';
import { RolesGuard } from '../../guards/roles.guard';

@Global()
@Module({
    imports: [
        JwtModule.register({
            secret: jwtConfig.secret,
            signOptions: {
                expiresIn: jwtConfig.expiresIn,
                issuer: 'mentor-management-system',
                audience: 'mentor-management-api',
                algorithm: 'HS256',
            },
        }),
    ],
    providers: [RolesGuard],
    exports: [JwtModule, RolesGuard],
})
export class SharedModule {}
