# ️ MentorKhet - 14 Day Development Sprint Plan

## GitHub Projects Board Setup

Add these tasks to your **Todo** column in GitHub Projects. Each task is labeled with priority and estimated time.

---

## 📋 Task List for GitHub Projects

### **Week 1: Foundation (Day 1-7)**

#### Day 1 - Project Setup
- [ ] **TASK-001**: Setup PostgreSQL database [P0 - 2h]
- [ ] **TASK-002**: Configure .env file with database credentials [P0 - 30m]
- [ ] **TASK-003**: Install npm dependencies [P0 - 30m]
- [ ] **TASK-004**: Test database connection [P0 - 1h]
- [ ] **TASK-005**: Create database entities (User, Mentor, Mentee) [P0 - 3h]
- [ ] **TASK-006**: Run initial TypeORM sync/migration [P0 - 1h]

#### Day 2 - Authentication Module
- [ ] **TASK-007**: Implement password hashing with bcrypt [P0 - 1h]
- [ ] **TASK-008**: Create JWT token generation service [P0 - 2h]
- [ ] **TASK-009**: Implement register endpoint [P0 - 2h]
- [ ] **TASK-010**: Implement login endpoint [P0 - 2h]
- [ ] **TASK-011**: Create AuthGuard for JWT validation [P0 - 2h]
- [ ] **TASK-012**: Create RolesGuard for RBAC [P0 - 1h]
- [ ] **TASK-013**: Test authentication flow with Postman [P0 - 1h]

#### Day 3 - User Module
- [ ] **TASK-014**: Create UserRepository [P0 - 1h]
- [ ] **TASK-015**: Create UserService with CRUD operations [P0 - 2h]
- [ ] **TASK-016**: Create UserController [P0 - 1h]
- [ ] **TASK-017**: Implement GET /users/profile endpoint [P0 - 1h]
- [ ] **TASK-018**: Implement PUT /users/profile endpoint [P0 - 1h]
- [ ] **TASK-019**: Test user CRUD operations [P0 - 1h]

#### Day 4 - Mentor Module
- [ ] **TASK-020**: Create MentorRepository [P0 - 1h]
- [ ] **TASK-021**: Create MentorService [P0 - 2h]
- [ ] **TASK-022**: Create MentorController [P0 - 1h]
- [ ] **TASK-023**: Implement GET /mentors endpoint with filters [P0 - 2h]
- [ ] **TASK-024**: Implement POST /mentors/me endpoint [P0 - 1h]
- [ ] **TASK-025**: Implement PUT /mentors/me endpoint [P0 - 1h]
- [ ] **TASK-026**: Test mentor endpoints [P0 - 1h]

#### Day 5 - Mentee Module
- [ ] **TASK-027**: Create MenteeRepository [P0 - 1h]
- [ ] **TASK-028**: Create MenteeService [P0 - 2h]
- [ ] **TASK-029**: Create MenteeController [P0 - 1h]
- [ ] **TASK-030**: Implement GET /mentees/me endpoint [P0 - 1h]
- [ ] **TASK-031**: Implement POST /mentees/me endpoint [P0 - 1h]
- [ ] **TASK-032**: Implement PUT /mentees/me endpoint [P0 - 1h]
- [ ] **TASK-033**: Test mentee endpoints [P0 - 1h]

#### Day 6 - Skill Module
- [ ] **TASK-034**: Create SkillRepository [P0 - 1h]
- [ ] **TASK-035**: Create SkillService [P0 - 1h]
- [ ] **TASK-036**: Create SkillController [P0 - 1h]
- [ ] **TASK-037**: Implement skill CRUD endpoints [P0 - 2h]
- [ ] **TASK-038**: Add skill categories (TECHNICAL, SOFT_SKILLS, BUSINESS, CREATIVE) [P0 - 1h]
- [ ] **TASK-039**: Seed initial skills data [P0 - 1h]
- [ ] **TASK-040**: Test skill endpoints [P0 - 1h]

#### Day 7 - Catch-up & Testing
- [ ] **TASK-041**: Test all Week 1 endpoints [P0 - 3h]
- [ ] **TASK-042**: Fix any bugs found [P0 - 2h]
- [ ] **TASK-043**: Write unit tests for services [P1 - 2h]
- [ ] **TASK-044**: Update README with API documentation [P1 - 1h]
- [ ] **TASK-045**: Commit and push Week 1 progress [P0 - 30m]

---

### **Week 2: Core Features (Day 8-14)**

#### Day 8 - Session Module (Part 1)
- [ ] **TASK-046**: Create Session entity with status enum [P0 - 2h]
- [ ] **TASK-047**: Create SessionRepository [P0 - 1h]
- [ ] **TASK-048**: Create SessionService [P0 - 2h]
- [ ] **TASK-049**: Create SessionController [P0 - 1h]
- [ ] **TASK-050**: Implement POST /sessions/request endpoint [P0 - 2h]
- [ ] **TASK-051**: Implement GET /sessions endpoint [P0 - 1h]
- [ ] **TASK-052**: Test session request flow [P0 - 1h]

#### Day 9 - Session Module (Part 2)
- [ ] **TASK-053**: Implement PATCH /sessions/:id/approve endpoint [P0 - 2h]
- [ ] **TASK-054**: Implement PATCH /sessions/:id/decline endpoint [P0 - 2h]
- [ ] **TASK-055**: Implement PATCH /sessions/:id/complete endpoint [P0 - 2h]
- [ ] **TASK-056**: Implement PATCH /sessions/:id/cancel endpoint [P0 - 2h]
- [ ] **TASK-057**: Add session status validation logic [P0 - 1h]
- [ ] **TASK-058**: Test complete session workflow [P0 - 2h]

#### Day 10 - Matching Algorithm
- [ ] **TASK-059**: Create MatchingRepository [P0 - 1h]
- [ ] **TASK-060**: Create MatchingService [P0 - 2h]
- [ ] **TASK-061**: Implement calculateMatchScore method (Skill 50% + Rating 30% + Availability 20%) [P0 - 3h]
- [ ] **TASK-062**: Create MatchingController [P0 - 1h]
- [ ] **TASK-063**: Implement GET /matching/recommended-mentors endpoint [P0 - 2h]
- [ ] **TASK-064**: Test matching algorithm with sample data [P0 - 2h]

#### Day 11 - Feedback Module
- [ ] **TASK-065**: Create Feedback entity with rating fields [P0 - 2h]
- [ ] **TASK-066**: Create FeedbackRepository [P0 - 1h]
- [ ] **TASK-067**: Create FeedbackService [P0 - 2h]
- [ ] **TASK-068**: Create FeedbackController [P0 - 1h]
- [ ] **TASK-069**: Implement POST /feedback endpoint [P0 - 2h]
- [ ] **TASK-070**: Implement GET /feedback/mentor/:mentorId endpoint [P0 - 1h]
- [ ] **TASK-071**: Add mentor rating calculation logic [P0 - 2h]
- [ ] **TASK-072**: Test feedback submission flow [P0 - 1h]

#### Day 12 - Admin Dashboard
- [ ] **TASK-073**: Create AdminService [P0 - 2h]
- [ ] **TASK-074**: Create AdminController [P0 - 1h]
- [ ] **TASK-075**: Implement GET /admin/dashboard endpoint [P0 - 2h]
- [ ] **TASK-076**: Add statistics calculation (total users, sessions, completion rate) [P0 - 2h]
- [ ] **TASK-077**: Implement GET /admin/activity-logs endpoint [P0 - 1h]
- [ ] **TASK-078**: Test admin dashboard endpoints [P0 - 1h]

#### Day 13 - Notifications & Activity Logs
- [ ] **TASK-079**: Create Notification entity [P0 - 1h]
- [ ] **TASK-080**: Create NotificationRepository [P0 - 1h]
- [ ] **TASK-081**: Create NotificationService [P0 - 2h]
- [ ] **TASK-082**: Create NotificationController [P0 - 1h]
- [ ] **TASK-083**: Implement notification creation on session events [P0 - 2h]
- [ ] **TASK-084**: Implement GET /notifications endpoint [P0 - 1h]
- [ ] **TASK-085**: Implement PUT /notifications/:id/read endpoint [P0 - 1h]
- [ ] **TASK-086**: Create ActivityLog entity [P0 - 1h]
- [ ] **TASK-087**: Implement activity logging service [P0 - 2h]
- [ ] **TASK-088**: Test notifications and activity logs [P0 - 1h]

#### Day 14 - Final Testing & Documentation
- [ ] **TASK-089**: Run full integration test suite [P0 - 3h]
- [ ] **TASK-090**: Fix all critical bugs [P0 - 3h]
- [ ] **TASK-091**: Update API documentation in README [P0 - 2h]
- [ ] **TASK-092**: Add Swagger/OpenAPI documentation [P1 - 2h]
- [ ] **TASK-093**: Prepare demo data for presentation [P0 - 1h]
- [ ] **TASK-094**: Create Postman collection for API testing [P0 - 1h]
- [ ] **TASK-095**: Final commit and push [P0 - 30m]
- [ ] **TASK-096**: Prepare presentation slides [P1 - 2h]

---

## 📊 Daily Schedule Template

### **Morning Session (8:00 AM - 12:00 PM)**
- 8:00 - 8:30: Review yesterday's progress and plan today's tasks
- 8:30 - 10:30: Deep work on primary task
- 10:30 - 10:45: Break
- 10:45 - 12:00: Continue implementation

### **Afternoon Session (1:00 PM - 5:00 PM)**
- 1:00 - 3:00: Complete remaining tasks
- 3:00 - 3:15: Break
- 3:15 - 4:30: Testing and bug fixes
- 4:30 - 5:00: Commit code and update GitHub Projects board

### **Evening (Optional)**
- 8:00 - 9:00: Review code, plan next day
- 9:00 - 10:00: Study NestJS/TypeORM documentation if stuck

---

## 🎯 Priority Levels

| Priority | Meaning | Action |
|----------|---------|--------|
| **P0** | Critical - Must complete for MVP | Do first, block 2-3h |
| **P1** | Important - Should complete | Do after P0 tasks |
| **P2** | Nice to have - If time permits | Skip if behind schedule |

---

## ✅ Definition of Done

Each task is considered **DONE** when:
- ✅ Code is implemented
- ✅ Unit tests pass (if applicable)
- ✅ API tested with Postman
- ✅ Code is committed and pushed
- ✅ Task moved to **Done** column in GitHub Projects

---

## 🔄 GitHub Projects Workflow

1. **Todo** → All planned tasks (copy from this list)
2. **In Progress** → Move task when you start working on it (max 2 tasks)
3. **Done** → Move task when implementation is complete
4. **Review** → Move task when code needs review/testing
5. **Passed** → Move task after final testing and approval

---

## 🚨 If You Fall Behind

**Day 5 Checkpoint:** If behind schedule, skip these:
- Activity logging (TASK-086, TASK-087)
- Advanced filtering (TASK-023)
- Unit tests (TASK-043)

**Day 10 Checkpoint:** If behind schedule, skip these:
- Notifications (TASK-079 to TASK-085)
- Admin activity logs (TASK-077)
- Swagger docs (TASK-092)

**Minimum Viable Product (Must Complete):**
- Authentication (TASK-007 to TASK-013)
- User/Mentor/Mentee profiles (TASK-014 to TASK-033)
- Skills (TASK-034 to TASK-040)
- Session workflow (TASK-046 to TASK-058)
- Matching (TASK-059 to TASK-064)
- Feedback (TASK-065 to TASK-072)

---

## 📈 Progress Tracking

Update your GitHub Projects board **every day**:
- Morning: Move today's tasks from Todo → In Progress
- Evening: Move completed tasks from In Progress → Done

**Daily Standup Questions (ask yourself):**
1. What did I complete yesterday?
2. What will I work on today?
3. What blockers do I have?

---

## 🎉 Milestone Rewards

- **Day 3**: Auth working → Take a 2-hour break
- **Day 7**: Week 1 complete → Celebrate, you're halfway!
- **Day 10**: Core features done → You're almost there!
- **Day 14**: Project complete → 🎊 DEMO DAY!

---

## 📞 Emergency Contacts

When stuck on a task for more than 2 hours:
1. Check NestJS documentation: https://docs.nestjs.com
2. Check TypeORM documentation: https://typeorm.io
3. Search Stack Overflow
4. Ask for help from instructor/peers

---

**Good luck! You've got this! 💪**

**Start Date:** _______________  
**Target End Date:** _______________  
**GitHub Project:** https://github.com/users/ChetDevelopment/projects/1
