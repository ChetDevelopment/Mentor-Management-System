import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../../config';
import { RolesGuard } from '../../guards/roles.guard';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.expiresIn },
    }),
  ],
  providers: [RolesGuard],
  exports: [JwtModule, RolesGuard],
})
export class SharedModule {}
