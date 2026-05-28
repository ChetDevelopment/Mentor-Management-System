import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { createConnection } from 'mysql2/promise';
import { databaseConfig } from '../config';

async function ensureDatabaseExists(): Promise<void> {
  const connection = await createConnection({
    host: databaseConfig.host,
    port: databaseConfig.port,
    user: databaseConfig.username,
    password: databaseConfig.password,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseConfig.database}\``);
  await connection.end();
}

async function createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
  await ensureDatabaseExists();

  return {
    type: 'mysql',
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.database,
    autoLoadEntities: true,
    dropSchema: process.env.NODE_ENV !== 'production',
    synchronize: process.env.NODE_ENV !== 'production',
  };
}

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: createTypeOrmOptions,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
