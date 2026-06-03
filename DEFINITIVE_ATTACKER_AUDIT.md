# Definitive Attacker-Mindset Security Audit

**Date:** 2026-06-02
**Methodology:** Assume breach, verify nothing, attack everything
**Auditor Mindset:** Professional red team operator targeting public-internet application

---

## ONE-SENTENCE VERDICT

**The application will crash on startup in production because `@nestjs/throttler` and `helmet` were added to import statements but never installed.**

---

## EXECUTIVE SUMMARY

| Metric | Claimed | Actual |
|--------|---------|--------|
| Security Score | 99/100 | **28/100** |
| Production Ready | Yes | **NO — CRASHES ON STARTUP** |
| Rate Limiting | Present | **NON-EXISTENT** — package not installed |
| Security Headers | Helmet configured | **NON-EXISTENT** — package not installed |
| Token Blacklist | Functional | **BROKEN** — inverted query + missing package |
| OWASP Compliance | 100% | **~40%** |

---

## PHASE 1: ASSUMPTION-BREAKING CONTROL VERIFICATION

### AUTH GUARD
**✔ PASS** — Global `APP_GUARD` with `AuthGuard` in `app.module.ts:66-68`. JWT validated with `algorithms: ['HS256']`, `issuer`, `audience` in `auth.guard.ts:36-39`. Token blacklist check on every request at `auth.guard.ts:49-52`.

**BUT** — The blacklist query is inverted (see below), so the check is useless.

### ROLES GUARD
**✔ PASS** — `RolesGuard` at `roles.guard.ts`. Checks `user.role` from JWT payload against `@Roles()` metadata. Consistent pattern across all controllers.

### TOKEN BLACKLIST
**✖ FAIL** — `blacklist.repository.ts:26` uses `LessThan(new Date())` instead of `MoreThan(new Date())`. **All revoked tokens are accepted.**

Additionally, `auth.repository.ts:53` uses MongoDB syntax `$lt` instead of TypeORM `LessThan`, which will throw a runtime error.

### RATE LIMITING
**✖ FAIL** — `@nestjs/throttler` is:

| Check | Result | Evidence |
|-------|--------|----------|
| In package.json? | ❌ NO | Not in `dependencies` or `devDependencies` |
| In node_modules? | ❌ NO | `node_modules/@nestjs/throttler` does not exist |
| Imported in code? | ✅ YES | `app.module.ts:3` imports `ThrottlerModule` |
| Will it crash? | ✅ YES | `Error: Cannot find module '@nestjs/throttler'` |

**The application cannot start. All rate limiting claims are false.**

### SECURITY HEADERS (HELMET)
**✖ FAIL** — `helmet` is:

| Check | Result | Evidence |
|-------|--------|----------|
| In package.json? | ❌ NO | Not in `dependencies` or `devDependencies` |
| In node_modules? | ❌ NO | `node_modules/helmet` does not exist |
| Imported in code? | ✅ YES | `main.ts:5` imports `helmet` |
| Will it crash? | ✅ YES | `Error: Cannot find module 'helmet'` |

**The application cannot start. All security header claims are false.**

### VALIDATION PIPE
**✔ PASS** — `main.ts:67-77` configures `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, `forbidUnknownValues: true`. This is correctly applied globally.

### CORS RESTRICTION
**✔ PASS** — `main.ts:83-95` reads `CORS_ORIGINS` from env, restricts methods and headers.

### SESSION MANAGEMENT
**⚠ PARTIAL** — `session-management.repository.ts` creates sessions with device tracking. But:
- `revokeAllUserSessions()` uses MongoDB `$ne` syntax (`session-management.repository.ts:68`) — will crash when `exceptSessionId` is provided
- No session limit enforcement

### LOGGING SANITIZATION
**⚠ PARTIAL** — `AuditLogger.sanitize()` redacts sensitive fields. BUT:
- `writeToAuditStore()` is empty (`audit.logger.ts:73-76`) — logs only go to console
- 10 of 20 audit events are never emitted (dead enum values)

### FILE UPLOAD VALIDATION
**✔ PASS** — `upload.config.ts` validates MIME type, file extension, uses UUID rename, limits size.

---

## PHASE 2: HIDDEN VULNERABILITY HUNT

### V1: Application Won't Start (CRITICAL — SEVERITY 10/10)

**Type:** Missing dependencies
**Attack Scenario:** None needed — `npm ci && npm run start:prod` immediately fails
**Root Cause:** `@nestjs/throttler` and `helmet` were added to TypeScript import statements in multiple files but `npm install` was never executed. `package.json` was never updated.
**Impact:** Zero availability. Complete denial of service.
**Fix:** `npm install @nestjs/throttler helmet --save`

### V2: Token Blacklist Inverted (CRITICAL — SEVERITY 9/10)

**Type:** Authentication bypass
**Evidence:** `blacklist.repository.ts:26` — `LessThan(new Date())`
**Attack Scenario:**
1. Victim logs in → gets JWT valid 15 min
2. Attacker steals JWT (via any means)
3. Victim logs out → blacklist entry created with `expiresAt = now + 15m`
4. Attacker uses token → `isBlacklisted()` checks `expiresAt < now()` → `false` (15m > 0m) → returns `false` → **TOKEN ACCEPTED**
5. Attacker has full access until JWT expires naturally in 15 minutes
**Fix:** Change `LessThan` to `MoreThan`

### V3: User Enumeration via Resend Verification (HIGH — SEVERITY 7/10)

**Type:** Information disclosure
**Evidence:** `auth.service.ts:283-284`
```typescript
const user = await this.userService.findByEmail(email);
if (!user) throw new BadRequestException('Email not found');
```
**Attack Scenario:**
1. Attacker iterates through email list
2. Unregistered emails → HTTP 400 "Email not found"
3. Registered emails → HTTP 201 (no error, continues to check verified status)
4. Attacker builds email-to-user database
**Fix:** Return generic message like `forgotPassword` does

### V4: MongoDB Syntax in TypeORM (HIGH — SEVERITY 7/10)

**Type:** Runtime crash / Logic error
**Evidence (two locations):**
- `auth.repository.ts:53`: `expiresAt: { $lt: new Date() }` — should be `LessThan(new Date())`
- `session-management.repository.ts:68`: `where.id = { $ne: exceptSessionId }` — should use TypeORM `Not()`
**Attack Scenario:** Calling `removeExpired()` or `logout(sessionId)` throws unhandled exception → HTTP 500. If an attacker can trigger these code paths, they can cause denial of service.
**Fix:** Replace MongoDB `$lt` → `LessThan`, `$ne` → `Not(exceptSessionId)`

### V5: Weak Password Reset DTO (MEDIUM — SEVERITY 5/10)

**Type:** Weak password policy
**Evidence:** `reset-password.dto.ts:10` — `@MinLength(6)` while registration requires `@MinLength(12)`
**Attack Scenario:** Attacker with a valid password reset token can set a 6-character password, then brute-force it.
**Fix:** Match registration: `@MinLength(12)` with `@Matches(...complexity...)`

### V6: No Rate Limiting on Verify Email (MEDIUM — SEVERITY 5/10)

**Type:** Brute force
**Evidence:** No `@Throttle()` decorator on `verifyEmail()` in `auth.controller.ts:61-63`
**Attack Scenario:** Attacker can brute-force email verification tokens at up to 100 req/sec (global limit only). If token space is insufficient, they can verify any email.
**Fix:** Add `@Throttle({ default: { limit: 10, ttl: 60000 } })`

### V7: No Persistent Audit Trail (MEDIUM — SEVERITY 4/10)

**Type:** Forensics evasion
**Evidence:** `audit.logger.ts:73-76` — `writeToAuditStore()` is an empty TODO
**Attack Scenario:** After compromising the system, attacker performs malicious actions. Audit events are logged to console only → lost on container restart → no forensic evidence.
**Fix:** Implement actual audit persistence (database table or file)

### V8: Dead Audit Events (LOW — SEVERITY 3/10)

**Type:** Incomplete coverage
**Evidence:** 10 of 20 `SecurityEvent` enum values are never emitted:
`TOKEN_REVOKED`, `PASSWORD_CHANGED`, `ACCOUNT_UNLOCKED`, `FORBIDDEN_ACCESS`, `UNAUTHORIZED_ACCESS`, `RATE_LIMIT_EXCEEDED`, `SESSION_EXPIRED`, `ROLE_CHANGED`, `USER_DELETED`, `USER_DEACTIVATED`
**Fix:** Add audit calls for all 10 missing events.

### V9: Database Falls Back to Root/Empty Password (MEDIUM — SEVERITY 5/10)

**Type:** Security misconfiguration
**Evidence:** `config/index.ts:10-11` — `username: process.env.DB_USERNAME || 'root'`, `password: process.env.DB_PASSWORD || ''`
**Impact:** If env vars aren't set, connects as MySQL root with no password.
**Fix:** Remove fallbacks — fail hard:
```typescript
if (!process.env.DB_PASSWORD) throw new Error('DB_PASSWORD is required');
```

### V10: JWT Secret Can Be Undefined (HIGH — SEVERITY 7/10)

**Type:** Authentication bypass
**Evidence:** `config/index.ts:16` — `secret: process.env.JWT_SECRET` (no fallback)
**Impact:** If `JWT_SECRET` is not set, `jwtConfig.secret` is `undefined`. The JwtModule will use `undefined` as the secret. With `algorithms: ['HS256']`, the module will either crash or accept tokens signed with `undefined` as the key — which is trivially forgeable.
**Fix:** Add startup validation:
```typescript
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required');
```

### V11: No Session Limit (LOW — SEVERITY 3/10)

**Type:** Resource exhaustion
**Evidence:** No `MAX_SESSIONS_PER_USER` enforcement in `storeSession()`
**Attack:** Attacker with valid credentials creates 10,000 sessions → fills database.
**Fix:** Limit active sessions per user.

### V12: Container Runs with Full Write Access (LOW — SEVERITY 3/10)

**Type:** Container escape risk
**Evidence:** Dockerfile `COPY` commands copy source code, and while `appuser` is used, there's no `readOnlyRootFilesystem: true`.
**Fix:** Add `readOnlyRootFilesystem: true` and tmpfs for writable directories.

---

## PHASE 3: ZERO TRUST VALIDATION

| Zero Trust Pillar | Score | Issues |
|-------------------|-------|--------|
| Never trust network | **6/10** | Internal services not isolated, no mTLS |
| Always verify identity | **4/10** | Blacklist broken = identity not verified after logout |
| Least privilege | **7/10** | Roles enforced but DB fallback to root |
| Continuous verification | **3/10** | No session re-validation, no IP anomaly detection |

**Verdict:** The system does NOT meet Zero Trust standards. The broken blacklist means identity claims are not continuously verified.

---

## PHASE 4: REALISTIC SECURITY SCORE

| Category | Claimed | Actual | Critical Issues |
|----------|---------|--------|-----------------|
| Authentication | 10/10 | **4/10** | Rate limiting non-functional (package missing), blacklist broken, JWT can be undefined |
| Authorization | 10/10 | **7/10** | Roles/ownership OK, but relies on auth that doesn't work |
| Session Security | 10/10 | **3/10** | Blacklist broken, MongoDB syntax crashes, no limit |
| API Security | 10/10 | **5/10** | Rate limiting non-functional, missing verify-email protection |
| Infrastructure | 10/10 | **4/10** | Two critical dependencies missing, DB root fallback, no persistent audit |
| Logging | 10/10 | **3/10** | Audit store is TODO, half the events never emitted |
| **OVERALL** | **99/100** | **28/100** | Application crashes on startup in production |

### Score Calculation

**Starting score: 100**
- Rate limiting missing (package not installed): **-20** (ALL rate limit claims are false)
- Helmet missing (package not installed): **-15** (ALL header claims are false)
- Blacklist inverted: **-12** (token revocation doesn't work)
- MongoDB syntax errors: **-8** (runtime crashes)
- User enumeration: **-4**
- Weak password reset: **-2**
- DB root fallback: **-4**
- JWT undefined secret: **-4**
- No persistent audit: **-3**
- **Final: 28/100**

---

## PHASE 5: FINAL DECISION

### Q1: Is the system truly production-ready?
**NO.** The application will crash on startup because `@nestjs/throttler` and `helmet` are imported but never installed. Additionally, the token blacklist does not work, meaning even if it started, all token revocation claims are false.

### Q2: Does it truly deserve 99/100?
**NO.** The real score is **28/100**.

### Q3: What is the REAL score?
**28/100** — Grade F. Critical risk.

### Q4: What are the TOP 5 remaining risks?

| Rank | Risk | Severity | Effort to Fix |
|------|------|----------|---------------|
| **1** | `@nestjs/throttler` and `helmet` not installed — app crashes on startup | **CRITICAL** | 2 minutes (`npm install`) |
| **2** | Token blacklist uses `LessThan` instead of `MoreThan` — revoked tokens accepted | **CRITICAL** | 1 minute (change one word) |
| **3** | MongoDB syntax `$lt`/`$ne` in TypeORM queries — runtime crashes | **HIGH** | 5 minutes |
| **4** | `JWT_SECRET` can be `undefined` — trivially forgeable tokens | **HIGH** | 5 minutes (add validation) |
| **5** | User enumeration via `resendVerification` | **HIGH** | 2 minutes |

---

## EMERGENCY REMEDIATION

The following **4 changes fix all Critical issues** and bring the score from 28 to ~65:

### Fix 1: Install missing packages
```bash
npm install @nestjs/throttler helmet --save
```

### Fix 2: Fix blacklist query
```typescript
// blacklist.repository.ts:26 — Change LessThan to MoreThan
where: { tokenHash, expiresAt: MoreThan(new Date()) as any },
```

### Fix 3: Fix MongoDB syntax (two locations)
```typescript
// auth.repository.ts:53
import { LessThan } from 'typeorm';
expiresAt: LessThan(new Date()),
// NOT: expiresAt: { $lt: new Date() }

// session-management.repository.ts:68
import { Not } from 'typeorm';
where.id = Not(exceptSessionId);
// NOT: where.id = { $ne: exceptSessionId }
```

### Fix 4: Add JWT_SECRET validation
```typescript
// config/index.ts or main.ts
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}
```

---

## FINAL WORD

**The previous security reports contain claims that are factually incorrect because the code they describe cannot run.** Two packages (`@nestjs/throttler`, `helmet`) were added to TypeScript imports but never installed, meaning:

1. **Every claim about rate limiting is false** — the app has zero rate limiting
2. **Every claim about security headers is false** — the app has zero security headers
3. **The application cannot start** — it crashes with `MODULE_NOT_FOUND`

Combined with the inverted blacklist query and MongoDB syntax errors, the system has a true security score of **28/100**, not 99/100.

The code structure and architecture are fundamentally sound. The issues found are simple implementation bugs — missing npm install, inverted comparison, wrong ORM syntax. These are easy to fix but catastrophic when left unfired.
