// Vercel serverless handler — compiled with `nest build`
const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const helmet = require('helmet');
const { join } = require('path');

let cachedApp;

async function getApp() {
  if (cachedApp) return cachedApp;

  const { AppModule } = require('../dist/app.module');
  const { AllExceptionsFilter } = require('../dist/filters/http-exception.filter');
  const { LoggingInterceptor } = require('../dist/interceptors/logging.interceptor');
  const { TransformInterceptor } = require('../dist/interceptors/transform.interceptor');
  const { SecurityMiddleware } = require('../dist/middlewares/security.middleware');

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

module.exports = async function handler(req, res) {
  try {
    const app = await getApp();
    const instance = app.getHttpAdapter().getInstance();
    return instance(req, res);
  } catch (error) {
    console.error('Handler error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
