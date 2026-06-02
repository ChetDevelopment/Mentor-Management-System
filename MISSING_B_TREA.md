# Person B (Trea) — Missing Tasks

## Priority: CRITICAL — Original Tasks Not Completed

### 1. Message/Chat Module (with Person A)
- [ ] Create message.service.ts with sendMessage(), getConversation(), getConversationList()
- [ ] Create message.controller.ts with @Post(), @Get('conversations'), @Get(':userId'), @Put(':id/read')
- [ ] Test all chat endpoints in Postman

### 2. Availability Service
- [ ] Create services/availability/availability.service.ts
- [ ] Add getAvailability() method
- [ ] Add setSchedule() method
- [ ] Add updateSchedule() method
- [ ] Add blockDate() method
- [ ] Add unblockDate() method
- [ ] Add getAvailableSlots() — return open slots for a given date
- [ ] Create dto/availability/index.ts with validations
- [ ] Wire controller to service

### 3. Full Flow Testing
- [ ] Test: Register mentor → pending → admin approves
- [ ] Test: Mentee registers → browses mentors → books session
- [ ] Test: Mentor accepts → session completes → feedback submitted
- [ ] Test: Mentor rating recalculates after feedback
- [ ] Test: Forgot password → reset password
- [ ] Test: Matching algorithm returns ranked mentors
- [ ] Test: Admin dashboard stats are accurate
- [ ] Fix all critical bugs found

## Priority: HIGH — New Requirement Gaps

### 4. Account Lockout System
- [ ] Add failedLoginCount, lockedUntil to User entity
- [ ] Implement lockout logic in AuthService.login()
- [ ] Return HTTP 423 Locked when account is locked
- [ ] Auto-lock after 5 failed attempts within 15 minutes

### 5. Session Status Alignment
- [ ] Update SessionStatus enum: PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW
- [ ] Add status transition validation
- [ ] Add completedAt column to Session entity

### 6. Soft Delete for Users
- [ ] Add deletedAt column to User entity
- [ ] Update all user queries to exclude soft-deleted records
- [ ] Implement soft delete in UserRepository
