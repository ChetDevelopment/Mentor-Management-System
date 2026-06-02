# Person A (Nita) — Missing Tasks

## Priority: CRITICAL — Original Tasks Not Completed

### 1. Message/Chat Module (with Person B)
- [ ] Create entities/message.entity.ts
- [ ] Add senderId, receiverId, content, isRead, readAt columns
- [ ] Create message.repository.ts with findConversation(), create(), markAsRead()
- [ ] Create dto/message/index.ts with validations

### 2. Matching Algorithm
- [ ] Implement calculateMatchScore(): Skill Match (50%) + Rating (30%) + Availability (20%)
- [ ] Create getRecommendedMentors() method
- [ ] Add filtering by skill
- [ ] Add sorting by score descending
- [ ] Test matching algorithm with seeded data

### 3. Admin Dashboard Stats
- [ ] Add getDashboardStats() method to admin.service.ts
- [ ] Add totalUsers, totalMentors, totalMentees counts
- [ ] Add activeSessions count
- [ ] Add sessionsByStatus breakdown
- [ ] Add completionRate calculation
- [ ] Add averagePlatformRating
- [ ] Add top 5 mentors by rating, total sessions
- [ ] Add most requested skills
- [ ] Add pending mentor approval count

### 4. Seed Data Script
- [ ] Create seed/seed.ts file
- [ ] Seed 1 admin user, 4 mentors, 3 mentees
- [ ] Seed 10 skills across categories
- [ ] Seed availability, sessions, feedback
- [ ] Add seed script to package.json
- [ ] Test: npm run seed

## Priority: HIGH — New Requirement Gaps

### 5. Email Verification System
- [ ] Add isEmailVerified, emailVerificationToken, emailVerifiedAt to User entity
- [ ] Create POST /api/auth/verify-email?token=... endpoint (public)
- [ ] Create POST /api/auth/resend-verification endpoint (public)
- [ ] Generate verification token on register

### 6. Session Request Table
- [ ] Create session_requests entity (sessionId, message, requestStatus, respondedAt)
- [ ] Create SessionRequest repository
- [ ] Create SessionRequest on session creation
- [ ] Update SessionRequest status when mentor approves/declines

### 7. Mentor Profile Enhancements
- [ ] Replace isAvailable with availabilityStatus (AVAILABLE/BUSY/UNAVAILABLE)
- [ ] Add profileCompleteness column (int, 0-100)
- [ ] Implement profile completeness calculation logic

### 8. Mentee Profile Enhancements
- [ ] Replace occupation with currentLevel (BEGINNER/INTERMEDIATE/ADVANCED)
- [ ] Replace goals with careerGoal (text)
- [ ] Add profileCompleteness column (int, 0-100)

### 9. Mentor Top Lists
- [ ] Add top 5 mentors by rating to admin dashboard
- [ ] Add top 5 mentors by total sessions
- [ ] Add most requested skills
