import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method } = request;
        const path = request.route?.path || request.url?.split('?')[0] || '/';

        const startTime = Date.now();
        const requestId = Math.random().toString(36).substring(2, 10);

        console.log(`[${requestId}] --> ${method} ${path}`);

        return next.handle().pipe(
            tap(() => {
                const response = context.switchToHttp().getResponse();
                const duration = Date.now() - startTime;
                console.log(`[${requestId}] <-- ${method} ${path} ${response.statusCode} ${duration}ms`);
            }),
        );
    }
}
