import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const dbUrl = config.get('DATABASE_URL');
                const base: any = {
                    type: 'postgres',
                    autoLoadEntities: true,
                    synchronize: config.get('NODE_ENV') !== 'production',
                    logging: config.get('NODE_ENV') === 'development' ? ['error', 'warn'] : ['error'],
                    extra: {
                        max: 10,
                    },
                };

                if (dbUrl) {
                    return { ...base, url: dbUrl, ssl: { rejectUnauthorized: false } };
                }

                return {
                    ...base,
                    host: config.get('DB_HOST', 'localhost'),
                    port: parseInt(config.get('DB_PORT', '5432'), 10),
                    username: config.get('DB_USERNAME', 'postgres'),
                    password: config.get('DB_PASSWORD', ''),
                    database: config.get('DB_DATABASE', 'mentor_management'),
                };
            },
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
