import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Remove fingerprinting headers
        res.removeHeader('X-Powered-By');

        // Security headers (double-check with helmet)
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'same-origin');
        res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        // Only set HSTS in production
        if (process.env.NODE_ENV === 'production') {
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        // Validate content-type for API requests
        if (req.path.startsWith('/api') && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
            const contentType = req.headers['content-type'];
            if (!contentType || !contentType.includes('application/json')) {
                if (req.body && Object.keys(req.body).length > 0) {
                    return res.status(415).json({
                        success: false,
                        statusCode: 415,
                        message: 'Unsupported Media Type: Use application/json',
                    });
                }
            }
        }

        next();
    }
}
