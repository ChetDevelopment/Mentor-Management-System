import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { SecurityMiddleware } from './middlewares/security.middleware';

let cachedApp: any;

async function getApp() {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  app.setGlobalPrefix('api/v1');
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.use(new SecurityMiddleware().use);
  await app.init();

  cachedApp = app;
  return cachedApp;
}

export default async function handler(req: any, res: any) {
  try {
    const app = await getApp();
    const instance = app.getHttpAdapter().getInstance();
    return instance(req, res);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
