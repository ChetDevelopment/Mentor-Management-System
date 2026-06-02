# Person C (Vichet) — Missing Tasks

## Priority: CRITICAL — Original Tasks Not Completed

### 1. Report Module
- [ ] Create entities/report.entity.ts (reporterId, reportedId, reason, description, status, adminNote)
- [ ] Create report.repository.ts with findAll(), findById(), create(), update()
- [ ] Create report.service.ts with fileReport(), getReports(), handleReport(), dismissReport()
- [ ] Add @Get('reports'), @Put('reports/:id') to admin.controller.ts
- [ ] Test report flow in Postman

## Priority: HIGH — New Requirement Gaps

### 2. 3-Dimension Feedback System
- [ ] Update Feedback entity: replace rating with ratingKnowledge, ratingCommunication, ratingHelpfulness, overallRating, mentorResponse
- [ ] Update CreateFeedbackDto with 3 rating fields
- [ ] Add overallRating calculation in FeedbackService
- [ ] Add respondToFeedback() endpoint — mentor only
- [ ] Update mentor rating aggregation

### 3. Pagination for All List Endpoints
- [ ] Create pagination interceptor
- [ ] Add meta object to all list responses
- [ ] Implement pagination on all list endpoints

### 4. Rate Limiting
- [ ] Install @nestjs/throttler
- [ ] Configure global: 100 requests/minute
- [ ] Configure auth: 10 requests/minute on /auth/register and /auth/login

### 5. Swagger/OpenAPI Documentation
- [ ] Install @nestjs/swagger
- [ ] Configure Swagger at /api/docs
- [ ] Add API tags and descriptions to all controllers
- [ ] Add response models for all endpoints

### 6. Refresh Token in HTTP-Only Cookie
- [ ] Return refresh token in HTTP-only, SameSite=Strict cookie
- [ ] Update AuthService.login() to set cookie
- [ ] Update AuthService.refreshToken() to read from cookie

### 7. Full-Text Search & Sorting
- [ ] Add search query param to: /mentors, /mentees, /sessions
- [ ] Add sortBy query param to list endpoints
- [ ] Implement search in repositories

### 8. Activity Log Enhancements
- [ ] Add ipAddress column to ActivityLog entity
- [ ] Capture client IP from request in all log calls
- [ ] Add more activity types as needed

### 9. API Response Standard
- [ ] Verify TransformInterceptor wraps all responses in { success, data, message }
- [ ] Verify AllExceptionsFilter returns { success, statusCode, error, message, timestamp, path }
- [ ] Change API prefix from /api to /api/v1

### 10. Docker & Deployment
- [ ] Create multi-stage Dockerfile
- [ ] Create docker-compose.yml (API + MySQL + Nginx)
- [ ] Create Nginx config (SSL, rate limiting, reverse proxy)
- [ ] Add health check endpoint: GET /api/v1/health

### 11. Match Score Calculation
- [ ] Implement calculateMatchScore(): Skill Match (50%) + Rating (30%) + Availability (20%)
- [ ] Create GET /api/matching/recommended-mentors endpoint (mentee only)
- [ ] Return mentors sorted by match score descending with pagination
