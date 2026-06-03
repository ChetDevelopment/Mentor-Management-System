import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from '../constants';

export const OWNERSHIP_KEY = 'ownership';
export type OwnershipConfig = {
    /** The param name in the route (e.g. 'id', 'userId', 'mentorId') */
    paramName: string;
    /** Function to extract the owner ID from the resource, given the param value */
    ownerIdFn: (paramValue: string) => Promise<string | null>;
    /** Whether admin can bypass ownership check */
    allowAdmin?: boolean;
};

export const Ownership = (config: OwnershipConfig) => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata(OWNERSHIP_KEY, config, target, propertyKey);
    };
};

@Injectable()
export class OwnershipGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const config = this.reflector.get<OwnershipConfig>(
            OWNERSHIP_KEY,
            context.getHandler(),
        );

        if (!config) return true; // No ownership check configured

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const paramValue = request.params[config.paramName];

        if (!paramValue) {
            throw new ForbiddenException('Resource identifier missing');
        }

        // Admin bypass
        if (config.allowAdmin !== false && user.role === UserRole.ADMIN) {
            return true;
        }

        const ownerId = await config.ownerIdFn(paramValue);
        if (!ownerId) {
            throw new ForbiddenException('Resource not found');
        }

        if (ownerId !== user.userId && ownerId !== user.id) {
            throw new ForbiddenException('You do not have permission to access this resource');
        }

        return true;
    }
}
