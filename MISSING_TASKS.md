# 📋 Complete Missing Tasks — Original Incomplete + New Requirement Gaps

## Priority: CRITICAL — Original Tasks Not Completed

### 1. Message/Chat Module — Person A + B
- [ ] Create entities/message.entity.ts (Person A)
- [ ] Add senderId, receiverId, content, isRead, readAt columns (Person A)
- [ ] Create message.repository.ts with findConversation(), create(), markAsRead() (Person A)
- [ ] Create dto/message/index.ts with validations (Person A)
- [ ] Create message.service.ts with sendMessage(), getConversation(), getConversationList() (Person B)
- [ ] Create message.controller.ts with @Post(), @Get('conversations'), @Get(':userId'), @Put(':id/read') (Person B)
- [ ] Test all chat endpoints in Postman (Person B)

### 2. Report Module — Person C
- [ ] Create entities/report.entity.ts with reporterId, reportedId, reason, description, status, adminNote
- [ ] Create report.repository.ts with findAll(), findById(), create(), update()
- [ ] Create report.service.ts with fileReport(), getReports(), handleReport(), dismissReport()
- [ ] Add @Get('reports'), @Put('reports/:id') to admin.controller.ts
- [ ] Test report flow in Postman

### 3. Matching Algorithm — Person A
- [ ] Implement calculateMatchScore(): Skill Match (50%) + Rating (30%) + Availability (20%)
- [ ] Create getRecommendedMentors() method
- [ ] Add filtering by skill
- [ ] Add sorting by score descending
- [ ] Create @Get('recommended') endpoint — mentee only
- [ ] Test matching algorithm with seeded data

### 4. Admin Dashboard Stats — Person A
- [ ] Add getDashboardStats() method to admin.service.ts
- [ ] Add totalUsers, totalMentors, totalMentees counts
- [ ] Add activeSessions count
- [ ] Add sessionsByStatus breakdown
- [ ] Add completionRate calculation
- [ ] Add averagePlatformRating
- [ ] Add top 5 mentors by rating
- [ ] Add top 5 mentors by total sessions
- [ ] Add most requested skills
- [ ] Add pending mentor approval count

### 5. Availability Service — Person B
- [ ] Create services/availability/availability.service.ts
- [ ] Add getAvailability() method
- [ ] Add setSchedule() method
- [ ] Add updateSchedule() method
- [ ] Add blockDate() method
- [ ] Add unblockDate() method
- [ ] Add getAvailableSlots() — return open slots for a given date
- [ ] Create dto/availability/index.ts with validations
- [ ] Wire controller to service

### 6. Seed Data Script — Person A
- [ ] Create seed/seed.ts file
- [ ] Seed 1 admin user
- [ ] Seed 3 approved mentor users with full profiles
- [ ] Seed 1 pending mentor (for approval testing)
- [ ] Seed 3 mentee users
- [ ] Seed 10 skills across 4 categories
- [ ] Seed availability for each mentor
- [ ] Seed sample sessions in various statuses
- [ ] Seed sample feedback with ratings
- [ ] Add seed script to package.json
- [ ] Test: npm run seed and verify database

### 7. Full Flow Testing — Person B
- [ ] Test: Register mentor → pending → admin approves
- [ ] Test: Mentee registers → browses mentors → books session
- [ ] Test: Mentor accepts → session completes → feedback submitted
- [ ] Test: Mentor rating recalculates after feedback
- [ ] Test: Mentee files report → admin handles
- [ ] Test: Forgot password → reset password
- [ ] Test: Matching algorithm returns ranked mentors
- [ ] Test: Admin dashboard stats are accurate
- [ ] Fix all critical bugs found

---

## Priority: HIGH — New Requirement Gaps

### 8. Email Verification System — Person A
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

| Person | CRITICAL (Original) | HIGH (New) | MEDIUM | Total |
|--------|-------------------|-----------|--------|-------|
| **A (Nita)** | 28 | 10 | 0 | 38 |
| **B (Trea)** | 18 | 7 | 0 | 25 |
| **C (Vichet)** | 5 | 10 | 30 | 45 |
