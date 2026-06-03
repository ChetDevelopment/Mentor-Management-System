import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare const OWNERSHIP_KEY = "ownership";
export type OwnershipConfig = {
    paramName: string;
    ownerIdFn: (paramValue: string) => Promise<string | null>;
    allowAdmin?: boolean;
};
export declare const Ownership: (config: OwnershipConfig) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare class OwnershipGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
