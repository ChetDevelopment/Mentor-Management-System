# MentorKhet — Mentor-Mentee Matching Platform

## Backend System Documentation

**Version:** 1.0.0  
**Tagline:** Find Your Field Mentor  
**Development Timeline:** 2 Weeks  
**Stack:** NestJS + TypeScript + PostgreSQL + TypeORM

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Folder Structure Guide](#folder-structure-guide)
3. [Development Timeline (2 Weeks)](#development-timeline)
4. [Quick Start Guide](#quick-start-guide)
5. [Module Implementation Guide](#module-implementation-guide)
6. [API Endpoints Summary](#api-endpoints-summary)
7. [Database Schema](#database-schema)
8. [Testing Guide](#testing-guide)

---

## 🎯 Project Overview

**MentorKhet** is a backend platform that connects mentees with suitable mentors based on skills, ratings, and availability. The system handles:

- User authentication with JWT
- Mentor/Mentee profile management
- Skill-based matching algorithm
- Session scheduling workflow
- Feedback and rating system
- Admin dashboard analytics

### Core Features (MVP)

| Priority | Feature | Estimated Time |
|----------|---------|----------------|
| P0 | Authentication & Authorization | 2 days |
| P0 | User/Mentor/Mentee Profiles | 2 days |
| P0 | Skill Management | 1 day |
| P0 | Session Request & Approval | 3 days |
| P0 | Matching Algorithm | 2 days |
| P0 | Feedback & Rating | 2 days |
| P1 | Admin Dashboard | 1 day |
| P1 | Notifications | 1 day |
| P2 | Activity Logs | 1 day |

---

## 📁 Folder Structure Guide

```
src/
├── controllers/          # HTTP Request Handlers (Thin layer)
├── services/             # Business Logic Layer
├── repositories/         # Database Access Layer
├── entities/             # Database Table Definitions
├── dto/                  # Data Transfer Objects (Validation)
├── modules/              # NestJS Module Wiring
├── guards/               # Authentication & Authorization
├── decorators/           # Custom Decorators
├── filters/              # Exception Handling
├── interceptors/         # Request/Response Transformation
├── middlewares/          # Request Processing
├── config/               # Configuration Files
├── constants/            # App Constants & Enums
├── common/               # Shared Utilities
├── database/             # Database Configuration
├── app.module.ts         # Root Module
└── main.ts               # Application Entry Point
```

---

### 📂 Detailed Folder Responsibilities

#### `controllers/` — HTTP Request Handlers

**Purpose:** Handle incoming HTTP requests, validate input, call services, return responses.

**Rules:**
- ❌ NO business logic
- ❌ NO direct database calls
- ✅ Only call services
- ✅ Use DTOs for validation
- ✅ Return HTTP responses

**What to create:**
```
controllers/
├── auth/
│   └── auth.controller.ts      # login, register, logout, refresh-token
├── user/
│   └── user.controller.ts      # CRUD users, get profile
├── mentor/
│   └── mentor.controller.ts    # CRUD mentors, get mentors list
├── mentee/
│   └── mentee.controller.ts    # CRUD mentees
├── skill/
│   └── skill.controller.ts     # CRUD skills
├── session/
│   └── session.controller.ts   # request, approve, decline, complete
├── matching/
│   └── matching.controller.ts  # get recommended mentors
├── feedback/
│   └── feedback.controller.ts  # submit feedback, get feedback
├── notification/
│   └── notification.controller.ts  # get notifications, mark as read
├── admin/
│   └── admin.controller.ts     # dashboard stats, manage users
└── activity-log/
    └── activity-log.controller.ts  # view activity logs
```

**Example:**
```typescript
// controllers/session/session.controller.ts
@Controller('sessions')
@UseGuards(AuthGuard)
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Post('request')
  async requestSession(@Body() dto: CreateSessionDto, @User() user: any) {
    return this.sessionService.requestSession(dto, user);
  }

  @Patch(':id/approve')
  async approveSession(@Param('id') id: string, @User() user: any) {
    return this.sessionService.approveSession(id, user);
  }
}
```

---

#### `services/` — Business Logic Layer

**Purpose:** Contain all business rules, calculations, workflows, and orchestration.

**Rules:**
- ✅ All business logic goes here
- ✅ Call repositories for data
- ✅ Handle transactions
- ✅ Validate business rules
- ❌ No HTTP-specific code

**What to create:**
```
services/
├── auth/
│   └── auth.service.ts         # login, register, token generation
├── user/
│   └── user.service.ts         # user CRUD, profile updates
├── mentor/
│   └── mentor.service.ts       # mentor CRUD, rating calculation
├── mentee/
│   └── mentee.service.ts       # mentee CRUD
├── skill/
│   └── skill.service.ts        # skill CRUD
├── session/
│   └── session.service.ts      # session workflow (PENDING→CONFIRMED→COMPLETED)
├── matching/
│   └── matching.service.ts     # matching algorithm (Skill 50% + Rating 30% + Availability 20%)
├── feedback/
│   └── feedback.service.ts     # feedback submission, rating calculation
├── notification/
│   └── notification.service.ts # create notifications, mark as read
├── admin/
│   └── admin.service.ts        # dashboard statistics
└── activity-log/
    └── activity-log.service.ts # log activities
```

**Example:**
```typescript
// services/session/session.service.ts
@Injectable()
export class SessionService {
  async approveSession(sessionId: string, user: any) {
    const session = await this.sessionRepository.findById(sessionId);
    
    // Business rule: Only mentor can approve their session
    if (session.mentorId !== user.userId) {
      throw new ForbiddenException('Not your session');
    }
    
    // Business rule: Only PENDING sessions can be approved
    if (session.status !== SessionStatus.PENDING) {
      throw new BadRequestException('Session not pending');
    }
    
    session.status = SessionStatus.CONFIRMED;
    return this.sessionRepository.update(sessionId, session);
  }
}
```

---

#### `repositories/` — Database Access Layer

**Purpose:** Handle all database operations using TypeORM.

**Rules:**
- ✅ Only database queries
- ✅ Use TypeORM Repository
- ✅ No business logic
- ✅ Return entities or null

**What to create:**
```
repositories/
├── auth/
│   └── auth.repository.ts      # find token, save token, deactivate token
├── user/
│   └── user.repository.ts      # find user, create user, update user
├── mentor/
│   └── mentor.repository.ts    # find mentor, update mentor stats
├── mentee/
│   └── mentee.repository.ts    # find mentee
├── skill/
│   └── skill.repository.ts     # find skills
├── session/
│   └── session.repository.ts   # find sessions, update session status
├── matching/
│   └── matching.repository.ts  # find matchings
├── feedback/
│   └── feedback.repository.ts  # find feedback, calculate average rating
├── notification/
│   └── notification.repository.ts  # find notifications
└── activity-log/
    └── activity-log.repository.ts  # log activities
```

**Example:**
```typescript
// repositories/session/session.repository.ts
@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(Session)
    private repository: Repository<Session>,
  ) {}

  async findById(id: string): Promise<Session | null> {
    return this.repository.findOne({ 
      where: { id },
      relations: ['mentor', 'mentee'],
    });
  }

  async updateStatus(id: string, status: SessionStatus): Promise<Session> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  async findByMentorId(mentorId: string): Promise<Session[]> {
    return this.repository.find({ where: { mentorId } });
  }
}
```

---

#### `entities/` — Database Table Definitions

**Purpose:** Define database tables using TypeORM decorators.

**What to create:**
```
entities/
├── user/
│   └── user.entity.ts          # users table
├── auth/
│   └── auth-token.entity.ts    # auth_tokens table (JWT blacklist/refresh)
├── mentor/
│   └── mentor.entity.ts        # mentors table
├── mentee/
│   └── mentee.entity.ts        # mentees table
├── skill/
│   └── skill.entity.ts         # skills table
├── session/
│   └── session.entity.ts       # sessions table
├── matching/
│   └── matching.entity.ts      # matchings table
├── feedback/
│   └── feedback.entity.ts      # feedback table
├── notification/
│   └── notification.entity.ts  # notifications table
└── activity-log/
    └── activity-log.entity.ts  # activity_logs table
```

**Example:**
```typescript
// entities/session/session.entity.ts
@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mentorId: string;

  @Column()
  menteeId: string;

  @Column()
  topic: string;

  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.PENDING })
  status: SessionStatus;

  @Column()
  scheduledAt: Date;

  @Column({ nullable: true })
  meetingLink: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

#### `dto/` — Data Transfer Objects

**Purpose:** Define request/response shapes with validation using `class-validator`.

**What to create:**
```
dto/
├── auth/
│   ├── login.dto.ts            # email, password
│   ├── register.dto.ts         # email, password, fullName, role
│   ├── forgot-password.dto.ts  # email
│   └── reset-password.dto.ts   # token, newPassword
├── user/
│   └── index.ts                # CreateUserDto, UpdateUserDto
├── mentor/
│   └── index.ts                # CreateMentorDto, UpdateMentorDto, AddSkillDto
├── mentee/
│   └── index.ts                # CreateMenteeDto, UpdateMenteeDto, AddInterestDto
├── skill/
│   └── index.ts                # CreateSkillDto, UpdateSkillDto
├── session/
│   └── index.ts                # CreateSessionDto, UpdateSessionDto, ApproveDto
├── matching/
│   └── index.ts                # MatchingFilterDto
├── feedback/
│   └── index.ts                # CreateFeedbackDto, UpdateFeedbackDto
├── notification/
│   └── index.ts                # CreateNotificationDto
└── activity-log/
    └── index.ts                # CreateActivityLogDto
```

**Example:**
```typescript
// dto/session/index.ts
export class CreateSessionDto {
  @IsUUID()
  @IsNotEmpty()
  mentorId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  topic: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string;

  @IsInt()
  @Min(15)
  @Max(180)
  @IsOptional()
  durationMinutes?: number = 60;

  @IsString()
  @IsOptional()
  message?: string;
}
```

---

#### `modules/` — NestJS Module Wiring

**Purpose:** Wire controllers, services, repositories, and entities together.

**What to create:**
```
modules/
├── auth/
│   └── auth.module.ts          # imports UserModule, JwtModule
├── user/
│   └── user.module.ts          # imports TypeOrmModule.forFeature([User])
├── mentor/
│   └── mentor.module.ts
├── mentee/
│   └── mentee.module.ts
├── skill/
│   └── skill.module.ts
├── session/
│   └── session.module.ts
├── matching/
│   └── matching.module.ts
├── feedback/
│   └── feedback.module.ts
├── notification/
│   └── notification.module.ts
├── admin/
│   └── admin.module.ts
├── activity-log/
│   └── activity-log.module.ts
└── auth/
    └── auth.module.ts
```

**Example:**
```typescript
// modules/session/session.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  controllers: [SessionController],
  providers: [SessionService, SessionRepository],
  exports: [SessionService],
})
export class SessionModule {}
```

---

#### `guards/` — Authentication & Authorization

**Purpose:** Protect routes with JWT validation and role-based access control.

**Files:**
```
guards/
├── auth.guard.ts               # Validate JWT token
└── roles.guard.ts              # Check user role (ADMIN, MENTOR, MENTEE)
```

**Usage:**
```typescript
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Get('dashboard')
async getDashboard() {
  // Only ADMIN can access
}
```

---

#### `decorators/` — Custom Decorators

**Purpose:** Create reusable decorators for routes and parameters.

**Files:**
```
decorators/
├── public.decorator.ts         # @Public() - Skip auth for this route
├── roles.decorator.ts          # @Roles() - Set required roles
└── user.decorator.ts           # @User() - Get current user from request
```

---

#### `filters/` — Exception Handling

**Purpose:** Global error handling and consistent error responses.

**Files:**
```
filters/
└── http-exception.filter.ts    # Catch all exceptions, format response
```

**Response Format:**
```json
{
  "success": false,
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "timestamp": "2026-05-22T08:00:00.000Z",
  "path": "/api/v1/sessions/request"
}
```

---

#### `interceptors/` — Request/Response Transformation

**Purpose:** Transform responses, add logging, handle pagination.

**Files:**
```
interceptors/
├── logging.interceptor.ts      # Log request/response
├── transform.interceptor.ts    # Wrap response in standard format
└── pagination.interceptor.ts   # Add pagination metadata
```

---

#### `config/` — Configuration

**Purpose:** Store application configuration.

**Files:**
```
config/
└── index.ts                    # databaseConfig, jwtConfig, appConfig
```

**Usage:**
```typescript
export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '15m',
};
```

---

#### `constants/` — App Constants

**Purpose:** Store enums and constants used across the app.

**Files:**
```
constants/
└── index.ts                    # UserRole, SessionStatus, MatchingStatus, etc.
```

**Enums:**
```typescript
export enum UserRole {
  ADMIN = 'admin',
  MENTOR = 'mentor',
  MENTEE = 'mentee',
}

export enum SessionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum MatchingStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}
```

---

#### `common/` — Shared Utilities

**Purpose:** Shared helper functions.

**Files:**
```
common/
└── utils/
    ├── helpers.ts              # formatDate, generateSlug, paginate
    └── validation.ts           # validateEmail, validatePassword
```

---

#### `database/` — Database Configuration

**Purpose:** Configure TypeORM and database connection.

**Files:**
```
database/
└── database.module.ts          # TypeORM.forRoot configuration
```

---

## 📅 Development Timeline (2 Weeks)

### Week 1: Core Foundation

| Day | Task | Deliverables |
|-----|------|--------------|
| **Day 1** | Project Setup | ✅ Folder structure, ✅ package.json, ✅ .env, ✅ Database connection |
| **Day 2** | Auth Module | ✅ Register, ✅ Login, ✅ JWT guards, ✅ Roles guard |
| **Day 3** | User Module | ✅ User entity, ✅ User repository, ✅ User service, ✅ Profile CRUD |
| **Day 4** | Mentor Module | ✅ Mentor entity, ✅ Add skills, ✅ Mentor CRUD |
| **Day 5** | Mentee Module | ✅ Mentee entity, ✅ Add interests, ✅ Mentee CRUD |
| **Day 6** | Skill Module | ✅ Skill entity, ✅ Skill CRUD, ✅ Categories |
| **Day 7** | Catch-up & Testing | ✅ Test all Week 1 features, ✅ Fix bugs |

### Week 2: Core Features

| Day | Task | Deliverables |
|-----|------|--------------|
| **Day 8** | Session Module | ✅ Session entity, ✅ Request session, ✅ Approve/Decline |
| **Day 9** | Session Workflow | ✅ Complete session, ✅ Cancel session, ✅ Status transitions |
| **Day 10** | Matching Algorithm | ✅ Matching service, ✅ Score calculation, ✅ Recommendations |
| **Day 11** | Feedback Module | ✅ Feedback entity, ✅ Submit feedback, ✅ Rating calculation |
| **Day 12** | Admin Dashboard | ✅ Dashboard stats, ✅ User management, ✅ Activity logs |
| **Day 13** | Notifications | ✅ Notification entity, ✅ Create notifications, ✅ Mark as read |
| **Day 14** | Final Testing & Docs | ✅ API testing, ✅ Swagger docs, ✅ README, ✅ Demo prep |

---

## 🚀 Quick Start Guide

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

```bash
# .env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=mentorkhet

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=15m

BCRYPT_ROUNDS=12
```

### 3. Start PostgreSQL

```bash
# Using Docker
docker run --name mentorkhet-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=mentorkhet -p 5432:5432 -d postgres:15

# Or install PostgreSQL locally
```

### 4. Run Database Migrations

```bash
# If using TypeORM migrations
npm run migration:run

# Or let TypeORM sync (development only)
# synchronize: true in database.module.ts
```

### 5. Start Development Server

```bash
npm run start:dev
```

### 6. Access API

```
Base URL: http://localhost:3000/api
Swagger: http://localhost:3000/api/docs (if enabled)
```

---

## 📡 API Endpoints Summary

### Authentication

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/auth/register` | ❌ | - | Register new user |
| POST | `/auth/login` | ❌ | - | Login and get tokens |
| POST | `/auth/logout` | ✅ | - | Logout |
| POST | `/auth/refresh-token` | ✅ | - | Refresh access token |
| POST | `/auth/forgot-password` | ❌ | - | Request password reset |
| POST | `/auth/reset-password` | ❌ | - | Reset password |

### User

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/users/profile` | ✅ | - | Get own profile |
| PUT | `/users/profile` | ✅ | - | Update own profile |
| GET | `/users` | ✅ | ADMIN | Get all users |
| GET | `/users/:id` | ✅ | ADMIN | Get user by ID |
| PUT | `/users/:id` | ✅ | ADMIN | Update user |
| DELETE | `/users/:id` | ✅ | ADMIN | Delete user |

### Mentor

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/mentors` | ✅ | - | Get all mentors |
| GET | `/mentors/:id` | ✅ | - | Get mentor by ID |
| GET | `/mentors/me` | ✅ | MENTOR | Get own mentor profile |
| PUT | `/mentors/me` | ✅ | MENTOR | Update own profile |
| POST | `/mentors/me/skills` | ✅ | MENTOR | Add skill to profile |
| DELETE | `/mentors/me/skills/:skillId` | ✅ | MENTOR | Remove skill |

### Mentee

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/mentees/me` | ✅ | MENTEE | Get own mentee profile |
| PUT | `/mentees/me` | ✅ | MENTEE | Update own profile |
| POST | `/mentees/me/interests` | ✅ | MENTEE | Add interest |
| DELETE | `/mentees/me/interests/:skillId` | ✅ | MENTEE | Remove interest |

### Skill

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/skills` | ✅ | - | Get all skills |
| GET | `/skills/:id` | ✅ | - | Get skill by ID |
| POST | `/skills` | ✅ | ADMIN | Create skill |
| PUT | `/skills/:id` | ✅ | ADMIN | Update skill |
| DELETE | `/skills/:id` | ✅ | ADMIN | Delete skill |

### Session

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/sessions/request` | ✅ | MENTEE | Request session |
| GET | `/sessions` | ✅ | - | Get own sessions |
| GET | `/sessions/:id` | ✅ | - | Get session by ID |
| PATCH | `/sessions/:id/approve` | ✅ | MENTOR | Approve session |
| PATCH | `/sessions/:id/decline` | ✅ | MENTOR | Decline session |
| PATCH | `/sessions/:id/complete` | ✅ | MENTOR/MENTEE | Complete session |
| PATCH | `/sessions/:id/cancel` | ✅ | MENTOR/MENTEE | Cancel session |

### Matching

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/matching/recommended-mentors` | ✅ | MENTEE | Get recommended mentors |
| GET | `/matching/score/:mentorId` | ✅ | MENTEE | Get match score for mentor |

### Feedback

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/feedback` | ✅ | MENTEE | Submit feedback |
| GET | `/feedback` | ✅ | - | Get own feedback |
| GET | `/feedback/mentor/:mentorId` | ✅ | - | Get mentor feedback |
| GET | `/feedback/session/:sessionId` | ✅ | - | Get session feedback |
| PUT | `/feedback/:id` | ✅ | MENTOR | Respond to feedback |

### Notification

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/notifications` | ✅ | - | Get own notifications |
| GET | `/notifications/unread` | ✅ | - | Get unread count |
| PUT | `/notifications/:id/read` | ✅ | - | Mark as read |
| DELETE | `/notifications/:id` | ✅ | - | Delete notification |

### Admin

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/admin/dashboard` | ✅ | ADMIN | Get dashboard stats |
| GET | `/admin/users` | ✅ | ADMIN | Get all users |
| GET | `/admin/mentors` | ✅ | ADMIN | Get all mentors |
| GET | `/admin/mentees` | ✅ | ADMIN | Get all mentees |
| POST | `/admin/users/:id/deactivate` | ✅ | ADMIN | Deactivate user |
| DELETE | `/admin/users/:id` | ✅ | ADMIN | Delete user |
| GET | `/admin/activity-logs` | ✅ | ADMIN | Get activity logs |

---

## 🗄️ Database Schema

### Entity Relationships

```
User (1) ── (1) Mentor
User (1) ── (1) Mentee
Mentor (1) ── (M) Session
Mentee (1) ── (M) Session
Session (1) ── (1) Feedback
Mentor (1) ── (M) MentorSkill
Mentee (1) ── (M) MenteeInterest
Skill (1) ── (M) MentorSkill
Skill (1) ── (M) MenteeInterest
User (1) ── (M) Notification
User (1) ── (M) ActivityLog
```

### Main Tables

#### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| email | VARCHAR(100) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL |
| firstName | VARCHAR(100) | NOT NULL |
| lastName | VARCHAR(100) | NOT NULL |
| role | ENUM | ADMIN, MENTOR, MENTEE |
| phone | VARCHAR(20) | |
| avatar | VARCHAR(255) | |
| isActive | BOOLEAN | DEFAULT true |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | DEFAULT NOW() |

#### mentors
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| userId | UUID | FOREIGN KEY, UNIQUE |
| title | VARCHAR(100) | |
| company | VARCHAR(100) | |
| bio | TEXT | |
| yearsOfExperience | INT | DEFAULT 0 |
| skills | TEXT[] | |
| rating | DECIMAL(3,2) | DEFAULT 0 |
| totalSessions | INT | DEFAULT 0 |
| isAvailable | BOOLEAN | DEFAULT true |

#### mentees
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| userId | UUID | FOREIGN KEY, UNIQUE |
| occupation | VARCHAR(100) | |
| organization | VARCHAR(100) | |
| goals | TEXT | |
| interests | TEXT[] | |
| isActive | BOOLEAN | DEFAULT true |

#### sessions
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| mentorId | UUID | FOREIGN KEY |
| menteeId | UUID | FOREIGN KEY |
| title | VARCHAR(200) | NOT NULL |
| description | TEXT | |
| scheduledAt | TIMESTAMP | NOT NULL |
| duration | INT | DEFAULT 60 |
| status | ENUM | PENDING, CONFIRMED, COMPLETED, CANCELLED |
| meetingLink | VARCHAR(255) | |
| notes | TEXT | |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | DEFAULT NOW() |

#### feedback
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| mentorId | UUID | FOREIGN KEY |
| menteeId | UUID | FOREIGN KEY |
| sessionId | UUID | FOREIGN KEY, UNIQUE |
| rating | INT | 1-5 |
| comment | TEXT | |
| isAnonymous | BOOLEAN | DEFAULT false |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | DEFAULT NOW() |

#### skills
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| name | VARCHAR(100) | UNIQUE, NOT NULL |
| description | TEXT | |
| category | VARCHAR(50) | TECHNICAL, SOFT_SKILLS, BUSINESS, CREATIVE |
| isActive | BOOLEAN | DEFAULT true |

#### notifications
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| userId | UUID | FOREIGN KEY |
| title | VARCHAR(200) | NOT NULL |
| message | TEXT | NOT NULL |
| type | ENUM | EMAIL, SMS, PUSH, IN_APP |
| isRead | BOOLEAN | DEFAULT false |
| readAt | TIMESTAMP | |
| actionUrl | VARCHAR(255) | |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | DEFAULT NOW() |

#### activity_logs
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| userId | UUID | FOREIGN KEY |
| action | ENUM | CREATE, UPDATE, DELETE, VIEW |
| entity | VARCHAR(100) | NOT NULL |
| entityId | UUID | NOT NULL |
| description | TEXT | |
| ipAddress | VARCHAR(50) | |
| userAgent | TEXT | |
| createdAt | TIMESTAMP | DEFAULT NOW() |

---

## 🧪 Testing Guide

### Unit Testing (Services)

```typescript
// services/matching/matching.service.spec.ts
describe('MatchingService', () => {
  let service: MatchingService;
  let repository: MatchingRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MatchingService, MatchingRepository],
    }).compile();

    service = module.get(MatchingService);
    repository = module.get(MatchingRepository);
  });

  it('should calculate match score correctly', async () => {
    const menteeInterests = ['JavaScript', 'Node.js'];
    const mentorSkills = ['JavaScript', 'React'];
    
    const score = service.calculateMatchScore(menteeInterests, mentorSkills);
    
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
```

### Integration Testing (API)

```typescript
// sessions.e2e-spec.ts
describe('Sessions (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/sessions/request (POST)', () => {
    return request(app.getHttpServer())
      .post('/sessions/request')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        mentorId: 'uuid',
        topic: 'Career advice',
        scheduledAt: '2026-05-25T14:00:00.000Z',
      })
      .expect(201);
  });
});
```

### Test Commands

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:cov

# Run specific test file
npm run test -- matching.service.spec.ts

# Run e2e tests
npm run test:e2e
```

---

## 🔐 Security Checklist

- [ ] All passwords hashed with bcrypt (12 rounds)
- [ ] JWT access tokens expire in 15 minutes
- [ ] JWT refresh tokens expire in 7 days
- [ ] Role-based access control on all protected routes
- [ ] Input validation on all DTOs
- [ ] SQL injection protection (TypeORM parameterized queries)
- [ ] CORS configured properly
- [ ] Rate limiting on auth endpoints
- [ ] HTTPS in production
- [ ] Environment variables for secrets
- [ ] No secrets in GitHub

---

## 📊 Matching Algorithm

### Score Calculation Formula

```
Match Score = (Skill Match × 50%) + (Rating × 30%) + (Availability × 20%)
```

### Implementation

```typescript
// services/matching/matching.service.ts
calculateMatchScore(menteeInterests: string[], mentorSkills: string[]): number {
  // Skill Match (50%)
  const matchingSkills = menteeInterests.filter(skill => 
    mentorSkills.includes(skill)
  );
  const skillScore = (matchingSkills.length / menteeInterests.length) * 50;

  // Rating Score (30%)
  const ratingScore = (mentor.rating / 5) * 30;

  // Availability Score (20%)
  const availabilityScore = mentor.isAvailable ? 20 : 0;

  return skillScore + ratingScore + availabilityScore;
}
```

---

## 🎯 MVP Priority Checklist

### Must Have (Week 1-2)

- [ ] User registration and login
- [ ] JWT authentication
- [ ] Role-based access (ADMIN, MENTOR, MENTEE)
- [ ] Mentor profile with skills
- [ ] Mentee profile with interests
- [ ] Skill management
- [ ] Session request workflow
- [ ] Session approve/decline
- [ ] Session complete
- [ ] Matching recommendations
- [ ] Feedback and rating
- [ ] Admin dashboard

### Nice to Have (After MVP)

- [ ] Email notifications
- [ ] Password reset
- [ ] Activity logs
- [ ] Notification system
- [ ] PDF reports
- [ ] Calendar integration

---

## 🆘 Common Issues & Solutions

### Issue: Database Connection Failed
```bash
# Solution: Check PostgreSQL is running
docker ps | grep postgres

# Restart if needed
docker restart mentorkhet-db
```

### Issue: JWT Token Invalid
```typescript
// Solution: Check JWT_SECRET matches in .env and config
console.log(process.env.JWT_SECRET);
```

### Issue: TypeORM Entities Not Loading
```typescript
// Solution: Check entities are imported in module
@Module({
  imports: [TypeOrmModule.forFeature([User, Mentor, Mentee])],
})
```

### Issue: Circular Dependency
```typescript
// Solution: Use forwardRef
@Module({
  imports: [forwardRef(() => UserModule)],
})
```

---

## 📞 Support

For questions or issues during development:

1. Check this README first
2. Review the requirements document
3. Check NestJS documentation: https://docs.nestjs.com
4. Check TypeORM documentation: https://typeorm.io

---

**Good luck with your 2-week sprint! 🚀**
