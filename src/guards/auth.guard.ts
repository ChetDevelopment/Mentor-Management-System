import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Optional } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { jwtConfig } from '../config';
import { MentorService } from '../services/mentor/mentor.service';
import { UserRole, MentorStatus } from '../constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @Optional() private mentorService?: MentorService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConfig.secret,
      });
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    if (payload.role === UserRole.MENTOR && this.mentorService) {
      const mentor = await this.mentorService.findByUserId(payload.userId);
      if (mentor && (mentor.status === MentorStatus.PENDING || mentor.status === MentorStatus.SUSPENDED)) {
        throw new UnauthorizedException(
          `Mentor account is ${mentor.status}. Access denied.`,
        );
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
