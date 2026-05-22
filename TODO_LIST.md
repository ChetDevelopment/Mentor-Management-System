# 📋 MentorKhet - Copy-Paste Task List for GitHub Projects

## How to Use This List

1. Open your GitHub Projects: https://github.com/users/ChetDevelopment/projects/1
2. Click **"+ Add item"** in the **Todo** column
3. Copy each task below and paste as a new item
4. Start with **Day 1** tasks only!

---

## 🗓️ DAY 1: Setup (6 tasks, ~8 hours total)

```
1.1 Install Node.js v20+ if not installed [15m] 
1.2 Install VS Code if not installed [15m]
1.3 Install PostgreSQL (or use Docker) [1h]
1.4 Create database named 'mentorkhet' [30m]
1.5 Clone repository from GitHub [15m]
1.6 Open project in VS Code [5m]
1.7 Run 'npm install' in terminal [30m]
1.8 Copy .env.example to .env [5m]
1.9 Update DB_PASSWORD in .env file [5m]
1.10 Update DB_DATABASE in .env file [5m]
1.11 Test database connection (npm run start:dev) [30m]
1.12 Check entities folder exists [5m]
1.13 Create User entity class [1h]
1.14 Add @Entity('users') decorator [10m]
1.15 Add id column with @PrimaryGeneratedColumn [15m]
1.16 Add email column with @Column [10m]
1.17 Add password column with @Column [10m]
1.18 Add firstName, lastName columns [10m]
1.19 Add role column with enum [15m]
1.20 Add createdAt, updatedAt columns [10m]
1.21 Create Mentor entity class [1h]
1.22 Add @Entity('mentors') decorator [10m]
1.23 Add userId column with @Column [10m]
1.24 Add bio, title, company columns [15m]
1.25 Add yearsOfExperience column [10m]
1.26 Add rating, totalSessions columns [15m]
1.27 Add isAvailable column [10m]
1.28 Create Mentee entity class [1h]
1.29 Add @Entity('mentees') decorator [10m]
1.30 Add userId column with @Column [10m]
1.31 Add occupation, organization columns [15m]
1.32 Add goals, interests columns [15m]
1.33 Save all entity files [5m]
1.34 Restart server to test entities load [15m]
1.35 Check database for new tables [15m]
1.36 Commit Day 1 work to Git [30m]
```

---

## 🗓️ DAY 2: Authentication Part 1 (8 tasks, ~8 hours)

```
2.1 Create constants/index.ts file [5m]
2.2 Add UserRole enum (ADMIN, MENTOR, MENTEE) [15m]
2.3 Create config/index.ts file [5m]
2.4 Add databaseConfig object [15m]
2.5 Add jwtConfig object [10m]
2.6 Create dto/auth/login.dto.ts [10m]
2.7 Add email validation with @IsEmail [15m]
2.8 Add password validation with @MinLength [10m]
2.9 Create dto/auth/register.dto.ts [15m]
2.10 Add firstName, lastName validations [15m]
2.11 Add role validation with @IsEnum [10m]
2.12 Create repositories/auth folder [5m]
2.13 Create auth.repository.ts file [10m]
2.14 Add @InjectRepository decorator [15m]
2.15 Add create() method [20m]
2.16 Add findByUserId() method [20m]
2.17 Create services/auth folder [5m]
2.18 Create auth.service.ts file [10m]
2.19 Import bcrypt package [10m]
2.20 Install bcrypt: npm install bcrypt [15m]
2.21 Install @types/bcrypt: npm install -D @types/bcrypt [10m]
2.22 Create hashPassword() method [20m]
2.23 Create comparePassword() method [20m]
2.24 Install @nestjs/jwt: npm install @nestjs/jwt [15m]
2.25 Install @nestjs/passport: npm install @nestjs/passport [10m]
2.26 Install passport-jwt: npm install passport-jwt [10m]
2.27 Install passport-local: npm install passport-local [10m]
2.28 Create generateTokens() method [30m]
2.29 Commit auth setup to Git [20m]
```

---

## 🗓️ DAY 3: Authentication Part 2 (7 tasks, ~8 hours)

```
3.1 Create controllers/auth folder [5m]
3.2 Create auth.controller.ts file [10m]
3.3 Add @Controller('auth') decorator [5m]
3.4 Import AuthService [5m]
3.5 Create constructor with dependency injection [10m]
3.6 Create @Post('register') endpoint [20m]
3.7 Add @Body() registerDto parameter [10m]
3.8 Call authService.register() [15m]
3.9 Create @Post('login') endpoint [20m]
3.10 Add @Body() loginDto parameter [10m]
3.11 Call authService.login() [15m]
3.12 Complete authService.register() method [45m]
3.13 Complete authService.login() method [45m]
3.14 Create guards/auth.guard.ts [30m]
3.15 Add JwtService injection [15m]
3.16 Add canActivate() method [30m]
3.17 Extract token from Authorization header [20m]
3.18 Verify JWT token with jwtService [20m]
3.19 Create guards/roles.guard.ts [30m]
3.20 Add role checking logic [30m]
3.21 Create decorators/public.decorator.ts [20m]
3.22 Add @Public() decorator for public routes [15m]
3.23 Test register endpoint with Postman [1h]
3.24 Test login endpoint with Postman [1h]
3.25 Commit auth completion to Git [20m]
```

---

## 🗓️ DAY 4: User Module (7 tasks, ~8 hours)

```
4.1 Create repositories/user folder [5m]
4.2 Create user.repository.ts file [10m]
4.3 Add @InjectRepository(User) [15m]
4.4 Add findAll() method [20m]
4.5 Add findById() method [20m]
4.6 Add findByEmail() method [20m]
4.7 Add update() method [20m]
4.8 Create services/user folder [5m]
4.9 Create user.service.ts file [10m]
4.10 Inject UserRepository [10m]
4.11 Create findAll() method [15m]
4.12 Create findById() method [20m]
4.13 Create findByEmail() method [20m]
4.14 Create update() method [20m]
4.15 Add NotFoundException handling [15m]
4.16 Create controllers/user folder [5m]
4.17 Create user.controller.ts file [10m]
4.18 Add @Controller('users') decorator [5m]
4.19 Add @UseGuards(AuthGuard) [10m]
4.20 Create @Get('profile') endpoint [20m]
4.21 Add @User() decorator to get current user [15m]
4.22 Create @Put('profile') endpoint [30m]
4.23 Create dto/user/index.ts file [10m]
4.24 Add UpdateUserDto class [20m]
4.25 Add validation decorators [20m]
4.26 Test GET /users/profile [30m]
4.27 Test PUT /users/profile [30m]
4.28 Commit user module to Git [20m]
```

---

## 🗓️ DAY 5: Mentor Module (7 tasks, ~8 hours)

```
5.1 Create repositories/mentor folder [5m]
5.2 Create mentor.repository.ts file [10m]
5.3 Add @InjectRepository(Mentor) [15m]
5.4 Add findAll() method with relations [25m]
5.5 Add findById() method [20m]
5.6 Add create() method [20m]
5.7 Add update() method [20m]
5.8 Create services/mentor folder [5m]
5.9 Create mentor.service.ts file [10m]
5.10 Inject MentorRepository [10m]
5.11 Create findAll() method [20m]
5.12 Create findById() method [20m]
5.13 Create create() method [25m]
5.14 Create update() method [25m]
5.15 Create dto/mentor/index.ts file [10m]
5.16 Add CreateMentorDto class [20m]
5.17 Add UpdateMentorDto class [20m]
5.18 Add validation decorators [20m]
5.19 Create controllers/mentor folder [5m]
5.20 Create mentor.controller.ts file [10m]
5.21 Add @Controller('mentors') decorator [5m]
5.22 Create @Get() endpoint [15m]
5.23 Create @Get(':id') endpoint [15m]
5.24 Create @Post() endpoint [20m]
5.25 Create @Put(':id') endpoint [20m]
5.26 Add @Roles(UserRole.ADMIN) where needed [15m]
5.27 Test all mentor endpoints [1h]
5.28 Commit mentor module to Git [20m]
```

---

## 🗓️ DAY 6: Mentee & Skill Modules (8 tasks, ~8 hours)

```
6.1 Create repositories/mentee folder [5m]
6.2 Create mentee.repository.ts [30m]
6.3 Add findAll, findById, create, update methods [45m]
6.4 Create services/mentee folder [5m]
6.5 Create mentee.service.ts [30m]
6.6 Add all CRUD methods [45m]
6.7 Create controllers/mentee folder [5m]
6.8 Create mentee.controller.ts [30m]
6.9 Add all endpoints [45m]
6.10 Create repositories/skill folder [5m]
6.11 Create skill.repository.ts [30m]
6.12 Add findAll, findById, findByName methods [30m]
6.13 Create services/skill folder [5m]
6.14 Create skill.service.ts [30m]
6.15 Add all CRUD methods [45m]
6.16 Create controllers/skill folder [5m]
6.17 Create skill.controller.ts [30m]
6.18 Add all endpoints [45m]
6.19 Create dto/skill/index.ts [15m]
6.20 Add CreateSkillDto, UpdateSkillDto [30m]
6.21 Test mentee endpoints [30m]
6.22 Test skill endpoints [30m]
6.23 Commit both modules to Git [20m]
```

---

## 🗓️ DAY 7: Week 1 Review & Catch-up (5 tasks, ~8 hours)

```
7.1 Review all endpoints work [1h]
7.2 Test register → login → get profile flow [1h]
7.3 Test create mentor profile [30m]
7.4 Test create mentee profile [30m]
7.5 Test skill CRUD operations [30m]
7.6 Fix any bugs found [2h]
7.7 Update README.md with working endpoints [1h]
7.8 Write simple API test documentation [1h]
7.9 Commit Week 1 final code [30m]
7.10 Push to GitHub [15m]
7.11 Move all Week 1 tasks to Done [15m]
7.12 Rest and prepare for Week 2 [30m]
```

---

## 🗓️ DAY 8: Session Module Part 1 (7 tasks, ~8 hours)

```
8.1 Create constants for SessionStatus enum [20m]
8.2 Add PENDING, CONFIRMED, COMPLETED, CANCELLED [15m]
8.3 Create entities/session folder [5m]
8.4 Create session.entity.ts [45m]
8.5 Add mentorId, menteeId columns [15m]
8.6 Add topic, description columns [15m]
8.7 Add scheduledAt, duration columns [15m]
8.8 Add status column with enum [15m]
8.9 Add meetingLink, notes columns [15m]
8.10 Save and verify entity loads [15m]
8.11 Create repositories/session folder [5m]
8.12 Create session.repository.ts [30m]
8.13 Add findById() method [20m]
8.14 Add findByMentorId() method [20m]
8.15 Add findByMenteeId() method [20m]
8.16 Add create() method [20m]
8.17 Add updateStatus() method [20m]
8.18 Create services/session folder [5m]
8.19 Create session.service.ts [30m]
8.20 Inject SessionRepository [10m]
8.21 Create requestSession() method [30m]
8.22 Create getSessions() method [30m]
8.23 Create dto/session/index.ts [15m]
8.24 Add CreateSessionDto [30m]
8.25 Add validation decorators [20m]
8.26 Commit session part 1 [20m]
```

---

## 🗓️ DAY 9: Session Module Part 2 (7 tasks, ~8 hours)

```
9.1 Create controllers/session folder [5m]
9.2 Create session.controller.ts [30m]
9.3 Add @Controller('sessions') [5m]
9.4 Create @Post('request') endpoint [30m]
9.5 Create @Get() endpoint [20m]
9.6 Create @Get(':id') endpoint [20m]
9.7 Create @Patch(':id/approve') endpoint [45m]
9.8 Add mentor ownership check [30m]
9.9 Create @Patch(':id/decline') endpoint [30m]
9.10 Add decline reason handling [20m]
9.11 Create @Patch(':id/complete') endpoint [30m]
9.12 Create @Patch(':id/cancel') endpoint [30m]
9.13 Add status transition validation [45m]
9.14 Test request session flow [1h]
9.15 Test approve session flow [1h]
9.16 Test decline session flow [45m]
9.17 Test complete session flow [45m]
9.18 Fix any bugs [1h]
9.19 Commit session completion [20m]
```

---

## 🗓️ DAY 10: Matching Algorithm (6 tasks, ~8 hours)

```
10.1 Create repositories/matching folder [5m]
10.2 Create matching.repository.ts [30m]
10.3 Add findRecommended() method stub [20m]
10.4 Create services/matching folder [5m]
10.5 Create matching.service.ts [30m]
10.6 Inject repositories [15m]
10.7 Create calculateMatchScore() method [1h]
10.8 Implement skill match calculation (50%) [45m]
10.9 Implement rating calculation (30%) [30m]
10.10 Implement availability calculation (20%) [30m]
10.11 Create getRecommendedMentors() method [45m]
10.12 Add filtering by skill [30m]
10.13 Add sorting by score [20m]
10.14 Create controllers/matching folder [5m]
10.15 Create matching.controller.ts [30m]
10.16 Create @Get('recommended-mentors') endpoint [45m]
10.17 Add @Roles(UserRole.MENTEE) guard [10m]
10.18 Test matching algorithm [1h]
10.19 Create test mentee with interests [30m]
10.20 Create test mentors with skills [30m]
10.21 Verify scores calculate correctly [45m]
10.22 Commit matching module [20m]
```

---

## 🗓️ DAY 11: Feedback Module (7 tasks, ~8 hours)

```
11.1 Create entities/feedback folder [5m]
11.2 Create feedback.entity.ts [45m]
11.3 Add mentorId, menteeId columns [15m]
11.4 Add sessionId column (unique) [15m]
11.5 Add ratingKnowledge (1-5) [10m]
11.6 Add ratingCommunication (1-5) [10m]
11.7 Add ratingHelpfulness (1-5) [10m]
11.8 Add overallRating calculation [20m]
11.9 Add comment column [10m]
11.10 Create repositories/feedback folder [5m]
11.11 Create feedback.repository.ts [30m]
11.12 Add create() method [20m]
11.13 Add findByMentorId() method [20m]
11.14 Add findBySessionId() method [20m]
11.15 Create services/feedback folder [5m]
11.16 Create feedback.service.ts [30m]
11.17 Create submitFeedback() method [45m]
11.18 Add session completed check [30m]
11.19 Add duplicate feedback check [20m]
11.20 Add calculateOverallRating() [20m]
11.21 Create updateMentorRating() [30m]
11.22 Create controllers/feedback folder [5m]
11.23 Create feedback.controller.ts [30m]
11.24 Create @Post() endpoint [30m]
11.25 Create @Get('mentor/:mentorId') endpoint [30m]
11.26 Test feedback submission [1h]
11.27 Verify mentor rating updates [30m]
11.28 Commit feedback module [20m]
```

---

## ️ DAY 12: Admin Dashboard (5 tasks, ~8 hours)

```
12.1 Create services/admin folder [5m]
12.2 Create admin.service.ts [30m]
12.3 Inject UserRepository [10m]
12.4 Inject MentorRepository [10m]
12.5 Inject MenteeRepository [10m]
12.6 Create getDashboardStats() method [1h]
12.7 Add totalUsers count [15m]
12.8 Add totalMentors count [15m]
12.9 Add totalMentees count [15m]
12.10 Add totalSessions count [30m]
12.11 Add sessionsByStatus breakdown [45m]
12.12 Add completionRate calculation [30m]
12.13 Add averagePlatformRating [30m]
12.14 Create controllers/admin folder [5m]
12.15 Create admin.controller.ts [30m]
12.16 Add @Controller('admin') [5m]
12.17 Add @Roles(UserRole.ADMIN) guard [10m]
12.18 Create @Get('dashboard') endpoint [30m]
12.19 Create @Get('users') endpoint [20m]
12.20 Create @Get('mentors') endpoint [20m]
12.21 Create @Get('mentees') endpoint [20m]
12.22 Test admin dashboard [1h]
12.23 Verify all statistics correct [45m]
12.24 Commit admin module [20m]
```

---

## 🗓️ DAY 13: Notifications (6 tasks, ~8 hours)

```
13.1 Create constants for NotificationType [15m]
13.2 Add EMAIL, SMS, PUSH, IN_APP [10m]
13.3 Create entities/notification folder [5m]
13.4 Create notification.entity.ts [45m]
13.5 Add userId, title, message columns [20m]
13.6 Add type, isRead columns [15m]
13.7 Add readAt, actionUrl columns [15m]
13.8 Create repositories/notification folder [5m]
13.9 Create notification.repository.ts [30m]
13.10 Add findByUserId() method [20m]
13.11 Add findUnread() method [20m]
13.12 Add markAsRead() method [20m]
13.13 Create services/notification folder [5m]
13.14 Create notification.service.ts [30m]
13.15 Create findAll() method [20m]
13.16 Create findUnread() method [20m]
13.17 Create markAsRead() method [20m]
13.18 Create createNotification() helper [30m]
13.19 Create controllers/notification folder [5m]
13.20 Create notification.controller.ts [30m]
13.21 Create @Get() endpoint [20m]
13.22 Create @Get('unread') endpoint [20m]
13.23 Create @Put(':id/read') endpoint [20m]
13.24 Test all notification endpoints [1h]
13.25 Commit notifications [20m]
```

---

## 🗓️ DAY 14: Final Testing & Demo Prep (6 tasks, ~8 hours)

```
14.1 Create test data script [1h]
14.2 Seed 5 test users [30m]
14.3 Seed 3 test mentors [30m]
14.4 Seed 2 test mentees [30m]
14.5 Seed 10 test skills [30m]
14.6 Run full API test suite [2h]
14.7 Test: Register → Login → Create Profile [30m]
14.8 Test: Request Session → Approve → Complete [45m]
14.9 Test: Submit Feedback → Check Rating [30m]
14.10 Test: Get Recommended Mentors [30m]
14.11 Test: Admin Dashboard [30m]
14.12 Fix critical bugs only [1h]
14.13 Update README with final API list [1h]
14.14 Create Postman collection [45m]
14.15 Export and save Postman collection [15m]
14.16 Final git commit [30m]
14.17 Push to GitHub [15m]
14.18 Move all tasks to Done [15m]
14.19 Celebrate! 🎉 [30m]
```

---

## ✅ Quick Start Checklist

**RIGHT NOW - Do these 5 tasks:**

```
□ Open GitHub Projects
□ Click "+ Add item" in Todo column
□ Copy task 1.1 and paste
□ Copy task 1.2 and paste
□ Copy task 1.3 and paste
□ Copy task 1.4 and paste
□ Copy task 1.5 and paste
□ Start task 1.1 - Move to In Progress
```

**Don't add all tasks at once!** Add only:
- **Day 1 tasks** today (1.1 to 1.36)
- **Day 2 tasks** tomorrow morning
- And so on...

---

## 📊 Progress Tracking

After each task:
1. ✅ Mark as done in your head
2. 🔄 Move card from **In Progress** → **Done**
3.  Check off in this list
4.  Commit code every 2-3 tasks

---

## 🎯 Daily Goals

| Day | Tasks | Hours | Must Complete |
|-----|-------|-------|---------------|
| 1 | 1.1-1.36 | 8h | Database + Entities ✅ |
| 2 | 2.1-2.29 | 8h | Auth Setup ✅ |
| 3 | 3.1-3.25 | 8h | Auth Endpoints ✅ |
| 4 | 4.1-4.28 | 8h | User Module ✅ |
| 5 | 5.1-5.28 | 8h | Mentor Module ✅ |
| 6 | 6.1-6.23 | 8h | Mentee + Skill ✅ |
| 7 | 7.1-7.12 | 8h | Review & Catch-up ✅ |
| 8 | 8.1-8.26 | 8h | Session Part 1 ✅ |
| 9 | 9.1-9.19 | 8h | Session Part 2 ✅ |
| 10 | 10.1-10.22 | 8h | Matching ✅ |
| 11 | 11.1-11.28 | 8h | Feedback ✅ |
| 12 | 12.1-12.24 | 8h | Admin ✅ |
| 13 | 13.1-13.25 | 8h | Notifications ✅ |
| 14 | 14.1-14.19 | 8h | Final Testing ✅ |

---

**You got this! One small task at a time! 💪**

Start with task **1.1** RIGHT NOW!
