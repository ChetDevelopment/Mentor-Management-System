import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from '../config';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'mysql',
                host: databaseConfig.host,
                port: databaseConfig.port,
                username: databaseConfig.username,
                password: databaseConfig.password,
                database: databaseConfig.database,
                autoLoadEntities: true,
                synchronize: config.get('NODE_ENV') !== 'production',
                logging: config.get('NODE_ENV') === 'development' ? ['error', 'warn'] : ['error'],
                extra: {
                    connectionLimit: 10,
                },
            }),
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
