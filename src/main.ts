import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { SecurityMiddleware } from './middlewares/security.middleware';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        // Limit request body size to 1MB
        bodyParser: true,
        rawBody: false,
    });

    // Body size limit — 1MB maximum
    app.useBodyParser('json', { limit: '1mb' });

    // Security headers with relaxed CSP for API
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", 'data:', 'https:'],
                    fontSrc: ["'self'"],
                    connectSrc: ["'self'"],
                    objectSrc: ["'none'"],
                    frameAncestors: ["'none'"],
                    upgradeInsecureRequests: [],
                    baseUri: ["'self'"],
                    formAction: ["'self'"],
                    manifestSrc: ["'self'"],
                },
            },
            crossOriginEmbedderPolicy: false,
            crossOriginResourcePolicy: { policy: 'same-origin' },
            referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
            noSniff: true,
            xssFilter: true,
            hidePoweredBy: true,
            ieNoOpen: true,
            frameguard: { action: 'deny' },
            permittedCrossDomainPolicies: { permittedPolicies: 'none' },
        }),
    );

    app.setGlobalPrefix('api/v1');

    app.useStaticAssets(join(__dirname, '..', 'public'), {
        maxAge: '1d',
        setHeaders: (res) => {
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
        },
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: false,
            },
        }),
    );

    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalInterceptors(new TransformInterceptor());

    // CORS — restricted to known origins
    const corsOrigins = process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim())
        : ['http://localhost:4200'];

    app.enableCors({
        origin: corsOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-Name', 'X-Device-Type', 'X-Device-OS', 'X-Device-Browser'],
        exposedHeaders: ['X-Request-Id'],
        credentials: true,
        maxAge: 86400,
    });

    // Apply security middleware
    app.use(new SecurityMiddleware().use);

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application running on port ${port} (${process.env.NODE_ENV || 'development'})`);
}
bootstrap();
