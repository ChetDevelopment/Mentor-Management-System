import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { BlacklistRepository } from '../repositories/blacklist/blacklist.repository';
export declare class AuthGuard implements CanActivate {
    private jwtService;
    private reflector;
    private blacklistRepo;
    constructor(jwtService: JwtService, reflector: Reflector, blacklistRepo: BlacklistRepository);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
