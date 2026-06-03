import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { BlacklistRepository } from '../repositories/blacklist/blacklist.repository';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private blacklistRepo: BlacklistRepository,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Authentication required');
        }

        let payload: any;
        try {
            payload = await this.jwtService.verifyAsync(token, {
                algorithms: ['HS256'],
                issuer: 'mentor-management-system',
                audience: 'mentor-management-api',
            });
        } catch (e: any) {
            if (e.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token has expired');
            }
            throw new UnauthorizedException('Invalid or malformed token');
        }

        // Check if token has been revoked
        const isRevoked = await this.blacklistRepo.isBlacklisted(token);
        if (isRevoked) {
            throw new UnauthorizedException('Token has been revoked');
        }

        request.user = {
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
        };
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers.authorization;
        if (!authHeader) return undefined;

        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer' || !token) return undefined;

        return token;
    }
}
