import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('MentorKhet API — Full QA Test Suite', () => {
  let app: INestApplication;
  let adminToken: string;
  let mentorToken: string;
  let menteeToken: string;
  let createdUserId: string;
  let createdMentorId: string;
  let createdMenteeId: string;
  let createdSkillId: string;
  let createdCategoryId: string;
  let createdSessionId: string;
  let createdFeedbackId: string;
  let createdNotificationId: string;
  let createdMatchingId: string;
  let createdResourceId: string;
  let createdAvailabilityId: string;
  let createdActivityLogId: string;
  let resetToken: string;

  const testAdmin = {
    email: `qa_admin_${Date.now()}@test.com`,
    password: 'TestPass123!',
    firstName: 'QA',
    lastName: 'Admin',
    role: 'admin',
  };

  const testMentor = {
    email: `qa_mentor_${Date.now()}@test.com`,
    password: 'TestPass123!',
    firstName: 'QA',
    lastName: 'Mentor',
    role: 'mentor',
  };

  const testMentee = {
    email: `qa_mentee_${Date.now()}@test.com`,
    password: 'TestPass123!',
    firstName: 'QA',
    lastName: 'Mentee',
    role: 'mentee',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ==========================================================================
  // 1. AUTH — Registration, Login, Password Reset
  // ==========================================================================
  describe('[AUTH] Registration & Authentication', () => {
    // 1.1 POSITIVE: Register admin user
    it('POST /auth/register — should register admin', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testAdmin)
        .expect(201);

      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(testAdmin.email);
      expect(res.body.user.role).toBe('admin');
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      adminToken = res.body.accessToken;
    });

    // 1.2 POSITIVE: Register mentor
    it('POST /auth/register — should register mentor', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testMentor)
        .expect(201);

      expect(res.body.user.role).toBe('mentor');
      expect(res.body).toHaveProperty('accessToken');
      mentorToken = res.body.accessToken;
    });

    // 1.3 POSITIVE: Register mentee
    it('POST /auth/register — should register mentee', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testMentee)
        .expect(201);

      expect(res.body.user.role).toBe('mentee');
      expect(res.body).toHaveProperty('accessToken');
      menteeToken = res.body.accessToken;
    });

    // 1.4 NEGATIVE: Register with duplicate email
    it('POST /auth/register — should reject duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testAdmin)
        .expect(400);
    });

    // 1.5 NEGATIVE: Register with missing fields
    it('POST /auth/register — should reject missing required fields', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: 'incomplete@test.com' })
        .expect(400);

      expect(res.body.message).toBeDefined();
    });

    // 1.6 NEGATIVE: Register with weak password
    it('POST /auth/register — should reject weak password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'weak@test.com',
          password: '123',
          firstName: 'Weak',
          lastName: 'Pass',
          role: 'mentee',
        })
        .expect(400);
    });

    // 1.7 NEGATIVE: Register with invalid email
    it('POST /auth/register — should reject invalid email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'not-an-email',
          password: 'TestPass123!',
          firstName: 'Bad',
          lastName: 'Email',
          role: 'mentee',
        })
        .expect(400);
    });

    // 1.8 POSITIVE: Login
    it('POST /auth/login — should login successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testAdmin.email, password: testAdmin.password })
        .expect(201);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user.email).toBe(testAdmin.email);
      adminToken = res.body.accessToken;
    });

    // 1.9 NEGATIVE: Login with wrong password
    it('POST /auth/login — should reject wrong password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testAdmin.email, password: 'WrongPassword!' })
        .expect(401);
    });

    // 1.10 NEGATIVE: Login with non-existent email
    it('POST /auth/login — should reject non-existent email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'nonexistent@test.com', password: 'TestPass123!' })
        .expect(401);
    });

    // 1.11 NEGATIVE: Login with missing fields
    it('POST /auth/login — should reject missing password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testAdmin.email })
        .expect(400);
    });

    // 1.12 POSITIVE: Forgot password generates token
    it('POST /auth/forgot-password — should generate reset token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/forgot-password')
        .send({ email: testAdmin.email })
        .expect(201);

      expect(res.body).toHaveProperty('resetToken');
      resetToken = res.body.resetToken;
    });

    // 1.13 NEGATIVE: Forgot password with non-existent email
    it('POST /auth/forgot-password — should reject non-existent email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/forgot-password')
        .send({ email: 'ghost@test.com' })
        .expect(400);
    });

    // 1.14 POSITIVE: Reset password with valid token
    it('POST /auth/reset-password — should reset password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/reset-password')
        .send({ token: resetToken, password: 'NewPass123!' })
        .expect(201);
    });

    // 1.15 POSITIVE: Login with new password
    it('POST /auth/login — should login with new password after reset', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testAdmin.email, password: 'NewPass123!' })
        .expect(201);

      adminToken = res.body.accessToken;
    });

    // 1.16 NEGATIVE: Reset password with invalid token
    it('POST /auth/reset-password — should reject invalid token', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/reset-password')
        .send({ token: 'invalid-token-123', password: 'NewPass123!' })
        .expect(400);
    });

    // 1.17 NEGATIVE: Reset password with short password
    it('POST /auth/reset-password — should reject weak password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/reset-password')
        .send({ token: resetToken, password: '123' })
        .expect(400);
    });

    // 1.18 POSITIVE: Logout
    it('POST /auth/logout — should logout successfully', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201);
    });

    // 1.19 NEGATIVE: Access protected route after logout (token still valid technically, but check behavior)
    it('POST /auth/refresh-token — should work with valid token after logout', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/refresh-token')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201);

      if (res.body.accessToken) {
        adminToken = res.body.accessToken;
      }
    });
  });

  // ==========================================================================
  // 2. AUTH GUARD — Global protection tests
  // ==========================================================================
  describe('[AUTH GUARD] Route Protection', () => {
    // 2.1 NEGATIVE: Access without token
    it('GET /api/users/profile — should reject without token', async () => {
      await request(app.getHttpServer())
        .get('/api/users/profile')
        .expect(401);
    });

    // 2.2 NEGATIVE: Access with malformed token
    it('GET /api/users/profile — should reject malformed token', async () => {
      await request(app.getHttpServer())
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    // 2.3 NEGATIVE: Access with empty token
    it('GET /api/users/profile — should reject empty Bearer', async () => {
      await request(app.getHttpServer())
        .get('/api/users/profile')
        .set('Authorization', 'Bearer ')
        .expect(401);
    });

    // 2.4 NEGATIVE: Access without Authorization header
    it('GET /api/sessions — should reject without token', async () => {
      await request(app.getHttpServer())
        .get('/api/sessions')
        .expect(401);
    });

    // 2.5 NEGATIVE: Admin-only route accessed by mentee
    it('GET /api/admin/dashboard — should reject non-admin', async () => {
      await request(app.getHttpServer())
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${menteeToken}`)
        .expect(403);
    });

    // 2.6 POSITIVE: Public route works without token
    it('GET /api/skills — public route should work without token', async () => {
      await request(app.getHttpServer())
        .get('/api/skills')
        .expect(200);
    });
  });

  // ==========================================================================
  // 3. USERS — Profile & Admin CRUD
  // ==========================================================================
  describe('[USERS] Profile & CRUD', () => {
    // 3.1 POSITIVE: Get own profile
    it('GET /api/users/profile — should get own profile', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ userId: '' })  // user controller reads from body
        .expect(200);

      expect(res.body).toHaveProperty('email');
      createdUserId = res.body.id;
    });

    // 3.2 POSITIVE: Update own profile
    it('PUT /api/users/profile — should update own profile', async () => {
      await request(app.getHttpServer())
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ userId: createdUserId, firstName: 'UpdatedAdmin' })
        .expect(200);
    });

    // 3.3 NEGATIVE: Update profile without body
    it('PUT /api/users/profile — should reject empty body', async () => {
      await request(app.getHttpServer())
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ userId: createdUserId })
        .expect(400);
    });

    // 3.4 POSITIVE: Admin get all users
    it('GET /api/users — should list all users (admin)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
    });

    // 3.5 POSITIVE: Admin get user by ID
    it('GET /api/users/:id — should get user by ID (admin)', async () => {
      await request(app.getHttpServer())
        .get(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    // 3.6 NEGATIVE: Get non-existent user
    it('GET /api/users/:id — should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .get('/api/users/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    // 3.7 NEGATIVE: Non-admin cannot list users
    it('GET /api/users — should reject non-admin', async () => {
      await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${menteeToken}`)
        .expect(403);
    });
  });

  // ==========================================================================
  // 4. SKILLS — CRUD + Category Filter
  // ==========================================================================
  describe('[SKILLS] CRUD & Categories', () => {
    // 4.1 POSITIVE: List skills (public)
    it('GET /api/skills — should list skills (public)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/skills')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    // 4.2 POSITIVE: Create skill (admin)
    it('POST /api/skills — should create skill (admin)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/skills')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: `QA-Test-Skill-${Date.now()}`, description: 'QA test skill' })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toContain('QA-Test-Skill');
      createdSkillId = res.body.id;
    });

    // 4.3 NEGATIVE: Create skill without name
    it('POST /api/skills — should reject missing name', async () => {
      await request(app.getHttpServer())
        .post('/api/skills')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ description: 'No name' })
        .expect(400);
    });

    // 4.4 NEGATIVE: Non-admin cannot create skill
    it('POST /api/skills — should reject non-admin', async () => {
      await request(app.getHttpServer())
        .post('/api/skills')
        .set('Authorization', `Bearer ${menteeToken}`)
        .send({ name: 'Should-Fail' })
        .expect(403);
    });

    // 4.5 POSITIVE: Get skill by ID (public)
    it('GET /api/skills/:id — should get skill by ID (public)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/skills/${createdSkillId}`)
        .expect(200);

      expect(res.body.id).toBe(createdSkillId);
    });

    // 4.6 NEGATIVE: Get non-existent skill
    it('GET /api/skills/:id — should return 404 for non-existent', async () => {
      await request(app.getHttpServer())
        .get('/api/skills/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    // 4.7 POSITIVE: Update skill (admin)
    it('PUT /api/skills/:id — should update skill (admin)', async () => {
      await request(app.getHttpServer())
        .put(`/api/skills/${createdSkillId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ description: 'Updated description' })
        .expect(200);
    });

    // 4.8 POSITIVE: Delete skill (admin)
    it('DELETE /api/skills/:id — should delete skill (admin)', async () => {
      await request(app.getHttpServer())
        .delete(`/api/skills/${createdSkillId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    // 4.9 NEGATIVE: Get deleted skill
    it('GET /api/skills/:id — should return 404 for deleted skill', async () => {
      await request(app.getHttpServer())
        .get(`/api/skills/${createdSkillId}`)
        .expect(404);
    });
  });

  // ==========================================================================
  // 5. MENTORS — CRUD + Approve/Reject/Suspend
  // ==========================================================================
  describe('[MENTORS] CRUD & Status Management', () => {
    // 5.1 POSITIVE: Create mentor profile
    it('POST /api/mentors — should create mentor profile', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/mentors')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId: '',
          title: 'Senior QA Engineer',
          company: 'TestCorp',
          shortDescription: 'Expert in automation testing',
          fullBio: '10+ years of experience in QA and test automation',
          yearsOfExperience: 10,
          nid: '0000000000',
          phone: '01234567890',
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      createdMentorId = res.body.id;
    });

    // 5.2 NEGATIVE: Create mentor with duplicate NID
    it('POST /api/mentors — should reject duplicate NID', async () => {
      await request(app.getHttpServer())
        .post('/api/mentors')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId: '',
          title: 'Duplicate',
          nid: '0000000000',
          phone: '01234567890',
        })
        .expect(400);
    });

    // 5.3 POSITIVE: Get all mentors (public)
    it('GET /api/mentors — should list mentors', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/mentors')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    // 5.4 POSITIVE: Update mentor
    it('PUT /api/mentors/:id — should update mentor', async () => {
      await request(app.getHttpServer())
        .put(`/api/mentors/${createdMentorId}`)
        .send({ title: 'Lead QA Engineer' })
        .expect(200);
    });

    // 5.5 NEGATIVE: Update mentor with invalid phone format
    it('PUT /api/mentors/:id — should reject invalid phone', async () => {
      await request(app.getHttpServer())
        .put(`/api/mentors/${createdMentorId}`)
        .send({ phone: 'invalid-phone' })
        .expect(400);
    });

    // 5.6 POSITIVE: Approve mentor (admin)
    it('POST /api/mentors/:id/approve — should approve mentor (admin)', async () => {
      await request(app.getHttpServer())
        .post(`/api/mentors/${createdMentorId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201);
    });

    // 5.7 NEGATIVE: Non-admin cannot approve mentor
    it('POST /api/mentors/:id/approve — should reject non-admin', async () => {
      await request(app.getHttpServer())
        .post(`/api/mentors/${createdMentorId}/approve`)
        .set('Authorization', `Bearer ${menteeToken}`)
        .expect(403);
    });

    // 5.8 POSITIVE: Reject mentor (admin)
    it('POST /api/mentors/:id/reject — should reject mentor (admin)', async () => {
      await request(app.getHttpServer())
        .post(`/api/mentors/${createdMentorId}/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reason: 'Insufficient qualifications' })
        .expect(201);
    });

    // 5.9 POSITIVE: Suspend mentor (admin)
    it('POST /api/mentors/:id/suspend — should suspend mentor (admin)', async () => {
      await request(app.getHttpServer())
        .post(`/api/mentors/${createdMentorId}/suspend`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201);
    });

    // 5.10 POSITIVE: Delete mentor (admin)
    it('DELETE /api/mentors/:id — should delete mentor (admin)', async () => {
      await request(app.getHttpServer())
        .delete(`/api/mentors/${createdMentorId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  // ==========================================================================
  // 6. MENTEES — CRUD
  // ==========================================================================
  describe('[MENTEES] CRUD', () => {
    // 6.1 POSITIVE: Create mentee profile
    it('POST /api/mentees — should create mentee profile', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/mentees')
        .set('Authorization', `Bearer ${mentorToken}`)
        .send({
          userId: '',
          occupation: 'Student',
          organization: 'Test University',
          goals: 'Learn test automation',
          interests: ['JavaScript', 'TypeScript'],
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      createdMenteeId = res.body.id;
    });

    // 6.2 POSITIVE: Get all mentees
    it('GET /api/mentees — should list mentees', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/mentees')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    // 6.3 POSITIVE: Get mentee by ID
    it('GET /api/mentees/:id — should get mentee by ID', async () => {
      await request(app.getHttpServer())
        .get(`/api/mentees/${createdMenteeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    // 6.4 POSITIVE: Update mentee
    it('PUT /api/mentees/:id — should update mentee', async () => {
      await request(app.getHttpServer())
        .put(`/api/mentees/${createdMenteeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ occupation: 'Junior Developer' })
        .expect(200);
    });

    // 6.5 NEGATIVE: Delete mentee by non-admin
    it('DELETE /api/mentees/:id — should reject non-admin', async () => {
      await request(app.getHttpServer())
        .delete(`/api/mentees/${createdMenteeId}`)
        .set('Authorization', `Bearer ${menteeToken}`)
        .expect(403);
    });

    // 6.6 POSITIVE: Delete mentee (admin)
    it('DELETE /api/mentees/:id — should delete mentee (admin)', async () => {
      await request(app.getHttpServer())
        .delete(`/api/mentees/${createdMenteeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  // ==========================================================================
  // 7. SESSIONS — Full lifecycle
  // ==========================================================================
  describe('[SESSIONS] Full Lifecycle', () => {
    // 7.1 POSITIVE: Create session
    it('POST /api/sessions — should create session', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/sessions')
        .set('Authorization', `Bearer ${menteeToken}`)
        .send({
          mentorId: createdMentorId || 'm1',
          menteeId: createdMenteeId || 'e1',
          title: 'QA Test Session',
          description: 'Testing session creation',
          scheduledAt: new Date(Date.now() + 86400000).toISOString(),
          duration: 60,
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      createdSessionId = res.body.id;
    });

    // 7.2 NEGATIVE: Create session with past date
    it('POST /api/sessions — should reject past date', async () => {
      await request(app.getHttpServer())
        .post('/api/sessions')
        .set('Authorization', `Bearer ${menteeToken}`)
        .send({
          mentorId: 'm1',
          menteeId: 'e1',
          title: 'Past Session',
          scheduledAt: '2020-01-01T00:00:00.000Z',
        })
        .expect(400);
    });

    // 7.3 NEGATIVE: Create session missing required fields
    it('POST /api/sessions — should reject missing fields', async () => {
      await request(app.getHttpServer())
        .post('/api/sessions')
        .set('Authorization', `Bearer ${menteeToken}`)
        .send({ title: 'Incomplete' })
        .expect(400);
    });

    // 7.4 POSITIVE: Get all sessions
    it('GET /api/sessions — should list sessions', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/sessions')
        .set('Authorization', `Bearer ${menteeToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    // 7.5 POSITIVE: Get session by ID
    it('GET /api/sessions/:id — should get session', async () => {
      await request(app.getHttpServer())
        .get(`/api/sessions/${createdSessionId}`)
        .set('Authorization', `Bearer ${menteeToken}`)
        .expect(200);
    });

    // 7.6 POSITIVE: Update session
    it('PUT /api/sessions/:id — should update session', async () => {
      await request(app.getHttpServer())
        .put(`/api/sessions/${createdSessionId}`)
        .set('Authorization', `Bearer ${menteeToken}`)
        .send({ title: 'Updated Session Title' })
        .expect(200);
    });

    // 7.7 NEGATIVE: Accept session by non-mentor
    it('POST /api/sessions/:id/accept — should reject non-mentor', async () => {
      await request(app.getHttpServer())
        .post(`/api/sessions/${createdSessionId}/accept`)
        .set('Authorization', `Bearer ${menteeToken}`)
        .expect(403);
    });

    // 7.8 POSITIVE: Accept session (mentor)
    it('POST /api/sessions/:id/accept — should accept session (mentor)', async () => {
      await request(app.getHttpServer())
        .post(`/api/sessions/${createdSessionId}/accept`)
        .set('Authorization', `Bearer ${mentorToken}`)
        .expect(201);
    });

    // 7.9 NEGATIVE: Decline session by non-mentor
    it('POST /api/sessions/:id/decline — should reject non-mentor', async () => {
      await request(app.getHttpServer())
        .post(`/api/sessions/${createdSessionId}/decline`)
        .set('Authorization', `Bearer ${menteeToken}`)
        .expect(403);
    });

    // 7.10 POSITIVE: Complete session (any authenticated)
    it('POST /api/sessions/:id/complete — should complete session', async () => {
      await request(app.getHttpServer())
        .post(`/api/sessions/${createdSessionId}/complete`)
        .set('Authorization', `Bearer ${mentorToken}`)
        .expect(201);
    });

    // 7.11 POSITIVE: Cancel session
    it('POST /api/sessions/:id/cancel — should cancel session', async () => {
      await request(app.getHttpServer())
        .post(`/api/sessions/${createdSessionId}/cancel`)
        .set('Authorization', `Bearer ${mentorToken}`)
        .expect(201);
    });

    // 7.12 NEGATIVE: Cancel non-existent session
    it('POST /api/sessions/:id/cancel — should reject non-existent', async () => {
      await request(app.getHttpServer())
        .post('/api/sessions/00000000-0000-0000-0000-000000000000/cancel')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  // ==========================================================================
  // 8. MATCHINGS — CRUD
  // ==========================================================================
  describe('[MATCHINGS] CRUD', () => {
    // 8.1 POSITIVE: Create matching (admin)
    it('POST /api/matchings — should create matching (admin)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/matchings')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          mentorId: 'm1',
          menteeId: 'e1',
          reason: 'QA test matching',
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      createdMatchingId = res.body.id;
    });

    // 8.2 NEGATIVE: Create matching by non-admin
    it('POST /api/matchings — should reject non-admin', async () => {
      await request(app.getHttpServer())
        .post('/api/matchings')
        .set('Authorization', `Bearer ${menteeToken}`)
        .send({ mentorId: 'm1', menteeId: 'e1' })
        .expect(403);
    });

    // 8.3 POSITIVE: Get all matchings
    it('GET /api/matchings — should list matchings', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/matchings')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    // 8.4 POSITIVE: Update matching status
    it('PUT /api/matchings/:id — should update matching', async () => {
      await request(app.getHttpServer())
        .put(`/api/matchings/${createdMatchingId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'accepted' })
        .expect(200);
    });

    // 8.5 POSITIVE: Delete matching (admin)
    it('DELETE /api/matchings/:id — should delete matching (admin)', async () => {
      await request(app.getHttpServer())
        .delete(`/api/matchings/${createdMatchingId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  // ==========================================================================
  // 9. FEEDBACK — CRUD
  // ==========================================================================
  describe('[FEEDBACK] CRUD', () => {
    // 9.1 POSITIVE: Submit feedback
    it('POST /api/feedback — should submit feedback', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/feedback')
        .set('Authorization', `Bearer ${menteeToken}`)
        .send({
          mentorId: 'm1',
          menteeId: 'e1',
          rating: 5,
          comment: 'Excellent QA test session!',
          isAnonymous: false,
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      createdFeedbackId = res.body.id;
    });

    // 9.2 NEGATIVE: Submit feedback with invalid rating
    it('POST /api/feedback — should reject rating > 5', async () => {
      await request(app.getHttpServer())
        .post('/api/feedback')
        .set('Authorization', `Bearer ${menteeToken}`)
        .send({
          mentorId: 'm1',
          menteeId: 'e1',
          rating: 10,
        })
        .expect(400);
    });

    // 9.3 NEGATIVE: Submit feedback missing required fields
    it('POST /api/feedback — should reject missing rating', async () => {
      await request(app.getHttpServer())
        .post('/api/feedback')
        .set('Authorization', `Bearer ${menteeToken}`)
        .send({ mentorId: 'm1', menteeId: 'e1' })
        .expect(400);
    });

    // 9.4 POSITIVE: Get all feedback
    it('GET /api/feedback — should list feedback', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/feedback')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    // 9.5 POSITIVE: Get feedback by mentor
    it('GET /api/feedback/mentor/:mentorId — should get feedback by mentor', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/feedback/mentor/m1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    // 9.6 POSITIVE: Update feedback
    it('PUT /api/feedback/:id — should update feedback', async () => {
      await request(app.getHttpServer())
        .put(`/api/feedback/${createdFeedbackId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ rating: 4, comment: 'Updated comment' })
        .expect(200);
    });

    // 9.7 POSITIVE: Delete feedback
    it('DELETE /api/feedback/:id — should delete feedback', async () => {
      await request(app.getHttpServer())
        .delete(`/api/feedback/${createdFeedbackId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  // ==========================================================================
  // 10. NOTIFICATIONS — CRUD
  // ==========================================================================
  describe('[NOTIFICATIONS] CRUD', () => {
    // 10.1 POSITIVE: Create notification (admin)
    it('POST /api/notifications — should create notification (admin)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/notifications')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId: createdUserId,
          title: 'QA Test Notification',
          message: 'This is a test notification from QA',
          type: 'in_app',
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      createdNotificationId = res.body.id;
    });

    // 10.2 NEGATIVE: Create notification by non-admin
    it('POST /api/notifications — should reject non-admin', async () => {
      await request(app.getHttpServer())
        .post('/api/notifications')
        .set('Authorization', `Bearer ${menteeToken}`)
        .send({
          userId: createdUserId,
          title: 'Should Fail',
          message: 'Should not be created',
        })
        .expect(403);
    });

    // 10.3 POSITIVE: Get notifications
    it('GET /api/notifications — should list notifications', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/notifications')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    // 10.4 POSITIVE: Get unread count
    it('GET /api/notifications/unread — should get unread count', async () => {
      await request(app.getHttpServer())
        .get('/api/notifications/unread')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    // 10.5 POSITIVE: Mark as read
    it('PUT /api/notifications/:id/read — should mark as read', async () => {
      await request(app.getHttpServer())
        .put(`/api/notifications/${createdNotificationId}/read`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    // 10.6 POSITIVE: Delete notification
    it('DELETE /api/notifications/:id — should delete notification', async () => {
      await request(app.getHttpServer())
        .delete(`/api/notifications/${createdNotificationId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  // ==========================================================================
  // 11. ADMIN — Dashboard & User Management
  // ==========================================================================
  describe('[ADMIN] Dashboard & Management', () => {
    // 11.1 POSITIVE: Get dashboard stats
    it('GET /api/admin/dashboard — should get dashboard stats', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body).toBeDefined();
    });

    // 11.2 POSITIVE: Admin list users
    it('GET /api/admin/users — should list all users', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    // 11.3 POSITIVE: Admin list mentors
    it('GET /api/admin/mentors — should list all mentors', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admin/mentors')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    // 11.4 POSITIVE: Admin list mentees
    it('GET /api/admin/mentees — should list all mentees', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admin/mentees')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    // 11.5 POSITIVE: Deactivate user
    it('POST /api/admin/users/:id/deactivate — should deactivate user', async () => {
      await request(app.getHttpServer())
        .post(`/api/admin/users/${createdUserId}/deactivate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201);
    });

    // 11.6 NEGATIVE: Non-admin cannot deactivate
    it('POST /api/admin/users/:id/deactivate — should reject non-admin', async () => {
      await request(app.getHttpServer())
        .post(`/api/admin/users/${createdUserId}/deactivate`)
        .set('Authorization', `Bearer ${menteeToken}`)
        .expect(403);
    });

    // 11.7 POSITIVE: Delete user (admin)
    it('DELETE /api/admin/users/:id — should delete user (admin)', async () => {
      await request(app.getHttpServer())
        .delete(`/api/admin/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  // ==========================================================================
  // 12. ACTIVITY LOGS — Admin Access
  // ==========================================================================
  describe('[ACTIVITY LOGS] Admin Access', () => {
    // 12.1 POSITIVE: List activity logs (admin)
    it('GET /api/activity-logs — should list activity logs (admin)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/activity-logs')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    // 12.2 NEGATIVE: Non-admin cannot view logs
    it('GET /api/activity-logs — should reject non-admin', async () => {
      await request(app.getHttpServer())
        .get('/api/activity-logs')
        .set('Authorization', `Bearer ${menteeToken}`)
        .expect(403);
    });
  });

  // ==========================================================================
  // 13. RESOURCES — Mentor Content
  // ==========================================================================
  describe('[RESOURCES] Mentor Content', () => {
    // 13.1 POSITIVE: Create resource (mentor)
    it('POST /api/resources — should create resource (mentor)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/resources')
        .set('Authorization', `Bearer ${mentorToken}`)
        .send({
          mentorId: 'm1',
          title: 'QA Test Resource',
          description: 'A test resource for QA',
          type: 'document',
          fileUrl: 'https://example.com/test.pdf',
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      createdResourceId = res.body.id;
    });

    // 13.2 NEGATIVE: Create resource by mentee
    it('POST /api/resources — should reject non-mentor', async () => {
      await request(app.getHttpServer())
        .post('/api/resources')
        .set('Authorization', `Bearer ${menteeToken}`)
        .send({
          mentorId: 'm1',
          title: 'Should Fail',
          type: 'document',
        })
        .expect(403);
    });

    // 13.3 NEGATIVE: Create resource without title
    it('POST /api/resources — should reject missing title', async () => {
      await request(app.getHttpServer())
        .post('/api/resources')
        .set('Authorization', `Bearer ${mentorToken}`)
        .send({ mentorId: 'm1' })
        .expect(400);
    });

    // 13.4 POSITIVE: Get resources (public)
    it('GET /api/resources/:mentorId — should get resources (public)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/resources/m1')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    // 13.5 POSITIVE: Delete resource (mentor)
    it('DELETE /api/resources/:id — should delete resource (mentor)', async () => {
      await request(app.getHttpServer())
        .delete(`/api/resources/${createdResourceId}`)
        .set('Authorization', `Bearer ${mentorToken}`)
        .expect(200);
    });
  });

  // ==========================================================================
  // 14. AVAILABILITY — Mentor Schedule
  // ==========================================================================
  describe('[AVAILABILITY] Mentor Schedule', () => {
    // 14.1 POSITIVE: Get availability (public)
    it('GET /api/availabilities/:mentorId — should get mentor availability (public)', async () => {
      await request(app.getHttpServer())
        .get('/api/availabilities/m1')
        .expect(200);
    });

    // 14.2 POSITIVE: Get slots by date (public)
    it('GET /api/availabilities/:mentorId/slots — should get slots by date (public)', async () => {
      await request(app.getHttpServer())
        .get('/api/availabilities/m1/slots?date=2026-06-15')
        .expect(200);
    });

    // 14.3 POSITIVE: Set availability (mentor)
    it('POST /api/availabilities — should set availability (mentor)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/availabilities')
        .set('Authorization', `Bearer ${mentorToken}`)
        .send({
          mentorId: 'm1',
          date: '2026-06-15',
          startTime: '09:00',
          endTime: '17:00',
        })
        .expect(201);

      createdAvailabilityId = res.body?.id;
    });

    // 14.4 NEGATIVE: Set availability by non-mentor
    it('POST /api/availabilities — should reject non-mentor', async () => {
      await request(app.getHttpServer())
        .post('/api/availabilities')
        .set('Authorization', `Bearer ${menteeToken}`)
        .send({ mentorId: 'm1', date: '2026-06-15', startTime: '09:00', endTime: '17:00' })
        .expect(403);
    });
  });
});
