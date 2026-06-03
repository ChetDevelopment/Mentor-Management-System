import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'An unexpected error occurred';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'string') {
                message = res;
            } else if (typeof res === 'object') {
                const obj = res as any;
                message = Array.isArray(obj.message) ? obj.message[0] : obj.message || message;
            }
        } else if (exception instanceof QueryFailedError) {
            const err = exception as any;
            const driverErr = err.driverError;
            if (driverErr && driverErr.code === 'ER_DUP_ENTRY') {
                status = HttpStatus.BAD_REQUEST;
                message = 'Duplicate entry — resource already exists';
            } else {
                status = HttpStatus.INTERNAL_SERVER_ERROR;
                message = 'Database operation failed';
            }
            console.error(`[DB ERROR] ${err.message}`);
        } else {
            const err = exception as any;
            console.error(`[UNHANDLED ERROR] ${err?.message || exception}`);
            if (process.env.NODE_ENV === 'development') {
                console.error(err?.stack);
            }
        }

        const responseBody: any = {
            success: false,
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
        };

        // Only include path and stack in development
        if (process.env.NODE_ENV === 'development') {
            responseBody.path = request.url;
            if (exception instanceof Error) {
                responseBody.error = exception.stack;
            }
        }

        response.status(status).json(responseBody);
    }
}
