import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenBlacklist } from '../../entities/auth/token-blacklist.entity';
import { BlacklistRepository } from '../../repositories/blacklist/blacklist.repository';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([TokenBlacklist])],
    providers: [BlacklistRepository],
    exports: [BlacklistRepository],
})
export class BlacklistModule {}
