# 📋 Mentor Management System — Master Task List

## 🗓️ DAY 4: User Module (~480 mins)
### Person A: User Repository & Service (190 mins)
- [ ] 4.1 Create repositories/user folder
- [ ] 4.2 Create user.repository.ts file
- [ ] 4.3 Add findAll() method
- [ ] 4.4 Add findById() method
- [ ] 4.5 Add findByEmail() method
- [ ] 4.6 Add update() method
- [ ] 4.7 Add delete() method
- [ ] 4.8 Create services/user folder
- [ ] 4.9 Create user.service.ts file
- [ ] 4.10 Add findAll() method
- [ ] 4.11 Add findById() with NotFoundException
- [ ] 4.12 Add update() method
- [ ] 4.13 Add delete() method

### Person B: User Controller & DTOs (190 mins)
- [ ] 4.14 Create dto/user/update-user.dto.ts
- [ ] 4.15 Add firstName, lastName validations
- [ ] 4.16 Add phone, avatar validations
- [ ] 4.17 Create controllers/user folder
- [ ] 4.18 Create user.controller.ts file
- [ ] 4.19 Add @Controller('users') decorator
- [ ] 4.20 Add @UseGuards(AuthGuard)
- [ ] 4.21 Create @Get('profile') endpoint
- [ ] 4.22 Create @Put('profile') endpoint
- [ ] 4.23 Create @Get() endpoint — admin only
- [ ] 4.24 Create @Get(':id') endpoint — admin only
- [ ] 4.25 Create @Put(':id') endpoint — admin only
- [ ] 4.26 Create @Delete(':id') endpoint — admin only

### Person C: Testing & Integration (180 mins)
- [ ] 4.27 Test GET /users/profile with valid token
- [ ] 4.28 Test PUT /users/profile update fields
- [ ] 4.29 Test GET /users as admin
- [ ] 4.30 Test GET /users/:id as admin
- [ ] 4.31 Test PUT /users/:id as admin
- [ ] 4.32 Test DELETE /users/:id as admin
- [ ] 4.33 Fix any bugs found
- [ ] 4.34 Commit user module to Git

---

## 🗓️ DAY 5: Mentor Entity, Extended Fields & Approval (~480 mins)
### Person A: Mentor Entity & Extended Columns (190 mins)
- [ ] 5.1 Add NID column to Mentor entity
- [ ] 5.2 Add phone column to Mentor entity
- [ ] 5.3 Add avatar (profile photo URL) column
- [ ] 5.4 Add cvUrl (resume PDF URL) column
- [ ] 5.5 Add portfolioUrl column
- [ ] 5.6 Add shortDescription column (max 160 chars)
- [ ] 5.7 Add fullBio column (max 1000 chars)
- [ ] 5.8 Add status column — enum: pending/approved/rejected/suspended
- [ ] 5.9 Add rejectionReason column (nullable)
- [ ] 5.10 Add approvedAt column (nullable)
- [ ] 5.11 Create repositories/mentor folder
- [ ] 5.12 Create mentor.repository.ts
- [ ] 5.13 Add findAll() with user relation
- [ ] 5.14 Add findById() with user relation
- [ ] 5.15 Add findPending() — pending approvals only

### Person B: Mentor Service & Approval Logic (195 mins)
- [ ] 5.16 Add create() method to mentor.repository.ts
- [ ] 5.17 Add update() method to mentor.repository.ts
- [ ] 5.18 Add updateStatus() method to mentor.repository.ts
- [ ] 5.19 Create services/mentor folder
- [ ] 5.20 Create mentor.service.ts
- [ ] 5.21 Add findAll() with filters
- [ ] 5.22 Add findById() method
- [ ] 5.23 Add create() method
- [ ] 5.24 Add update() method
- [ ] 5.25 Add approve() — set status approved, save approvedAt

### Person C: Mentor DTOs & Reject/Suspend Logic (190 mins)
- [ ] 5.26 Add reject() — set status rejected, save reason
- [ ] 5.27 Add suspend() method
- [ ] 5.28 Create dto/mentor/create-mentor.dto.ts
- [ ] 5.29 Create dto/mentor/update-mentor.dto.ts
- [ ] 5.30 Add NID validation
- [ ] 5.31 Add phone validation
- [ ] 5.32 Add shortDescription max 160 chars validation
- [ ] 5.33 Add fullBio max 1000 chars validation
- [ ] 5.34 Add status enum validation
- [ ] 5.35 Block pending/suspended mentor login in AuthGuard

---

## 🗓️ DAY 6: Mentor Controller, File Upload & Password Reset (~480 mins)
### Person A: File Upload Setup & Mentor Controller (200 mins)
- [ ] 6.1 Install multer
- [ ] 6.2 Install @types/multer
- [ ] 6.3 Create uploads/avatars/ folder
- [ ] 6.4 Create uploads/cvs/ folder
- [ ] 6.5 Create uploads/resources/ folder
- [ ] 6.6 Create common/upload.config.ts — multer config
- [ ] 6.7 Add file size limit — images 5MB, PDFs 10MB
- [ ] 6.8 Add allowed file type validation
- [ ] 6.9 Create controllers/mentor folder
- [ ] 6.10 Create mentor.controller.ts
- [ ] 6.11 Add @Controller('mentors')
- [ ] 6.12 Add @Get() — all mentors with filters
- [ ] 6.13 Add @Get(':id') — single mentor
- [ ] 6.14 Add @Post() — admin only

### Person B: Mentor Approval Endpoints & Upload Routes (185 mins)
- [ ] 6.15 Add @Put(':id') — update mentor
- [ ] 6.16 Add @Delete(':id') — admin only
- [ ] 6.17 Add @Post(':id/approve') — admin only
- [ ] 6.18 Add @Post(':id/reject') — admin only, body: { reason }
- [ ] 6.19 Add @Post(':id/suspend') — admin only
- [ ] 6.20 Add @Post('upload/avatar') — mentor uploads photo
- [ ] 6.21 Add @Post('upload/cv') — mentor uploads PDF resume

### Person C: Password Reset Flow & Testing (190 mins)
- [ ] 6.22 Add resetToken column to User entity
- [ ] 6.23 Add resetTokenExpiry column to User entity
- [ ] 6.24 Create generateResetToken() in auth.service.ts
- [ ] 6.25 Create forgotPassword() — save token + expiry
- [ ] 6.26 Create resetPassword() — validate token, update password, clear token
- [ ] 6.27 Add @Post('forgot-password') to auth.controller.ts
- [ ] 6.28 Add @Post('reset-password') to auth.controller.ts
- [ ] 6.29 Test forgot password flow in Postman
- [ ] 6.30 Test reset password flow in Postman

---

## 🗓️ DAY 7: Mentee, Category & Skill Modules (~480 mins)
### Person A: Mentee Module (195 mins)
- [ ] 7.1 Create repositories/mentee folder
- [ ] 7.2 Create mentee.repository.ts
- [ ] 7.3 Add findAll() method
- [ ] 7.4 Add findById() with user relation
- [ ] 7.5 Add findByUserId() method
- [ ] 7.6 Add create() method
- [ ] 7.7 Add update() method
- [ ] 7.8 Create services/mentee folder
- [ ] 7.9 Create mentee.service.ts
- [ ] 7.10 Add all CRUD methods with NotFoundException
- [ ] 7.11 Create controllers/mentee folder
- [ ] 7.12 Create mentee.controller.ts
- [ ] 7.13 Add all endpoints with role guards
- [ ] 7.14 Create dto/mentee/index.ts
- [ ] 7.15 Add CreateMenteeDto, UpdateMenteeDto with validations

### Person B: Category Module (185 mins)
- [ ] 7.16 Create entities/category.entity.ts
- [ ] 7.17 Add id, name, description columns
- [ ] 7.18 Add slug column (auto-generated from name)
- [ ] 7.19 Add isActive, createdAt, updatedAt columns
- [ ] 7.20 Create category.repository.ts
- [ ] 7.21 Add findAll(), findById(), findBySlug() methods
- [ ] 7.22 Create category.service.ts
- [ ] 7.23 Add full CRUD methods
- [ ] 7.24 Create category.controller.ts
- [ ] 7.25 Add @Get(), @Get(':id') — public
- [ ] 7.26 Add @Post(), @Put(':id'), @Delete(':id') — admin only
- [ ] 7.27 Create dto/category/index.ts with validations

### Person C: Skill Module & Relations (185 mins)
- [ ] 7.28 Create entities/skill.entity.ts
- [ ] 7.29 Add id, name, description columns
- [ ] 7.30 Add category relation — ManyToOne to Category
- [ ] 7.31 Add isActive, createdAt, updatedAt columns
- [ ] 7.32 Create skill.repository.ts
- [ ] 7.33 Add findAll(), findById(), findByCategory() methods
- [ ] 7.34 Create skill.service.ts
- [ ] 7.35 Add full CRUD methods
- [ ] 7.36 Create skill.controller.ts
- [ ] 7.37 Add @Get(), @Get(':id'), @Get('category/:id') — public
- [ ] 7.38 Add @Post(), @Put(':id'), @Delete(':id') — admin only
- [ ] 7.39 Add ManyToMany relation — Mentor ↔ Skill
- [ ] 7.40 Commit day 7 to Git

---

## 🗓️ DAY 8: Availability Module (~480 mins)
### Person A: Availability Entity & Repository (190 mins)
- [ ] 8.1 Create entities/availability.entity.ts
- [ ] 8.2 Add mentorId column
- [ ] 8.3 Add dayOfWeek — enum: Mon/Tue/Wed/Thu/Fri/Sat/Sun
- [ ] 8.4 Add startTime, endTime columns (HH:mm)
- [ ] 8.5 Add isActive column
- [ ] 8.6 Create entities/blocked-date.entity.ts
- [ ] 8.7 Add mentorId, blockedDate, reason columns
- [ ] 8.8 Create repositories/availability folder
- [ ] 8.9 Create availability.repository.ts
- [ ] 8.10 Add findByMentorId(), create(), update(), delete()
- [ ] 8.11 Create blocked-date.repository.ts
- [ ] 8.12 Add findByMentorId(), create(), delete() methods

### Person B: Availability Service (195 mins)
- [ ] 8.13 Create services/availability folder
- [ ] 8.14 Create availability.service.ts
- [ ] 8.15 Add getAvailability() method
- [ ] 8.16 Add setSchedule() method
- [ ] 8.17 Add updateSchedule() method
- [ ] 8.18 Add blockDate() method
- [ ] 8.19 Add unblockDate() method
- [ ] 8.20 Add getAvailableSlots() — return open slots for a given date
- [ ] 8.21 Create dto/availability/index.ts with validations

### Person C: Availability Controller & Testing (185 mins)
- [ ] 8.22 Create controllers/availability folder
- [ ] 8.23 Create availability.controller.ts
- [ ] 8.24 Add @Get(':mentorId') — public
- [ ] 8.25 Add @Get(':mentorId/slots') — slots by date
- [ ] 8.26 Add @Post() — mentor only
- [ ] 8.27 Add @Put(':id') — mentor only
- [ ] 8.28 Add @Delete(':id') — mentor only
- [ ] 8.29 Add @Post('block') — mentor only
- [ ] 8.30 Add @Delete('block/:id') — mentor only
- [ ] 8.31 Test set availability
- [ ] 8.32 Test get available slots by date
- [ ] 8.33 Test block a date
- [ ] 8.34 Commit availability module to Git

---

## 🗓️ DAY 9: Session Module (~480 mins)
### Person A: Session Entity & Repository (190 mins)
- [ ] 9.1 Add no_show to SessionStatus enum
- [ ] 9.2 Create entities/session.entity.ts
- [ ] 9.3 Add mentorId, menteeId columns
- [ ] 9.4 Add title, description columns
- [ ] 9.5 Add scheduledAt, duration columns
- [ ] 9.6 Add status column — scheduled/completed/cancelled/no_show
- [ ] 9.7 Add meetingLink column (nullable)
- [ ] 9.8 Add notes column (nullable)
- [ ] 9.9 Add mentor and mentee relations
- [ ] 9.10 Create repositories/session folder
- [ ] 9.11 Create session.repository.ts
- [ ] 9.12 Add findAll(), findById() with relations
- [ ] 9.13 Add findByMentorId(), findByMenteeId() methods
- [ ] 9.14 Add create(), updateStatus() methods

### Person B: Session Service & Business Logic (195 mins)
- [ ] 9.15 Create services/session folder
- [ ] 9.16 Create session.service.ts
- [ ] 9.17 Add createSession() — check availability before booking
- [ ] 9.18 Add getSessions() — auto-filter by logged-in user role
- [ ] 9.19 Add getSessionById() method
- [ ] 9.20 Add acceptSession() — mentor only
- [ ] 9.21 Add declineSession() — mentor only
- [ ] 9.22 Add completeSession() method
- [ ] 9.23 Add cancelSession() method
- [ ] 9.24 Add markNoShow() method

### Person C: Session Controller & Testing (185 mins)
- [ ] 9.25 Create controllers/session folder
- [ ] 9.26 Create session.controller.ts
- [ ] 9.27 Add @Get(), @Get(':id') endpoints
- [ ] 9.28 Add @Post(), @Put(':id'), @Delete(':id') endpoints
- [ ] 9.29 Add @Post(':id/accept') — mentor only
- [ ] 9.30 Add @Post(':id/decline') — mentor only
- [ ] 9.31 Add @Post(':id/complete'), @Post(':id/cancel')
- [ ] 9.32 Add @Post(':id/no-show')
- [ ] 9.33 Create dto/session/index.ts with validations
- [ ] 9.34 Test full session lifecycle in Postman
- [ ] 9.35 Commit session module to Git

---

## 🗓️ DAY 10: Matching & Feedback Modules (~480 mins)
### Person A: Matching Algorithm (200 mins)
- [ ] 10.1 Create repositories/matching folder
- [ ] 10.2 Create matching.repository.ts
- [ ] 10.3 Add findRecommended() method stub
- [ ] 10.4 Create services/matching folder
- [ ] 10.5 Create matching.service.ts
- [ ] 10.6 Create calculateMatchScore() method
- [ ] 10.7 Implement skill match scoring — 50% weight
- [ ] 10.8 Implement rating scoring — 30% weight
- [ ] 10.9 Implement availability scoring — 20% weight
- [ ] 10.10 Create matching.controller.ts
- [ ] 10.11 Add @Get('recommended') — mentee only
- [ ] 10.12 Create dto/matching/index.ts with validations

### Person B: Feedback Entity & Service (185 mins)
- [ ] 10.13 Create entities/feedback.entity.ts
- [ ] 10.14 Add mentorId, menteeId, sessionId columns
- [ ] 10.15 Add rating column (1–5)
- [ ] 10.16 Add comment column (nullable)
- [ ] 10.17 Add isAnonymous column
- [ ] 10.18 Create repositories/feedback folder
- [ ] 10.19 Create feedback.repository.ts
- [ ] 10.20 Add findAll(), findById() methods
- [ ] 10.21 Add findByMentorId(), findBySessionId() methods
- [ ] 10.22 Create services/feedback folder
- [ ] 10.23 Create feedback.service.ts
- [ ] 10.24 Add submitFeedback() — check session completed first
- [ ] 10.25 Add duplicate feedback check
- [ ] 10.26 Add updateMentorRating() — recalculate average

### Person C: Feedback Controller & Testing (185 mins)
- [ ] 10.27 Add getFeedbackByMentor() method
- [ ] 10.28 Add deleteFeedback() method
- [ ] 10.29 Create controllers/feedback folder
- [ ] 10.30 Create feedback.controller.ts
- [ ] 10.31 Add @Get(), @Get(':id') endpoints
- [ ] 10.32 Add @Get('mentor/:mentorId') endpoint
- [ ] 10.33 Add @Post(), @Put(':id'), @Delete(':id') endpoints
- [ ] 10.34 Create dto/feedback/index.ts with validations
- [ ] 10.35 Test matching algorithm with seeded data
- [ ] 10.36 Test full feedback flow in Postman
- [ ] 10.37 Commit matching and feedback to Git

---

## 🗓️ DAY 11: Chat & Learning Resources (~480 mins)
### Person A: Message Entity & Repository (190 mins)
- [ ] 11.1 Create entities/message.entity.ts
- [ ] 11.2 Add senderId, receiverId columns
- [ ] 11.3 Add content column
- [ ] 11.4 Add isRead, readAt columns
- [ ] 11.5 Add sender and receiver relations to User
- [ ] 11.6 Create repositories/message folder
- [ ] 11.7 Create message.repository.ts
- [ ] 11.8 Add findConversation() — messages between two users
- [ ] 11.9 Add findConversationList() — all unique conversations
- [ ] 11.10 Add create() method
- [ ] 11.11 Add markAsRead() method
- [ ] 11.12 Create dto/message/index.ts with validations

### Person B: Message Service & Controller (190 mins)
- [ ] 11.13 Create services/message folder
- [ ] 11.14 Create message.service.ts
- [ ] 11.15 Add sendMessage() method
- [ ] 11.16 Add getConversation() method
- [ ] 11.17 Add getConversationList() method
- [ ] 11.18 Add markAsRead() method
- [ ] 11.19 Create controllers/message folder
- [ ] 11.20 Create message.controller.ts
- [ ] 11.21 Add @Post() — send message
- [ ] 11.22 Add @Get('conversations') — list all conversations
- [ ] 11.23 Add @Get(':userId') — thread with specific user
- [ ] 11.24 Add @Put(':id/read') — mark as read
- [ ] 11.25 Test all chat endpoints in Postman

### Person C: Learning Resources Module (185 mins)
- [ ] 11.26 Create entities/resource.entity.ts
- [ ] 11.27 Add mentorId, sessionId (nullable) columns
- [ ] 11.28 Add title, description columns
- [ ] 11.29 Add type column — enum: document/link/task
- [ ] 11.30 Add fileUrl / linkUrl column
- [ ] 11.31 Create repositories/resource folder
- [ ] 11.32 Create resource.repository.ts
- [ ] 11.33 Add findByMentorId(), create(), delete() methods
- [ ] 11.34 Create resource.service.ts
- [ ] 11.35 Add uploadResource(), getResources(), deleteResource()
- [ ] 11.36 Create resource.controller.ts
- [ ] 11.37 Add @Get(':mentorId') — public
- [ ] 11.38 Add @Post() — mentor only
- [ ] 11.39 Add @Delete(':id') — mentor only
- [ ] 11.40 Commit chat and resources to Git

---

## 🗓️ DAY 12: Notifications & Activity Logs (~480 mins)
### Person A: Notification Entity & Repository (190 mins)
- [ ] 12.1 Create entities/notification.entity.ts
- [ ] 12.2 Add userId, title, message columns
- [ ] 12.3 Add type column — enum: email/sms/push/in_app
- [ ] 12.4 Add isRead, readAt columns
- [ ] 12.5 Add actionUrl, metadata columns (nullable)
- [ ] 12.6 Create repositories/notification folder
- [ ] 12.7 Create notification.repository.ts
- [ ] 12.8 Add findByUserId() method
- [ ] 12.9 Add findUnread() method
- [ ] 12.10 Add markAsRead(), markAllAsRead() methods
- [ ] 12.11 Create notification.service.ts
- [ ] 12.12 Add findAll(), findUnread() methods
- [ ] 12.13 Add markAsRead(), markAllAsRead() methods
- [ ] 12.14 Add createNotification() helper — reusable

### Person B: Notification Controller & Plugging Events (185 mins)
- [ ] 12.15 Create notification.controller.ts
- [ ] 12.16 Add @Get(), @Get('unread'), @Get(':id') endpoints
- [ ] 12.17 Add @Post() — admin only
- [ ] 12.18 Add @Put(':id/read'), @Put('read-all') endpoints
- [ ] 12.19 Add @Delete(':id') endpoint
- [ ] 12.20 Plug createNotification() into session accept event
- [ ] 12.21 Plug createNotification() into session decline event
- [ ] 12.22 Plug createNotification() into mentor approval event
- [ ] 12.23 Plug createNotification() into mentor rejection event
- [ ] 12.24 Test all notification endpoints
- [ ] 12.25 Commit notifications to Git

### Person C: Activity Log Module (190 mins)
- [ ] 12.26 Create entities/activity-log.entity.ts
- [ ] 12.27 Add userId, action columns — enum: login/logout/create/update/delete/view
- [ ] 12.28 Add entity, entityId, description columns
- [ ] 12.29 Add ipAddress, userAgent, metadata columns (nullable)
- [ ] 12.30 Create activity-log.repository.ts
- [ ] 12.31 Add findAll() with pagination, findById(), create()
- [ ] 12.32 Create activity-log.service.ts
- [ ] 12.33 Add log() helper — reusable across modules
- [ ] 12.34 Plug log() into login event
- [ ] 12.35 Plug log() into logout event
- [ ] 12.36 Create activity-log.controller.ts
- [ ] 12.37 Add @Get(), @Get(':id') — admin only
- [ ] 12.38 Test activity log auto-logging
- [ ] 12.39 Commit activity logs to Git

---

## 🗓️ DAY 13: Admin Module & Reports (~480 mins)
### Person A: Admin Service & Dashboard Stats (200 mins)
- [ ] 13.1 Create services/admin folder
- [ ] 13.2 Create admin.service.ts
- [ ] 13.3 Add getDashboardStats() method
- [ ] 13.4 Add totalUsers, totalMentors, totalMentees counts
- [ ] 13.5 Add activeSessions count
- [ ] 13.6 Add sessionsByStatus breakdown
- [ ] 13.7 Add completionRate calculation
- [ ] 13.8 Add averagePlatformRating
- [ ] 13.9 Add top 5 mentors by rating
- [ ] 13.10 Add top 5 mentors by total sessions
- [ ] 13.11 Add most requested skills
- [ ] 13.12 Add pending mentor approval count

### Person B: Admin Controller & User Management (185 mins)
- [ ] 13.13 Create controllers/admin folder
- [ ] 13.14 Create admin.controller.ts
- [ ] 13.15 Add @Controller('admin') with @Roles(ADMIN) guard
- [ ] 13.16 Add @Get('dashboard') endpoint
- [ ] 13.17 Add @Get('users') with search + filter + pagination
- [ ] 13.18 Add @Get('mentors') with pagination
- [ ] 13.19 Add @Get('mentees') with pagination
- [ ] 13.20 Add @Post('users/:id/deactivate')
- [ ] 13.21 Add @Post('users/:id/reset-password')
- [ ] 13.22 Add @Delete('users/:id')
- [ ] 13.23 Add @Delete('feedback/:id') — moderate feedback

### Person C: Report Module (185 mins)
- [ ] 13.24 Create entities/report.entity.ts
- [ ] 13.25 Add reporterId, reportedId columns
- [ ] 13.26 Add reason, description columns
- [ ] 13.27 Add status column — enum: pending/reviewed/dismissed
- [ ] 13.28 Add adminNote column (nullable)
- [ ] 13.29 Create report.repository.ts
- [ ] 13.30 Add findAll(), findById(), create(), update() methods
- [ ] 13.31 Create report.service.ts
- [ ] 13.32 Add fileReport(), getReports() methods
- [ ] 13.33 Add handleReport(), dismissReport() methods
- [ ] 13.34 Add @Get('reports'), @Put('reports/:id') to admin.controller.ts
- [ ] 13.35 Test admin dashboard stats
- [ ] 13.36 Commit admin and reports to Git

---

## 🗓️ DAY 14: Seed Data, Final Testing & Documentation (~480 mins)
### Person A: Seed Data (190 mins)
- [ ] 14.1 Create seed/seed.ts file
- [ ] 14.2 Seed 1 admin user
- [ ] 14.3 Seed 3 approved mentor users with full profiles
- [ ] 14.4 Seed 1 pending mentor (for approval testing)
- [ ] 14.5 Seed 3 mentee users
- [ ] 14.6 Seed 10 skills across 4 categories
- [ ] 14.7 Seed availability for each mentor
- [ ] 14.8 Seed sample sessions in various statuses
- [ ] 14.9 Seed sample feedback with ratings
- [ ] 14.10 Run npm run seed and verify database

### Person B: Full Flow Testing (195 mins)
- [ ] 14.11 Test: Register mentor → pending → admin approves
- [ ] 14.12 Test: Mentee registers → browses mentors → books session
- [ ] 14.13 Test: Mentor accepts → session completes → feedback submitted
- [ ] 14.14 Test: Mentor rating recalculates after feedback
- [ ] 14.15 Test: Mentee files report → admin handles
- [ ] 14.16 Test: Forgot password → reset password
- [ ] 14.17 Test: Matching algorithm returns ranked mentors
- [ ] 14.18 Test: Admin dashboard stats are accurate
- [ ] 14.19 Fix all critical bugs found
- [ ] 14.20 Commit final fixes to Git

### Person C: Documentation & Postman Collection (185 mins)
- [ ] 14.21 Update README with full API endpoint list
- [ ] 14.22 Document request body and response for each endpoint
- [ ] 14.23 Create Postman collection — auth endpoints
- [ ] 14.24 Add user, mentor, mentee endpoints to Postman
- [ ] 14.25 Add session, feedback, matching endpoints to Postman
- [ ] 14.26 Add admin, notification, chat endpoints to Postman
- [ ] 14.27 Export Postman collection as JSON
- [ ] 14.28 Push everything to GitHub
- [ ] 14.29 Move all tasks to Done in GitHub Projects
- [ ] 14.30 Celebrate! 🎉

---

## Progress Tracking

| Person | Day 4 | Day 5 | Day 6 | Day 7 | Day 8 | Day 9 | Day 10 | Day 11 | Day 12 | Day 13 | Day 14 |
|--------|-------|-------|-------|-------|-------|-------|--------|--------|--------|--------|--------|
| **A (Nita)** | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| **B (Trea)** | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| **C (Vichet)** | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
