# 📋 Missing Tasks — From Requirement PDF vs Current Project

## Priority: HIGH — Must Have for MVP

### 1. Email Verification System — Person A
- [ ] Add `isEmailVerified` column to User entity (boolean, default false)
- [ ] Add `emailVerificationToken` column to User entity (nullable)
- [ ] Add `emailVerifiedAt` column to User entity (nullable)
- [ ] Create `POST /api/auth/verify-email?token=...` endpoint (public)
- [ ] Create `POST /api/auth/resend-verification` endpoint (public)
- [ ] Add `EmailVerifiedGuard` — blocks sensitive endpoints if email unverified
- [ ] Generate verification token on register
- [ ] Log `USER_REGISTERED` activity on registration

### 2. Account Lockout System — Person B
- [ ] Add `failedLoginCount` column to User entity (int, default 0)
- [ ] Add `lockedUntil` column to User entity (timestamp, nullable)
- [ ] Implement lockout logic in AuthService.login() — increment on fail, reset on success
- [ ] Return HTTP 423 Locked when account is locked
- [ ] Auto-lock after 5 failed attempts within 15 minutes

### 3. 3-Dimension Feedback System — Person C
- [ ] Update Feedback entity: replace single `rating` with:
  - `ratingKnowledge` (int, 1-5)
  - `ratingCommunication` (int, 1-5)
  - `ratingHelpfulness` (int, 1-5)
  - `overallRating` (decimal, computed mean)
  - `mentorResponse` (text, nullable)
- [ ] Update CreateFeedbackDto with 3 rating fields
- [ ] Add `overallRating` calculation in FeedbackService
- [ ] Add `respondToFeedback()` endpoint — mentor only
- [ ] Update mentor rating aggregation to use overallRating

### 4. Session Request Table — Person A
- [ ] Create `session_requests` entity with:
  - `sessionId` (FK, unique)
  - `message` (text, nullable)
  - `requestStatus` (enum: PENDING/APPROVED/DECLINED)
  - `respondedAt` (timestamp, nullable)
- [ ] Create SessionRequest repository
- [ ] Create SessionRequest on session creation
- [ ] Update SessionRequest status when mentor approves/declines
- [ ] Store `cancellationReason` on Session entity (add column)

### 5. Session Status Alignment — Person B
- [ ] Update SessionStatus enum to: PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW
- [ ] Add status transition validation (PENDING → CONFIRMED, CONFIRMED → COMPLETED, etc.)
- [ ] Add `completedAt` column to Session entity

### 6. Mentor Profile Enhancements — Person A
- [ ] Replace `isAvailable` (boolean) with `availabilityStatus` (enum: AVAILABLE/BUSY/UNAVAILABLE)
- [ ] Add `profileCompleteness` column (int, 0-100)
- [ ] Implement profile completeness calculation logic
- [ ] Add `PATCH /api/mentors/me/availability` endpoint (mentor only)

### 7. Mentee Profile Enhancements — Person A
- [ ] Replace `occupation` with `currentLevel` (enum: BEGINNER/INTERMEDIATE/ADVANCED)
- [ ] Replace `goals` with `careerGoal` (text)
- [ ] Add `profileCompleteness` column (int, 0-100)

### 8. Soft Delete for Users — Person B
- [ ] Add `deletedAt` column to User entity (timestamp, nullable)
- [ ] Update all user queries to exclude soft-deleted records
- [ ] Implement soft delete in UserRepository

### 9. Mentor Top Lists — Person A
- [ ] Add top 5 mentors by rating to admin dashboard
- [ ] Add top 5 mentors by total sessions to admin dashboard
- [ ] Add most requested skills to admin dashboard

---

## Priority: MEDIUM — Post-MVP

### 10. Pagination for All List Endpoints — Person C
- [ ] Create pagination interceptor
- [ ] Add `meta` object to all list responses: totalItems, itemCount, itemsPerPage, totalPages, currentPage
- [ ] Implement pagination on: /mentors, /mentees, /sessions, /feedback, /notifications, /activity-logs, /admin/users, /admin/mentors, /admin/mentees

### 11. Rate Limiting — Person C
- [ ] Install `@nestjs/throttler`
- [ ] Configure global rate limit: 100 requests/minute
- [ ] Configure auth rate limit: 10 requests/minute on /auth/register and /auth/login

### 12. Swagger/OpenAPI Documentation — Person C
- [ ] Install `@nestjs/swagger`
- [ ] Configure Swagger at `/api/docs`
- [ ] Add API tags and descriptions to all controllers
- [ ] Add response models for all endpoints

### 13. Refresh Token in HTTP-Only Cookie — Person C
- [ ] Return refresh token in HTTP-only, SameSite=Strict cookie instead of response body
- [ ] Update AuthService.login() to set cookie
- [ ] Update AuthService.refreshToken() to read from cookie

### 14. Full-Text Search & Sorting — Person C
- [ ] Add search query param to: /mentors, /mentees, /sessions
- [ ] Add sortBy query param to list endpoints
- [ ] Implement search in repositories (ILIKE/WHERE)

### 15. Activity Log Enhancements — Person C
- [ ] Add `ipAddress` column to ActivityLog entity
- [ ] Capture client IP from request in all log calls
- [ ] Add more activity types as needed

### 16. API Response Standard — Person C
- [ ] Verify TransformInterceptor wraps all responses in { success, data, message }
- [ ] Verify AllExceptionsFilter returns { success, statusCode, error, message, timestamp, path }
- [ ] Change API prefix from `/api` to `/api/v1`

### 17. Docker & Deployment — Person C
- [ ] Create multi-stage Dockerfile
- [ ] Create docker-compose.yml (API + MySQL + Nginx)
- [ ] Create Nginx config (SSL, rate limiting, reverse proxy)
- [ ] Add health check endpoint: GET /api/v1/health

### 18. Match Score Calculation — Person C
- [ ] Implement calculateMatchScore(): Skill Match (50%) + Rating (30%) + Availability (20%)
- [ ] Create GET /api/matching/recommended-mentors endpoint (mentee only)
- [ ] Return mentors sorted by match score descending with pagination

---

## Summary by Person

| Person | HIGH | MEDIUM | LOW | Total |
|--------|------|--------|-----|-------|
| **A (Nita)** | 20 | 0 | 0 | 20 |
| **B (Trea)** | 12 | 0 | 0 | 12 |
| **C (Vichet)** | 10 | 30 | 0 | 40 |
