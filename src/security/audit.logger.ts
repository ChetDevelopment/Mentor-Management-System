import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export enum SecurityEvent {
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAILED = 'LOGIN_FAILED',
    LOGOUT = 'LOGOUT',
    TOKEN_REFRESH = 'TOKEN_REFRESH',
    TOKEN_REVOKED = 'TOKEN_REVOKED',
    PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
    PASSWORD_RESET_COMPLETED = 'PASSWORD_RESET_COMPLETED',
    PASSWORD_CHANGED = 'PASSWORD_CHANGED',
    EMAIL_VERIFIED = 'EMAIL_VERIFIED',
    EMAIL_VERIFICATION_REQUESTED = 'EMAIL_VERIFICATION_REQUESTED',
    ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
    ACCOUNT_UNLOCKED = 'ACCOUNT_UNLOCKED',
    FORBIDDEN_ACCESS = 'FORBIDDEN_ACCESS',
    UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
    SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
    SESSION_EXPIRED = 'SESSION_EXPIRED',
    SESSION_REVOKED = 'SESSION_REVOKED',
    PROFILE_UPDATED = 'PROFILE_UPDATED',
    ROLE_CHANGED = 'ROLE_CHANGED',
    USER_DELETED = 'USER_DELETED',
    USER_DEACTIVATED = 'USER_DEACTIVATED',
}

@Injectable()
export class AuditLogger {
    private readonly logger = new Logger('Audit');

    log(
        event: SecurityEvent,
        userId: string | null,
        details: Record<string, any> = {},
        ip?: string,
    ) {
        const entry = {
            timestamp: new Date().toISOString(),
            event,
            userId,
            ip: ip || 'unknown',
            ...details,
        };

        // Never log sensitive data
        const sanitized = this.sanitize(entry);

        // Structured JSON logging
        this.logger.log(JSON.stringify(sanitized));

        // In production, also write to a secure audit store
        if (process.env.NODE_ENV === 'production') {
            this.writeToAuditStore(sanitized);
        }
    }

    private sanitize(entry: Record<string, any>): Record<string, any> {
        const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken',
            'secret', 'authorization', 'cookie', 'set-cookie'];
        const sanitized = { ...entry };
        for (const key of Object.keys(sanitized)) {
            if (sensitiveFields.some((f) => key.toLowerCase().includes(f))) {
                sanitized[key] = '[REDACTED]';
            }
            if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
                sanitized[key] = this.sanitize(sanitized[key]);
            }
        }
        return sanitized;
    }

    private writeToAuditStore(entry: Record<string, any>) {
        try {
            const auditDir = path.join(process.cwd(), 'audit-logs');
            if (!fs.existsSync(auditDir)) {
                fs.mkdirSync(auditDir, { recursive: true, mode: 0o750 });
            }
            const date = new Date().toISOString().split('T')[0];
            const filePath = path.join(auditDir, `audit-${date}.log`);
            const line = JSON.stringify(entry) + '\n';
            fs.appendFileSync(filePath, line, { encoding: 'utf8' });
        } catch (err) {
            this.logger.error(`Failed to write audit log: ${(err as Error).message}`);
        }
    }
}
