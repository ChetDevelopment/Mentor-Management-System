# Security Assessment Report — Mentor Management System

**Date:** 2026-06-02
**Classification:** CONFIDENTIAL
**Assessor:** Senior Application Security Engineer

---

## A. Executive Summary

A comprehensive security assessment of the Mentor Management System (MMS) was conducted. The application is built with NestJS (TypeScript), TypeORM, and MySQL. It exposes 67 API endpoints with JWT-based authentication and role-based access control.

**Overall Security Score: 38/100** — IMMEDIATE ACTION REQUIRED

The application contains **6 Critical**, **12 High**, **8 Medium**, and **4 Low** severity vulnerabilities. The most critical issues include:

- Token revocation is **completely broken** — logged-out users can still use old tokens
- Refresh tokens are **not rotated** — a stolen refresh token remains valid for 7 days
- **No JWT `aud` or `iss` validation** — tokens from any issuer are accepted
- **Mass assignment** in UpdateUserDto allows users to modify their own `role` and `isActive`
- **PII logged to console** in plain sight
- **CORS is wide open** — any origin can access the API
- **No rate limiting** — brute force attacks are trivial
- **No security headers** — XSS, clickjacking, and MIME-type attacks are possible
- **`synchronize: true` in production** — schema can be dropped
- **Hardcoded fallback secrets** — `JWT_SECRET` defaults to `your-secret-key`

---

## B. Architecture Security Assessment

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser    │────→│   Nginx      │────→│  Node/API    │────→│  MySQL  │
│   / Mobile   │     │  (port 80)   │     │  (port 3000) │     │(3306)   │
└──────────────┘     └──────────────┘     └──────────────┘
                          │                      │
                    ❌ No HTTPS              ❌ sync:true
                    ❌ No rate limit         ❌ No validation
                    ❌ No security headers    on some inputs
```

**Critical Architectural Weaknesses:**

1. No Web Application Firewall (WAF)
2. No API gateway with authentication enforcement
3. No secrets management solution
4. No centralized audit logging
5. No IP allow-listing for admin endpoints
6. Database credentials have full DDL access (`synchronize: true`)

---

## C. Vulnerability Findings Table

| # | Severity | Vulnerability | Location | Impact | Exploitation Scenario | OWASP |
|---|----------|--------------|----------|--------|----------------------|-------|
| 1 | **CRITICAL** | Token revocation bypass | `auth.service.ts:128-132` | Logged-out users can still use tokens | Attacker steals token → victim logs out → attacker still uses token | API3:2019 |
| 2 | **CRITICAL** | Refresh token never rotated | `auth.service.ts:134-138` | Stolen refresh token = permanent access | Attacker steals refresh token → uses it indefinitely for 7 days | API3:2019 |
| 3 | **CRITICAL** | No JWT aud/iss/alg validation | `auth.guard.ts:32` | Forged JWTs accepted | Attacker crafts JWT with `alg: "none"` → accesses any endpoint | API2:2019 |
| 4 | **CRITICAL** | Mass assignment — user can set own role | `dto/user/index.ts:48-50`, `user.controller.ts:29-33` | Any user can escalate to admin | Mentee sends PUT `/users/profile` with `{ "role": "admin", "isActive": true }` | API6:2019 |
| 5 | **CRITICAL** | Password reset returns token in response | `auth.service.ts:91` | Anyone with the reset link can take over account | Attacker requests password reset for victim → sees plaintext token in response | API2:2019 |
| 6 | **CRITICAL** | `synchronize: true` in database config | `database.module.ts:17` | Schema can be destroyed | MySQL injection or misconfig can drop tables | A06:2021 |
| 7 | **HIGH** | No rate limiting anywhere | No throttle module installed | Brute force attacks unlimited | Attacker sends 10M login requests per minute | API4:2019 |
| 8 | **HIGH** | CORS wide open `app.enableCors()` | `main.ts:29` | Any website can call API | Victim visits attacker site → authenticated requests sent via browser | A01:2021 |
| 9 | **HIGH** | PII logged to console | `logging.interceptor.ts:16,21` | Sensitive data exposed in logs | `GET /users/profile` logs full URL including query params with IDs | A09:2021 |
| 10 | **HIGH** | Error details leaked to client | `http-exception.filter.ts:27` | Stack traces, paths, DB errors exposed | Attacker sends malformed request → gets stack trace with internal paths | A05:2021 |
| 11 | **HIGH** | No ownership validation (IDOR) | `session.controller.ts:30-32`, `session.service.ts:58-74` | Any user can update/delete any session | Mentee updates mentor's session with PUT `/sessions/:id` | API1:2019 |
| 12 | **HIGH** | No ownership validation — feedback | `feedback.controller.ts:36-38` | Any user can update any feedback | User changes another user's feedback rating | API1:2019 |
| 13 | **HIGH** | No ownership validation — availabilities | `availability.controller.ts:36-38` | Mentor can update/delete other mentors' slots | Mentor deletes another mentor's availability | API1:2019 |
| 14 | **HIGH** | Notifications accessible by any user | `notification.controller.ts:14-17` | Any user can read any other user's notifications | User requests `/notifications/:anyUserId` | API1:2019 |
| 15 | **HIGH** | Password reset iterates ALL users | `auth.service.ts:97-108` | Performance issue + timing attack possible | Attacker can enumerate valid reset tokens via timing | API4:2019 |
| 16 | **HIGH** | No security headers | Nginx config, main.ts | XSS, clickjacking, MIME sniffing possible | Attacker embeds API in iframe → clickjack admin | A05:2021 |
| 17 | **HIGH** | Hardcoded fallback JWT secret | `config/index.ts:16` | Anyone can forge JWTs | `process.env.JWT_SECRET || 'your-secret-key'` — default is known | API2:2019 |
| 18 | **HIGH** | File upload path traversal risk | `upload.config.ts:9` | Upload with `../` in filename overwrites files | Sending filename `../../etc/passwd` could overwrite files | A01:2021 |
| 19 | **MEDIUM** | No CSRF protection | No CSRF tokens anywhere | State-changing requests vulnerable | Victim clicks crafted link → performs action as victim | A01:2021 |
| 20 | **MEDIUM** | No HTTPS termination | nginx.conf listens on port 80 only | Traffic in plaintext | Man-in-the-middle intercepts JWTs | A02:2021 |
| 21 | **MEDIUM** | Token stored as plaintext in DB | `auth-token.entity.ts:11-15` | DB breach exposes all tokens | Attacker dumps `auth_tokens` table → gets all active JSESSION equivalents | A02:2021 |
| 22 | **MEDIUM** | Weak password policy (min 6 chars) | `register.dto.ts:19` | Brute force feasible | 6-char password can be cracked quickly | API2:2019 |
| 23 | **MEDIUM** | User controller takes userId from body | `user.controller.ts:24,31` | Confusing API — userId in body not JWT | Users could pass another user's userId in profile endpoints | API1:2019 |
| 24 | **MEDIUM** | Profile update allows email change without verification | `update_user.dto.ts:20-22` | Account takeover by changing email | Attacker changes email → password reset goes to attacker's email | API2:2019 |
| 25 | **MEDIUM** | Email verification token returned in response | `auth.service.ts:158` | Token leaked in response | Attacker registers → gets verification token → verifies any email | API3:2019 |
| 26 | **MEDIUM** | `forbidNonWhitelisted: false` | `main.ts:20` | Extra fields not rejected | Mass assignment via unexpected fields still possible | API6:2019 |
| 27 | **LOW** | X-Powered-By header disclosed | Express default | Info leakage | Response includes `X-Powered-By: Express` | A05:2021 |
| 28 | **LOW** | Server version disclosure | Nginx default | Info leakage | Nginx version can be probed | A05:2021 |
| 29 | **LOW** | Auth token `findByToken` used but token not hashed | `auth.repository.ts:22-24` | Token lookup is O(n) | No immediate exploit, but weakens token validation | A02:2021 |
| 30 | **LOW** | Refresh token never stored hashed | `auth.service.ts:171-178` | DB breach gives permanent access | See #22 | A02:2021 |

---

## D. Detailed Findings & Secure Code Fixes

### FINDING 1 (CRITICAL): Token Revocation Bypass

**Vulnerability:**
`AuthService.logout()` calls `authRepository.deactivateByUserId()` which sets `isActive = false` for ALL tokens belonging to the user. However, `AuthGuard` does NOT check the token's active status — it only verifies JWT signature + expiration. A logged-out token continues to work until it expires.

**Vulnerable Code:**
```typescript
// auth.service.ts:128-132
async logout(userId: string) {
    await this.authRepository.deactivateByUserId(userId);
    return { message: 'Logout successful' };
}

// auth.guard.ts:30-36 — NEVER checks token active status
try {
    payload = await this.jwtService.verifyAsync(token);
    request.user = payload;
} catch (e) {
    throw new UnauthorizedException('Invalid token');
}
```

**Exploitation:**
1. Attacker intercepts victim's JWT (via MitM, XSS, or log)
2. Victim logs out
3. Attacker continues using the stolen token for up to 7 days (JWT expiry)
4. API accepts all requests

**Fix — auth.guard.ts:**
```typescript
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { TokenBlacklist } from '../entities/auth/token-blacklist.entity';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        @InjectRepository(TokenBlacklist)
        private blacklistRepo: Repository<TokenBlacklist>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException('No token provided');

        let payload: any;
        try {
            payload = await this.jwtService.verifyAsync(token, {
                algorithms: ['HS256'],
                issuer: 'mentor-management-system',
                audience: 'mentor-management-api',
            });
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }

        // Check if token is blacklisted
        const blacklisted = await this.blacklistRepo.findOne({
            where: { tokenHash: this.hashToken(token) },
        });
        if (blacklisted) {
            throw new UnauthorizedException('Token has been revoked');
        }

        request.user = payload;
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private hashToken(token: string): string {
        const crypto = require('crypto');
        return crypto.createHash('sha256').update(token).digest('hex');
    }
}
```

**Fix — TokenBlacklist Entity:**
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('token_blacklist')
export class TokenBlacklist {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column()
    tokenHash: string;

    @Column()
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
```

**Fix — auth.service.ts logout:**
```typescript
async logout(userId: string, token: string) {
    const tokenHash = this.hashToken(token);
    const decoded = this.jwtService.decode(token) as any;
    const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 3600000);

    // Add to blacklist
    await this.blacklistRepo.insert({ tokenHash, expiresAt });

    // Revoke all refresh tokens
    await this.authRepository.deactivateByUserId(userId);

    await this.activityLogService.log(userId, ActivityType.LOGOUT, 'user', userId);
    return { message: 'Logout successful' };
}

private hashToken(token: string): string {
    return require('crypto').createHash('sha256').update(token).digest('hex');
}
```

**Why this is secure:**
- Each token is hashed before blacklist storage (no plaintext tokens in DB)
- Blacklist is checked on every request
- Expired blacklist entries can be cleaned up via scheduled job
- Refresh tokens are also revoked

---

### FINDING 2 (CRITICAL): Refresh Token Never Rotated

**Vulnerability:**
`refreshToken()` always generates new tokens without invalidating the old one. A stolen refresh token works indefinitely for 7 days.

**Vulnerable Code:**
```typescript
// auth.service.ts:134-138
async refreshToken(user: any) {
    const tokens = await this.generateTokens(user);
    await this.storeToken(user.userId, tokens);
    return tokens;
}
```

**Exploitation:**
1. Attacker steals refresh token
2. Attacker calls `/auth/refresh-token` every 15 minutes to get new access tokens
3. Original user's session cannot be terminated

**Fix:**
```typescript
async refreshToken(user: any, oldRefreshToken: string) {
    // Hash the incoming refresh token
    const hashed = this.hashToken(oldRefreshToken);
    
    // Find and deactivate the specific old refresh token
    const existing = await this.authRepository.findByRefreshHash(hashed);
    if (!existing || !existing.isActive) {
        // Possible token theft — revoke ALL tokens for user
        await this.authRepository.deactivateByUserId(user.userId);
        throw new UnauthorizedException('Refresh token has been revoked');
    }

    // Rotate: generate new tokens
    const tokens = await this.generateTokens(user);
    
    // Store new tokens, deactivate old ones
    await this.authRepository.deactivateByRefreshHash(hashed);
    await this.storeToken(user.userId, tokens);

    return tokens;
}
```

**Add to auth.repository.ts:**
```typescript
async findByRefreshHash(hash: string): Promise<AuthToken | null> {
    return this.repository.findOne({ where: { refreshTokenHash: hash } });
}

async deactivateByRefreshHash(hash: string): Promise<void> {
    await this.repository.update({ refreshTokenHash: hash }, { isActive: false });
}
```

---

### FINDING 3 (CRITICAL): No JWT alg/aud/iss Validation

**Vulnerability:**
`AuthGuard` calls `jwtService.verifyAsync(token)` without specifying algorithms, audience, or issuer. This makes the application vulnerable to:
- **`alg: "none"` attack**: Attacker sends JWT with `alg: "none"` and any payload
- **Algorithm confusion attack**: Attacker changes `alg` from `HS256` to `RS256` and uses the public key
- **Cross-app token reuse**: Token from another app with same secret can access this API

**Fix (already shown in Finding 1 guard):**
```typescript
payload = await this.jwtService.verifyAsync(token, {
    algorithms: ['HS256'],
    issuer: 'mentor-management-system',
    audience: 'mentor-management-api',
});
```

**Also fix jwtConfig to include issuer and audience:**
```typescript
export const jwtConfig = {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: 'mentor-management-system',
    audience: 'mentor-management-api',
};
```

---

### FINDING 4 (CRITICAL): Mass Assignment — User Can Set Own Role

**Vulnerability:**
`UpdateUserDto` in `dto/user/index.ts:48-50` allows updating `role` and `isActive`. The `updateProfile` endpoint in `UserController` passes the entire body to `UserService.update()` without stripping sensitive fields.

**Vulnerable Code:**
```typescript
// user.controller.ts:28-34
@Put('profile')
async updateProfile(
    @Body('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,  // user controls ALL fields
) {
    return this.userService.update(userId, updateUserDto);
}

// dto/user/index.ts:48-54
export class UpdateUserDto {
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;  // <-- USER CAN SET THIS!

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;  // <-- USER CAN SET THIS!
}
```

**Exploitation:**
```json
PUT /api/v1/users/profile
{
    "userId": "my-id",
    "role": "admin",
    "isActive": true
}
```
→ User becomes admin.

**Fix — Remove sensitive fields from UpdateUserDto:**
```typescript
// dto/user/update_user.dto.ts
import { IsOptional, IsString, IsPhoneNumber, IsUrl } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @IsOptional()
    @IsUrl()
    avatar?: string;
}
```

**Fix — Create separate AdminUpdateUserDto for admin:**
```typescript
export class AdminUpdateUserDto {
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;
}
```

**Fix — Enforce userId from JWT for profile endpoints:**
```typescript
@Put('profile')
async updateProfile(
    @User() user: any,  // from JWT, not from body
    @Body() updateUserDto: UpdateUserDto,
) {
    return this.userService.update(user.userId, updateUserDto);
}
```

---

### FINDING 5 (CRITICAL): Password Reset Token Leaked in Response

**Vulnerability:**
`forgotPassword()` returns the plaintext reset token in the response body. Anyone who can intercept the API response can reset the password.

**Vulnerable Code:**
```typescript
// auth.service.ts:91
return { message: 'Password reset token generated', resetToken: rawToken };
```

**Exploitation:**
1. Attacker calls `POST /auth/forgot-password` with victim's email
2. Response includes `{ resetToken: "abc123...", message: "Password reset token generated" }`
3. Attacker uses token to reset victim's password
4. Victim is locked out

**Fix:**
```typescript
async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.findByEmail(forgotPasswordDto.email);
    if (!user) {
        // Return generic message to prevent email enumeration
        return { message: 'If that email is registered, a reset token has been generated' };
    }

    const rawToken = this.generateResetToken();
    const hashedToken = await this.userService.hashPassword(rawToken);
    const expiry = new Date(Date.now() + 1 * 60 * 60 * 1000);

    await this.userService.update(user.id, {
        resetToken: hashedToken,
        resetTokenExpiry: expiry,
    });

    // In production, send token via email only
    // For development, still return generic message
    return { message: 'If that email is registered, a reset token has been generated' };
}
```

---

### FINDING 6 (CRITICAL): synchronize: true in Production

**Vulnerability:**
TypeORM `synchronize: true` automatically alters the database schema to match entities on every startup. In production, this can:
- Drop tables with all data
- Create unexpected columns
- Destroy the database

**Fix:**
```typescript
// database.module.ts
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'mysql',
                host: config.get('DB_HOST'),
                port: config.get<number>('DB_PORT'),
                username: config.get('DB_USERNAME'),
                password: config.get('DB_PASSWORD'),
                database: config.get('DB_DATABASE'),
                autoLoadEntities: true,
                synchronize: config.get('NODE_ENV') !== 'production',
                logging: config.get('NODE_ENV') === 'development' ? ['error', 'warn'] : ['error'],
            }),
        }),
    ],
})
export class DatabaseModule {}
```

---

### FINDING 7 (HIGH): No Rate Limiting

**Vulnerability:**
No `@nestjs/throttler` installed. An attacker can brute force login credentials, enumerate users, or DDoS the API with unlimited requests.

**Fix:**
```bash
npm install @nestjs/throttler
```

```typescript
// app.module.ts imports
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 60000,  // 1 minute window
                limit: 100,   // 100 requests per minute globally
            },
        ]),
        // ... other imports
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
```

**Per-route rate limiting for auth:**
```typescript
// auth.controller.ts
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Public()
@Throttle({ default: { limit: 5, ttl: 60000 } })  // 5 requests per minute
@Post('login')
async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
}

@Public()
@Throttle({ default: { limit: 3, ttl: 60000 } })  // 3 requests per minute
@Post('register')
async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
}
```

---

### FINDING 8 (HIGH): CORS Wide Open

**Vulnerability:**
`app.enableCors()` allows all origins, methods, and headers.

**Fix:**
```typescript
// main.ts
app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Request-Id'],
    credentials: true,
    maxAge: 86400,  // 24 hours
});
```

**.env:**
```
CORS_ORIGINS=http://localhost:4200,https://myapp.com
```

---

### FINDING 9 (HIGH): PII Logged to Console

**Vulnerability:**
`LoggingInterceptor` logs full URLs including query params (which may contain tokens, IDs, or PII).

**Fix:**
```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, path } = request.route || { method: request.method, path: request.url?.split('?')[0] };

        // Log sanitized info — strip query params
        console.log(`[${new Date().toISOString()}] ${method} ${path}`);

        return next.handle().pipe(
            tap(() => {
                const response = context.switchToHttp().getResponse();
                console.log(`[${new Date().toISOString()}] ${method} ${path} - ${response.statusCode}`);
            }),
        );
    }
}
```

---

### FINDING 10 (HIGH): Error Details Leaked

**Vulnerability:**
`AllExceptionsFilter` catches all exceptions and sends the raw message to the client. Stack traces, internal paths, and database errors can be exposed.

**Fix:**
```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            message = typeof res === 'string' ? res : (res as any).message || message;
        } else if (exception instanceof QueryFailedError) {
            // Don't expose database errors
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'An unexpected error occurred';
            console.error(`[DB ERROR] ${(exception as any).message}`);
        } else {
            console.error(`[UNHANDLED ERROR] ${(exception as any)?.message || exception}`);
        }

        // Never expose stack traces in production
        if (process.env.NODE_ENV !== 'development') {
            response.status(status).json({
                success: false,
                statusCode: status,
                message,
                timestamp: new Date().toISOString(),
            });
        } else {
            response.status(status).json({
                success: false,
                statusCode: status,
                message,
                error: (exception as any)?.stack,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        }
    }
}
```

---

### FINDING 11 (HIGH): IDOR — Session Ownership Not Validated

**Vulnerability:**
`PUT /sessions/:id` and `DELETE /sessions/:id` do not verify that the requesting user owns the session. Any authenticated user can modify or delete any session.

**Fix — session.service.ts:**
```typescript
async update(id: string, updateSessionDto: UpdateSessionDto, user: any) {
    const session = await this.findById(id);

    // Validate ownership
    const userRole = user.role;
    const isMentor = session.mentorId === user.userId;
    const isMentee = session.menteeId === user.userId;
    const isAdmin = userRole === UserRole.ADMIN;

    if (!isMentor && !isMentee && !isAdmin) {
        throw new ForbiddenException('You do not have permission to update this session');
    }

    // Non-admin can only update certain fields
    if (!isAdmin) {
        updateSessionDto = this.sanitizeUpdate(updateSessionDto, userRole);
    }

    const sessionData: Partial<Session> = {
        title: updateSessionDto.title,
        description: updateSessionDto.description,
        meetingLink: updateSessionDto.meetingLink,
        notes: updateSessionDto.notes,
    };
    if (updateSessionDto.scheduledAt) {
        sessionData.scheduledAt = new Date(updateSessionDto.scheduledAt);
    }
    if (updateSessionDto.status && isAdmin) {
        sessionData.status = updateSessionDto.status;
    }

    return this.sessionRepository.update(id, sessionData);
}

private sanitizeUpdate(dto: UpdateSessionDto, role: string): UpdateSessionDto {
    // Mentors/mentees cannot change status
    delete dto.status;
    return dto;
}
```

---

### FINDING 12 (HIGH): IDOR — Feedback Ownership Not Validated

**Fix — feedback.service.ts:**
```typescript
async update(id: string, updateFeedbackDto: UpdateFeedbackDto, user: any) {
    const feedback = await this.feedbackRepository.findById(id);
    if (!feedback) throw new NotFoundException('Feedback not found');

    // Only the feedback author or admin can update
    if (feedback.menteeId !== user.userId && user.role !== UserRole.ADMIN) {
        throw new ForbiddenException('You can only update your own feedback');
    }

    const updated = await this.feedbackRepository.update(id, updateFeedbackDto);
    await this.updateMentorRating(feedback.mentorId);
    return updated;
}

async remove(id: string, user: any) {
    const feedback = await this.feedbackRepository.findById(id);
    if (!feedback) throw new NotFoundException('Feedback not found');

    if (feedback.menteeId !== user.userId && user.role !== UserRole.ADMIN) {
        throw new ForbiddenException('You can only delete your own feedback');
    }

    return this.feedbackRepository.remove(id);
}
```

---

### FINDING 13 (HIGH): IDOR — Notifications Accessible by Any User

**Fix — notification.controller.ts:**
```typescript
@Get(':userId')
async findAll(@Param('userId') userId: string, @User() user: any) {
    // Users can only see their own notifications
    if (userId !== user.userId && user.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Access denied');
    }
    return this.notificationService.findAll(userId);
}
```

---

### FINDING 14 (HIGH): No Security Headers

**Fix — main.ts:**
```typescript
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Security headers
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
        strictTransportSecurity: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
        frameguard: { action: 'deny' },
        referrerPolicy: { policy: 'same-origin' },
        noSniff: true,
        xssFilter: true,
        hidePoweredBy: true,
    }));

    // Remove Express fingerprinting
    app.getHttpAdapter().getInstance().disable('x-powered-by');
}
```

```bash
npm install helmet
```

**Fix — nginx.conf:**
```nginx
server {
    listen 443 ssl http2;
    server_name api.mysite.com;

    # SSL configuration
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "same-origin";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";
    add_header Content-Security-Policy "default-src 'self'";

    # Hide nginx version
    server_tokens off;

    # Rate limiting zone
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/s;

    location /api {
        limit_req zone=api_limit burst=50 nodelay;
        proxy_pass http://api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.mysite.com;
    return 301 https://$server_name$request_uri;
}
```

---

### FINDING 15 (HIGH): Weak Password Reset Token Validation

**Vulnerability:**
`resetPassword()` loads ALL users and iterates through them to find matching token. This is a performance and information leak issue.

**Fix — Better approach: Use direct lookup:**
```typescript
async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;

    // Store token hash in a dedicated table or add index on resetToken
    const user = await this.userService.findByResetTokenHash(
        await this.userService.hashPassword(token)
    );

    if (!user) {
        throw new BadRequestException('Invalid or expired reset token');
    }
    if (user.resetTokenExpiry && new Date() > user.resetTokenExpiry) {
        await this.userService.update(user.id, { resetToken: null, resetTokenExpiry: null });
        throw new BadRequestException('Reset token has expired');
    }

    const hashedPassword = await this.userService.hashPassword(password);
    await this.userService.updatePassword(user.id, hashedPassword);
    await this.userService.update(user.id, { resetToken: null, resetTokenExpiry: null });
    return { message: 'Password reset successful' };
}
```

---

### FINDING 16 (MEDIUM): No CSRF Protection

Since this is an API-first app using Bearer tokens (not cookies for auth), CSRF through cookies is not the primary attack vector. However, if cookies are ever used, implement CSRF tokens.

**For now, ensure SameSite is configured on any cookies:**
```typescript
// If using cookies for refresh tokens:
response.cookie('refreshToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

---

### FINDING 17 (MEDIUM): File Upload Path Traversal

**Vulnerability:**
`upload.config.ts` uses `extname(file.originalname)` which could contain `../../../etc/passwd`.

**Fix:**
```typescript
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';

const createUploadConfig = (destination: string, maxSize: number, allowedMimes: RegExp) => ({
    storage: diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = join(__dirname, '..', '..', destination);
            if (!existsSync(uploadPath)) {
                mkSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const ext = extname(file.originalname).toLowerCase();
            // Validate extension
            const allowedExts = ['.jpg', '.jpeg', '.png', '.pdf'];
            if (!allowedExts.includes(ext)) {
                return cb(new Error('Invalid file extension'), null as any);
            }
            // Generate safe filename — no original name used
            const safeName = `${randomUUID()}${ext}`;
            cb(null, safeName);
        },
    }),
    limits: { fileSize: maxSize },
    fileFilter: (req, file, cb) => {
        if (!allowedMimes.test(file.mimetype)) {
            return cb(new Error('Invalid file type'), false);
        }
        cb(null, true);
    },
});

export const avatarUploadConfig = createUploadConfig(
    './uploads/avatars',
    5 * 1024 * 1024,
    /^(image\/jpeg|image\/png|image\/jpg)$/
);

export const cvUploadConfig = createUploadConfig(
    './uploads/cvs',
    10 * 1024 * 1024,
    /^application\/pdf$/
);
```

---

### FINDING 18 (MEDIUM): Auth Token Stored as Plaintext

**Fix — auth-token.entity.ts:**
```typescript
@Entity('auth_tokens')
export class AuthToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column() // Store hash of access token
    tokenHash: string;

    @Column({ nullable: true }) // Store hash of refresh token
    refreshTokenHash: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
```

---

### FINDING 19 (MEDIUM): `forbidNonWhitelisted: false`

**Fix:**
```typescript
app.useGlobalPipes(
    new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,  // Reject unknown fields
        transform: true,
    }),
);
```

---

### FINDING 20 (MEDIUM): Weak Password Policy

**Fix — register.dto.ts:**
```typescript
@IsString()
@IsNotEmpty()
@MinLength(12)
@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
})
password: string;
```

---

## E. OWASP Mapping

### OWASP Top 10 (2021)
| Category | Issue # | Status |
|----------|---------|--------|
| A01:2021 — Broken Access Control | 4, 8, 11, 12, 13 | ❌ Open |
| A02:2021 — Cryptographic Failures | 1, 2, 3, 5, 18, 20 | ❌ Open |
| A03:2021 — Injection | None (TypeORM parameterized) | ✅ Safe |
| A04:2021 — Insecure Design | 7, 10, 15, 19 | ❌ Open |
| A05:2021 — Security Misconfiguration | 6, 9, 14, 17, 27, 28 | ❌ Open |
| A06:2021 — Vulnerable Components | — | ✅ Safe |
| A07:2021 — ID & Auth Failures | 1, 2, 3 | ❌ Open |
| A08:2021 — Software Integrity | — | ✅ Safe |
| A09:2021 — Logging Failures | 9, 21, 22 | ❌ Open |
| A10:2021 — SSRF | None | ✅ Safe |

### OWASP API Security Top 10 (2019)
| Category | Issue # | Status |
|----------|---------|--------|
| API1:2019 — BOLA (IDOR) | 11, 12, 13 | ❌ Open |
| API2:2019 — Broken Auth | 3, 5, 7, 15, 17 | ❌ Open |
| API3:2019 — Excessive Data Exposure | 4, 5, 9, 10 | ❌ Open |
| API4:2019 — Lack of Resources & Rate Limiting | 7, 15 | ❌ Open |
| API5:2019 — BFLA | 11, 12, 13 | ❌ Open |
| API6:2019 — Mass Assignment | 4, 19 | ❌ Open |
| API7:2019 — Security Misconfiguration | 6, 14, 17, 28 | ❌ Open |
| API8:2019 — Injection | None | ✅ Safe |
| API9:2019 — Improper Asset Management | — | ✅ |
| API10:2019 — Logging & Monitoring | 9 | ❌ Open |

---

## F. Security Score: 38/100

### Scoring Breakdown
| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Authentication | 20% | 20/100 | 4 |
| Authorization | 20% | 25/100 | 5 |
| Input Validation | 15% | 50/100 | 7.5 |
| Session Management | 15% | 15/100 | 2.25 |
| API Security | 10% | 30/100 | 3 |
| Infrastructure | 10% | 40/100 | 4 |
| Logging & Monitoring | 5% | 50/100 | 2.5 |
| File Upload Security | 5% | 60/100 | 3 |
| **TOTAL** | **100%** | | **38/100** |

### Grading
| Score | Grade |
|-------|-------|
| 90-100 | A — Secure |
| 70-89 | B — Mostly secure |
| 50-69 | C — Needs improvement |
| 30-49 | D — High risk (CURRENT) |
| 0-29 | F — Critical risk |

---

## G. Production Readiness Score: 25/100

**DO NOT DEPLOY TO PRODUCTION WITHOUT FIXING CRITICAL ISSUES.**

| Readiness Factor | Score | Notes |
|-----------------|-------|-------|
| Auth Security | 15/100 | Token revocation broken |
| API Security | 20/100 | No rate limiting, CORS open |
| Infrastructure | 30/100 | No HTTPS, no security headers |
| Code Quality | 40/100 | Several anti-patterns |
| Data Protection | 20/100 | PII logged, secrets in code |
| **Overall** | **25/100** | |

---

## H. Prioritized Remediation Roadmap

### Phase 1: Critical — Immediate (Week 1)

| Priority | Issue | Effort | Engineer |
|----------|-------|--------|----------|
| P0 | #1: Token revocation + blacklist | 4h | Backend |
| P0 | #3: JWT alg/aud/iss validation | 1h | Backend |
| P0 | #4: Mass assignment fix | 2h | Backend |
| P0 | #5: Don't return reset token | 1h | Backend |
| P0 | #6: `synchronize: false` in production | 1h | DevOps |
| P0 | #7: Implement rate limiting | 2h | Backend |
| P0 | #8: Lock down CORS | 1h | Backend |

### Phase 2: High — Short Term (Week 2)

| Priority | Issue | Effort | Engineer |
|----------|-------|--------|----------|
| P1 | #9-10: Fix logging + error handling | 2h | Backend |
| P1 | #11-13: Add ownership validation | 4h | Backend |
| P1 | #14: Security headers + HTTPS | 3h | DevOps |
| P1 | #2: Refresh token rotation | 3h | Backend |
| P1 | #15: Fix reset token lookup | 2h | Backend |
| P1 | #19: Enable forbidNonWhitelisted | 1h | Backend |

### Phase 3: Medium — Medium Term (Week 3)

| Priority | Issue | Effort | Engineer |
|----------|-------|--------|----------|
| P2 | #16: CSRF protection | 2h | Backend |
| P2 | #17: File upload hardening | 2h | Backend |
| P2 | #18: Hash tokens in DB | 3h | Backend |
| P2 | #20: Stronger password policy | 1h | Backend |

### Phase 4: Low — Long Term

| Priority | Issue | Effort | Engineer |
|----------|-------|--------|----------|
| P3 | #27-28: Server info disclosure | 1h | DevOps |
| P3 | #30: Add more audit logging | 3h | Backend |
| P3 | Rate limiting per-IP | 2h | DevOps |

---

## I. Critical Fixes Required Before Production

The following **10 fixes are MANDATORY** before any production deployment:

1. **Token blacklist system** — Implement `TokenBlacklist` entity and check every request
2. **JWT validation** — Enforce `algorithms`, `issuer`, and `audience`
3. **Remove mass assignment** — Remove `role` and `isActive` from user-facing DTOs
4. **Stop returning reset/verification tokens** — Never expose tokens in API responses
5. **Disable `synchronize`** — Use migrations instead of auto-sync
6. **Install rate limiting** — `@nestjs/throttler` with strict limits on auth endpoints
7. **Restrict CORS** — Only allow known frontend origins
8. **Fix password reset token lookup** — Use direct DB query, not in-memory iteration
9. **Add security headers** — Use `helmet` middleware
10. **HTTPS-only** — Nginx should redirect all HTTP to HTTPS

---

## J. Security Checklist (Post-Fix Verification)

- [ ] Authentication required on all endpoints except `@Public()`
- [ ] JWT `alg`, `iss`, `aud`, `exp` all validated
- [ ] Token blacklist checked on every authenticated request
- [ ] Refresh token rotation implemented
- [ ] Logout invalidates all tokens
- [ ] Rate limiting active on auth endpoints (5/min login, 3/min register)
- [ ] CORS restricted to known origins
- [ ] `forbidNonWhitelisted: true` enabled
- [ ] `synchronize: false` in production
- [ ] Security headers present (CSP, HSTS, XFO, etc.)
- [ ] HTTPS enforced (certificate configured)
- [ ] Error messages generic (no stack traces)
- [ ] PII not logged
- [ ] Upload files validated (type, size, renamed)
- [ ] Password min 12 chars with complexity
- [ ] bcrypt/Argon2 used for password hashing
- [ ] No default/fallback secrets
- [ ] Ownership checks on all resource endpoints
- [ ] Role field not user-modifiable
- [ ] Account lockout after 5 failed attempts
- [ ] Nginx version hidden
- [ ] X-Powered-By header removed
- [ ] Tokens hashed before database storage
- [ ] Password reset token single-use
- [ ] Verification token single-use
