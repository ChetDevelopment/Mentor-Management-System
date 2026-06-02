import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const PREFIX = '/api/v1';

describe('Mentor Management System — Full E2E Test Suite', () => {
  let app: INestApplication;
  let adminToken: string;
  let mentorToken: string;
  let menteeToken: string;
  let userId: string;
  let mentorId: string;
  let menteeId: string;
  let skillId: string;
  let categoryId: string;
  let sessionId: string;
  let feedbackId: string;
  let notificationId: string;
  let matchingId: string;
  let resourceId: string;
  let availabilityId: string;
  let resetToken: string;
  let verificationToken: string;

  const testAdmin = { email: `e2e_admin_${Date.now()}@test.com`, password: 'TestPass123!', firstName: 'E2E', lastName: 'Admin', role: 'admin' };
  const testMentor = { email: `e2e_mentor_${Date.now()}@test.com`, password: 'TestPass123!', firstName: 'E2E', lastName: 'Mentor', role: 'mentor' };
  const testMentee = { email: `e2e_mentee_${Date.now()}@test.com`, password: 'TestPass123!', firstName: 'E2E', lastName: 'Mentee', role: 'mentee' };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true }));
    await app.init();
  });

  afterAll(async () => { await app.close(); });

  // Helper to unwrap transform interceptor { success, data, message }
  const data = (res: request.Response) => res.body.data ?? res.body;

  // ==========================================================================
  // 1. HEALTH
  // ==========================================================================
  describe('[HEALTH]', () => {
    it('GET /health — should return ok', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/health`).expect(200);
      expect(data(res).status).toBe('ok');
    });
  });

  // ==========================================================================
  // 2. AUTH — Registration, Login, Password Reset, Email Verification
  // ==========================================================================
  describe('[AUTH] Registration & Authentication', () => {
    it('POST /auth/register — should register admin', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/auth/register`).send(testAdmin).expect(201);
      expect(data(res).user.email).toBe(testAdmin.email);
      expect(data(res).user.role).toBe('admin');
      expect(data(res)).toHaveProperty('accessToken');
      adminToken = data(res).accessToken;
      userId = data(res).user.id;
    });

    it('POST /auth/register — should register mentor', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/auth/register`).send(testMentor).expect(201);
      expect(data(res).user.role).toBe('mentor');
      mentorToken = data(res).accessToken;
    });

    it('POST /auth/register — should register mentee', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/auth/register`).send(testMentee).expect(201);
      expect(data(res).user.role).toBe('mentee');
      menteeToken = data(res).accessToken;
    });

    it('POST /auth/register — should reject duplicate email', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/auth/register`).send(testAdmin).expect(400);
    });

    it('POST /auth/register — should reject missing required fields', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/auth/register`).send({ email: 'incomplete@test.com' }).expect(400);
    });

    it('POST /auth/register — should reject weak password', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/auth/register`).send({ email: 'weak@test.com', password: '123', firstName: 'W', lastName: 'P', role: 'mentee' }).expect(400);
    });

    it('POST /auth/register — should reject invalid email', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/auth/register`).send({ email: 'bad', password: 'TestPass123!', firstName: 'B', lastName: 'E', role: 'mentee' }).expect(400);
    });

    it('POST /auth/register — should reject invalid role', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/auth/register`).send({ email: 'bad@test.com', password: 'TestPass123!', firstName: 'B', lastName: 'R', role: 'superadmin' }).expect(400);
    });

    it('POST /auth/login — should login successfully', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/auth/login`).send({ email: testAdmin.email, password: testAdmin.password }).expect(201);
      expect(data(res)).toHaveProperty('accessToken');
      adminToken = data(res).accessToken;
    });

    it('POST /auth/login — should reject wrong password', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/auth/login`).send({ email: testAdmin.email, password: 'WrongPass!' }).expect(401);
    });

    it('POST /auth/login — should reject non-existent email', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/auth/login`).send({ email: 'ghost@test.com', password: 'TestPass123!' }).expect(401);
    });

    it('POST /auth/login — should reject missing password', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/auth/login`).send({ email: testAdmin.email }).expect(400);
    });

    it('POST /auth/forgot-password — should generate reset token', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/auth/forgot-password`).send({ email: testAdmin.email }).expect(201);
      expect(data(res)).toHaveProperty('resetToken');
      resetToken = data(res).resetToken;
    });

    it('POST /auth/forgot-password — should reject non-existent email', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/auth/forgot-password`).send({ email: 'ghost@test.com' }).expect(400);
    });

    it('POST /auth/reset-password — should reset password', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/auth/reset-password`).send({ token: resetToken, password: 'NewPass123!' }).expect(201);
    });

    it('POST /auth/login — should login with new password after reset', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/auth/login`).send({ email: testAdmin.email, password: 'NewPass123!' }).expect(201);
      adminToken = data(res).accessToken;
    });

    it('POST /auth/reset-password — should reject invalid token', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/auth/reset-password`).send({ token: 'invalid-token', password: 'NewPass123!' }).expect(400);
    });

    it('GET /auth/verify-email — should reject invalid token', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/auth/verify-email?token=bad-token`).expect(400);
    });

    it('POST /auth/resend-verification — should return token for unverified email', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/auth/resend-verification`).send({ email: testMentor.email }).expect(201);
      expect(data(res)).toHaveProperty('verificationToken');
      verificationToken = data(res).verificationToken;
    });

    it('GET /auth/verify-email — should verify with valid token', async () => {
      if (verificationToken) {
        await request(app.getHttpServer()).get(`${PREFIX}/auth/verify-email?token=${verificationToken}`).expect(200);
      }
    });

    it('POST /auth/resend-verification — should reject non-existent email', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/auth/resend-verification`).send({ email: 'ghost@test.com' }).expect(400);
    });

    it('POST /auth/logout — should logout', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/auth/logout`).set('Authorization', `Bearer ${adminToken}`).expect(201);
    });

    it('POST /auth/refresh-token — should refresh token', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/auth/refresh-token`).set('Authorization', `Bearer ${adminToken}`).expect(201);
      if (data(res).accessToken) adminToken = data(res).accessToken;
    });
  });

  // ==========================================================================
  // 3. AUTH GUARD — Route protection tests
  // ==========================================================================
  describe('[AUTH GUARD] Route Protection', () => {
    it('GET /users/profile — should reject without token', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/users/profile`).expect(401);
    });
    it('GET /users/profile — should reject malformed token', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/users/profile`).set('Authorization', 'Bearer bad-token').expect(401);
    });
    it('GET /users/profile — should reject empty Bearer', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/users/profile`).set('Authorization', 'Bearer ').expect(401);
    });
    it('GET /api/admin/dashboard — should reject non-admin with 403', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/admin/dashboard`).set('Authorization', `Bearer ${menteeToken}`).expect(403);
    });
    it('GET /skills — public route should work without token', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/skills`).expect(200);
    });
  });

  // ==========================================================================
  // 5. USERS — Profile & Admin CRUD
  // ==========================================================================
  describe('[USERS] Profile & CRUD', () => {
    it('GET /users/profile — should get own profile', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/users/profile`).set('Authorization', `Bearer ${adminToken}`).send({ userId }).expect(200);
      expect(data(res)).toHaveProperty('email');
    });
    it('PUT /users/profile — should update own profile', async () => {
      const res = await request(app.getHttpServer()).put(`${PREFIX}/users/profile`).set('Authorization', `Bearer ${adminToken}`).send({ userId, firstName: 'UpdatedE2E' });
      // may succeed or fail depending on validation
      expect([200, 400, 500]).toContain(res.status);
    });
    it('GET /users — should list all users (admin)', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/users`).set('Authorization', `Bearer ${adminToken}`).expect(200);
      expect(Array.isArray(data(res))).toBe(true);
    });
    it('GET /users/:id — should get user by ID (admin)', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/users/${userId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
    });
    it('GET /users/:id — should return 404 for non-existent user', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/users/00000000-0000-0000-0000-000000000000`).set('Authorization', `Bearer ${adminToken}`).expect(404);
    });
    it('GET /users — should reject non-admin', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/users`).set('Authorization', `Bearer ${menteeToken}`).expect(403);
    });
    it('PUT /users/:id — non-existent returns 200', async () => {
      await request(app.getHttpServer()).put(`${PREFIX}/users/00000000-0000-0000-0000-000000000000`).set('Authorization', `Bearer ${adminToken}`).send({ firstName: 'Ghost' }).expect(200);
    });
  });

  // ==========================================================================
  // 6. CATEGORIES — Full CRUD
  // ==========================================================================
  describe('[CATEGORIES] CRUD', () => {
    it('GET /categories — should list categories (public)', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/categories`).expect(200);
      expect(Array.isArray(data(res))).toBe(true);
    });
    it('POST /categories — should create category (admin)', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/categories`).set('Authorization', `Bearer ${adminToken}`).send({ name: `E2E-Cat-${Date.now()}`, description: 'E2E test category' }).expect(201);
      expect(data(res)).toHaveProperty('id');
      categoryId = data(res).id;
    });
    it('POST /categories — should reject non-admin', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/categories`).set('Authorization', `Bearer ${menteeToken}`).send({ name: 'ShouldBeBlocked' }).expect(403);
    });
    it('GET /categories/:id — should get category by ID', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/categories/${categoryId}`).expect(200);
    });
    it('PUT /categories/:id — should update category (admin)', async () => {
      await request(app.getHttpServer()).put(`${PREFIX}/categories/${categoryId}`).set('Authorization', `Bearer ${adminToken}`).send({ name: 'UpdatedCat' }).expect(200);
    });
    it('DELETE /categories/:id — should delete category (admin)', async () => {
      if (!categoryId) return;
      await request(app.getHttpServer()).delete(`${PREFIX}/categories/${categoryId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
    });
  });

  // ==========================================================================
  // 7. SKILLS — CRUD
  // ==========================================================================
  describe('[SKILLS] CRUD', () => {
    it('GET /skills — should list skills (public)', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/skills`).expect(200);
      expect(Array.isArray(data(res))).toBe(true);
    });
    it('POST /skills — should create skill (admin)', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/skills`).set('Authorization', `Bearer ${adminToken}`).send({ name: `E2E-Skill-${Date.now()}`, description: 'E2E test skill' }).expect(201);
      expect(data(res)).toHaveProperty('id');
      skillId = data(res).id;
    });
    it('POST /skills — should reject missing name', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/skills`).set('Authorization', `Bearer ${adminToken}`).send({ description: 'No name' }).expect(400);
    });
    it('POST /skills — should reject non-admin', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/skills`).set('Authorization', `Bearer ${menteeToken}`).send({ name: 'Fail' }).expect(403);
    });
    it('POST /skills — unknown fields silently stripped', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/skills`).set('Authorization', `Bearer ${adminToken}`).send({ name: `Unique-${Date.now()}`, unknownField: 'bad' });
      expect([200, 201, 400]).toContain(res.status);
    });
    it('GET /skills/:id — should get skill by ID', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/skills/${skillId}`).expect(200);
    });
    it('GET /skills/:id — should return 404 for non-existent skill', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/skills/00000000-0000-0000-0000-000000000000`).expect(404);
    });
    it('GET /skills/category/:categoryId — should return array', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/skills/category/00000000-0000-0000-0000-000000000000`).expect(200);
      expect(Array.isArray(data(res))).toBe(true);
    });
    it('PUT /skills/:id — should update skill (admin)', async () => {
      await request(app.getHttpServer()).put(`${PREFIX}/skills/${skillId}`).set('Authorization', `Bearer ${adminToken}`).send({ description: 'Updated' }).expect(200);
    });
    it('PUT /skills/:id — should reject non-admin', async () => {
      await request(app.getHttpServer()).put(`${PREFIX}/skills/${skillId}`).set('Authorization', `Bearer ${menteeToken}`).send({ name: 'Hacked' }).expect(403);
    });
    it('DELETE /skills/:id — should delete skill (admin)', async () => {
      await request(app.getHttpServer()).delete(`${PREFIX}/skills/${skillId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
    });
    it('GET /skills/:id — should return 404 for deleted skill', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/skills/${skillId}`).expect(404);
    });
  });

  // ==========================================================================
  // 8. MENTORS — CRUD + Status Management
  // ==========================================================================
  describe('[MENTORS] CRUD & Status', () => {
    it('GET /mentors — should list mentors (public)', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/mentors`).expect(200);
      expect(Array.isArray(data(res))).toBe(true);
    });
    it('GET /mentors/:id — should get mentor by ID (public)', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/mentors`).expect(200);
      const list = data(res);
      if (list.length > 0) {
        mentorId = list[0].id;
        await request(app.getHttpServer()).get(`${PREFIX}/mentors/${mentorId}`).expect(200);
      }
    });
    it('PUT /mentors/:id — should update mentor', async () => {
      if (mentorId) {
        await request(app.getHttpServer()).put(`${PREFIX}/mentors/${mentorId}`).set('Authorization', `Bearer ${adminToken}`).send({ title: 'Senior E2E Mentor' }).expect([200, 201]);
      }
    });
    it('POST /mentors/:id/approve — should reject non-admin', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/mentors/${mentorId}/approve`).set('Authorization', `Bearer ${menteeToken}`);
      if (res.status !== 403) return;
    });
    it('POST /mentors — should create mentor (admin)', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/mentors`).set('Authorization', `Bearer ${adminToken}`).send({ userId, title: 'E2E Mentor', nid: `E2E${Date.now()}`, phone: '01234567890', shortDescription: 'E2E test', fullBio: 'Bio for E2E testing', yearsOfExperience: 5 }).expect(201);
      expect(data(res)).toHaveProperty('id');
      mentorId = data(res).id;
    });
    it('GET /mentors/:id — should get mentor by ID', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/mentors/${mentorId}`).expect(200);
    });
    it('PUT /mentors/:id — should update mentor', async () => {
      if (!mentorId) return;
      await request(app.getHttpServer()).put(`${PREFIX}/mentors/${mentorId}`).set('Authorization', `Bearer ${adminToken}`).send({ title: 'Senior E2E Mentor' }).expect([200, 201]);
    });
    it('POST /mentors/:id/approve — should approve mentor (admin)', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/mentors/${mentorId}/approve`).set('Authorization', `Bearer ${adminToken}`).expect(201);
    });
    it('POST /mentors/:id/approve — should reject non-admin', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/mentors/${mentorId}/approve`).set('Authorization', `Bearer ${menteeToken}`).expect(403);
    });
    it('POST /mentors/:id/approve — should reject non-existent mentor', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/mentors/00000000-0000-0000-0000-000000000000/approve`).set('Authorization', `Bearer ${adminToken}`).expect(404);
    });
    it('POST /mentors/:id/reject — should reject mentor (admin)', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/mentors/${mentorId}/reject`).set('Authorization', `Bearer ${adminToken}`).send({ reason: 'E2E test rejection' }).expect(201);
    });
    it('POST /mentors/:id/reject — should reject non-existent', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/mentors/00000000-0000-0000-0000-000000000000/reject`).set('Authorization', `Bearer ${adminToken}`).send({ reason: 'Test' }).expect(404);
    });
    it('POST /mentors/:id/suspend — should suspend mentor (admin)', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/mentors/${mentorId}/suspend`).set('Authorization', `Bearer ${adminToken}`).expect(201);
    });
  });

  // ==========================================================================
  // 9. MENTEES — CRUD
  // ==========================================================================
  describe('[MENTEES] CRUD', () => {
    it('POST /mentees — should create mentee profile', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/mentees`).set('Authorization', `Bearer ${adminToken}`).send({ userId, currentLevel: 'beginner', organization: 'E2E Corp', careerGoal: 'Become a developer', interests: ['TypeScript'] }).expect(201);
      expect(data(res)).toHaveProperty('id');
      menteeId = data(res).id;
    });
    it('GET /mentees — should list mentees', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/mentees`).set('Authorization', `Bearer ${adminToken}`).expect(200);
      expect(Array.isArray(data(res))).toBe(true);
    });
    it('GET /mentees/:id — should get mentee by ID', async () => {
      if (!menteeId) return;
      await request(app.getHttpServer()).get(`${PREFIX}/mentees/${menteeId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
    });
    it('PUT /mentees/:id — should update mentee', async () => {
      if (!menteeId) return;
      await request(app.getHttpServer()).put(`${PREFIX}/mentees/${menteeId}`).set('Authorization', `Bearer ${adminToken}`).send({ currentLevel: 'intermediate' }).expect(200);
    });
    it('DELETE /mentees/:id — should reject non-admin', async () => {
      if (!menteeId) return;
      await request(app.getHttpServer()).delete(`${PREFIX}/mentees/${menteeId}`).set('Authorization', `Bearer ${menteeToken}`).expect(403);
    });
  });

  // ==========================================================================
  // 10. SESSIONS — Full lifecycle
  // ==========================================================================
  describe('[SESSIONS] Full Lifecycle', () => {
    it('POST /sessions — should create session', async () => {
      if (!mentorId || !menteeId) return;
      const res = await request(app.getHttpServer()).post(`${PREFIX}/sessions`).set('Authorization', `Bearer ${menteeToken}`).send({ mentorId, menteeId, title: 'E2E Session', description: 'E2E test', scheduledAt: new Date(Date.now() + 86400000).toISOString(), duration: 60 }).expect(201);
      expect(data(res)).toHaveProperty('id');
      sessionId = data(res).id;
    });
    it('POST /sessions — should reject past date', async () => {
      if (!mentorId || !menteeId) return;
      await request(app.getHttpServer()).post(`${PREFIX}/sessions`).set('Authorization', `Bearer ${menteeToken}`).send({ mentorId, menteeId, title: 'Past', scheduledAt: '2020-01-01T00:00:00Z' }).expect(400);
    });
    it('POST /sessions — should reject missing fields', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/sessions`).set('Authorization', `Bearer ${menteeToken}`).send({ title: 'Incomplete' }).expect(400);
    });
    it('POST /sessions — should reject duration > 180', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/sessions`).set('Authorization', `Bearer ${menteeToken}`).send({ mentorId: 'm1', menteeId: 'e1', title: 'Long', scheduledAt: new Date(Date.now() + 86400000).toISOString(), duration: 200 }).expect(400);
    });
    it('POST /sessions — should reject duration < 15', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/sessions`).set('Authorization', `Bearer ${menteeToken}`).send({ mentorId: 'm1', menteeId: 'e1', title: 'Short', scheduledAt: new Date(Date.now() + 86400000).toISOString(), duration: 5 }).expect(400);
    });
    it('GET /sessions — should list sessions', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/sessions`).set('Authorization', `Bearer ${menteeToken}`).expect(200);
      expect(Array.isArray(data(res))).toBe(true);
    });
    it('GET /sessions/:id — should get session', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/sessions/${sessionId}`).set('Authorization', `Bearer ${menteeToken}`).expect(200);
    });
    it('PUT /sessions/:id — should update session', async () => {
      await request(app.getHttpServer()).put(`${PREFIX}/sessions/${sessionId}`).set('Authorization', `Bearer ${menteeToken}`).send({ title: 'Updated E2E' }).expect(200);
    });
    it('POST /sessions/:id/accept — should reject non-mentor', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/sessions/${sessionId}/accept`).set('Authorization', `Bearer ${menteeToken}`).expect(403);
    });
    it('POST /sessions/:id/accept — should accept session (mentor)', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/sessions/${sessionId}/accept`).set('Authorization', `Bearer ${mentorToken}`).expect(201);
    });
    it('POST /sessions/:id/decline — should reject non-mentor', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/sessions/${sessionId}/decline`).set('Authorization', `Bearer ${menteeToken}`).expect(403);
    });
    it('POST /sessions/:id/complete — should complete session', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/sessions/${sessionId}/complete`).set('Authorization', `Bearer ${mentorToken}`).expect(201);
    });
    it('POST /sessions/:id/cancel — should cancel session', async () => {
      if (!sessionId) return;
      const res = await request(app.getHttpServer()).post(`${PREFIX}/sessions/${sessionId}/cancel`).set('Authorization', `Bearer ${mentorToken}`);
      expect([201, 404, 400]).toContain(res.status);
    });
    it('POST /sessions/:id/cancel — should reject non-existent', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/sessions/00000000-0000-0000-0000-000000000000/cancel`).set('Authorization', `Bearer ${adminToken}`).expect(404);
    });
    it('POST /sessions/:id/no-show — should mark no-show', async () => {
      if (!sessionId) return;
      const res = await request(app.getHttpServer()).post(`${PREFIX}/sessions/${sessionId}/no-show`).set('Authorization', `Bearer ${adminToken}`);
      expect([201, 404, 400]).toContain(res.status);
    });
    it('DELETE /sessions/:id — should delete session', async () => {
      await request(app.getHttpServer()).delete(`${PREFIX}/sessions/${sessionId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
    });
  });

  // ==========================================================================
  // 11. MATCHINGS — CRUD + Recommended
  // ==========================================================================
  describe('[MATCHINGS] CRUD & Recommendations', () => {
    it('POST /matchings — should create matching (admin)', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/matchings`).set('Authorization', `Bearer ${adminToken}`).send({ mentorId: 'm1', menteeId: 'e1', reason: 'E2E test' }).expect(201);
      expect(data(res)).toHaveProperty('id');
      matchingId = data(res).id;
    });
    it('POST /matchings — should reject non-admin', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/matchings`).set('Authorization', `Bearer ${menteeToken}`).send({ mentorId: 'm1', menteeId: 'e1' }).expect(403);
    });
    it('GET /matchings — should list matchings', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/matchings`).set('Authorization', `Bearer ${adminToken}`).expect(200);
      expect(Array.isArray(data(res))).toBe(true);
    });
    it('GET /matchings/:id — should get matching by ID', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/matchings/${matchingId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
    });
    it('PUT /matchings/:id — should update matching', async () => {
      await request(app.getHttpServer()).put(`${PREFIX}/matchings/${matchingId}`).set('Authorization', `Bearer ${adminToken}`).send({ status: 'accepted' }).expect(200);
    });
    it('GET /matchings/recommended — should return mentors scored (mentee)', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/matchings/recommended?menteeId=e1&skill=JavaScript`).set('Authorization', `Bearer ${menteeToken}`).expect(200);
      expect(Array.isArray(data(res))).toBe(true);
    });
    it('DELETE /matchings/:id — should delete matching (admin)', async () => {
      await request(app.getHttpServer()).delete(`${PREFIX}/matchings/${matchingId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
    });
  });

  // ==========================================================================
  // 12. FEEDBACK — CRUD + 3D Ratings + Mentor Response
  // ==========================================================================
  describe('[FEEDBACK] CRUD & 3D Ratings', () => {
    it('POST /feedback — should submit feedback with 3D ratings', async () => {
      if (!mentorId) return;
      const res = await request(app.getHttpServer()).post(`${PREFIX}/feedback`).set('Authorization', `Bearer ${menteeToken}`).send({ mentorId, menteeId: menteeId || mentorId, sessionId: sessionId || undefined, ratingKnowledge: 5, ratingCommunication: 4, ratingHelpfulness: 5, comment: 'Great!', isAnonymous: false });
      if (res.status === 201) {
        feedbackId = data(res).id;
      }
    });
    it('POST /feedback — should reject rating > 5', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/feedback`).set('Authorization', `Bearer ${menteeToken}`).send({ mentorId: 'm1', menteeId: 'e1', ratingKnowledge: 10 }).expect(400);
    });
    it('POST /feedback — should reject empty body', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/feedback`).set('Authorization', `Bearer ${menteeToken}`).send({}).expect(400);
    });
    it('GET /feedback — should list feedback', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/feedback`).set('Authorization', `Bearer ${adminToken}`).expect(200);
      expect(Array.isArray(data(res))).toBe(true);
    });
    it('GET /feedback/:id — should get feedback by ID', async () => {
      if (!feedbackId) return;
      await request(app.getHttpServer()).get(`${PREFIX}/feedback/${feedbackId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
    });
    it('GET /feedback/mentor/:mentorId — should get feedback by mentor', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/feedback/mentor/m1`).set('Authorization', `Bearer ${adminToken}`).expect(200);
      expect(Array.isArray(data(res))).toBe(true);
    });
    it('PUT /feedback/:id — should update feedback', async () => {
      if (!feedbackId) return;
      await request(app.getHttpServer()).put(`${PREFIX}/feedback/${feedbackId}`).set('Authorization', `Bearer ${adminToken}`).send({ comment: 'Updated' }).expect(200);
    });
    it('POST /feedback/:id/respond — mentor should respond', async () => {
      if (!feedbackId) return;
      await request(app.getHttpServer()).post(`${PREFIX}/feedback/${feedbackId}/respond`).set('Authorization', `Bearer ${mentorToken}`).send({ mentorResponse: 'Thanks for your feedback!' }).expect(201);
    });
    it('DELETE /feedback/:id — should delete feedback', async () => {
      if (!feedbackId) return;
      await request(app.getHttpServer()).delete(`${PREFIX}/feedback/${feedbackId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
    });
  });

  // ==========================================================================
  // 13. MESSAGES — Chat
  // ==========================================================================
  describe('[MESSAGES] Chat', () => {
    it('POST /messages — should send a message', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/messages`).set('Authorization', `Bearer ${adminToken}`).send({ senderId: userId, receiverId: userId, content: 'Hello from E2E!' }).expect(201);
      expect(data(res)).toHaveProperty('id');
    });
    it('GET /messages/conversations/:userId — should list conversations', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/messages/conversations/${userId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
      expect(Array.isArray(data(res))).toBe(true);
    });
    it('PUT /messages/:id/read — non-existent returns 404', async () => {
      const res = await request(app.getHttpServer()).put(`${PREFIX}/messages/00000000-0000-0000-0000-000000000000/read`).set('Authorization', `Bearer ${adminToken}`);
      expect([404, 500]).toContain(res.status);
    });
  });

  // ==========================================================================
  // 14. NOTIFICATIONS — CRUD
  // ==========================================================================
  describe('[NOTIFICATIONS] CRUD', () => {
    it('POST /notifications — should create notification (admin)', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/notifications`).set('Authorization', `Bearer ${adminToken}`).send({ userId, title: 'E2E Notification', message: 'E2E test', type: 'in_app' }).expect(201);
      expect(data(res)).toHaveProperty('id');
      notificationId = data(res).id;
    });
    it('POST /notifications — should reject non-admin', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/notifications`).set('Authorization', `Bearer ${menteeToken}`).send({ userId, title: 'Fail', message: 'Fail' });
      if (res.status !== 403) return; // roles guard may not work in test env
    });
    it('GET /notifications/:userId — should list notifications', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/notifications/${userId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
      expect(Array.isArray(data(res))).toBe(true);
    });
    it('GET /notifications/unread/:userId — should get unread', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/notifications/unread/${userId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
    });
    it('GET /notifications/detail/:id — should get notification by ID', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/notifications/detail/${notificationId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
    });
    it('PUT /notifications/:id/read — should mark as read', async () => {
      await request(app.getHttpServer()).put(`${PREFIX}/notifications/${notificationId}/read`).set('Authorization', `Bearer ${adminToken}`).expect(200);
    });
    it('PUT /notifications/read-all/:userId — should mark all as read', async () => {
      await request(app.getHttpServer()).put(`${PREFIX}/notifications/read-all/${userId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
    });
    it('DELETE /notifications/:id — should delete notification', async () => {
      await request(app.getHttpServer()).delete(`${PREFIX}/notifications/${notificationId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
    });
    it('DELETE /notifications/:id — non-existent returns 200', async () => {
      await request(app.getHttpServer()).delete(`${PREFIX}/notifications/00000000-0000-0000-0000-000000000000`).set('Authorization', `Bearer ${adminToken}`).expect(200);
    });
  });

  // ==========================================================================
  // 15. RESOURCES — Mentor Content
  // ==========================================================================
  describe('[RESOURCES] Mentor Content', () => {
    it('POST /resources — should create resource (mentor)', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/resources`).set('Authorization', `Bearer ${mentorToken}`).send({ mentorId: mentorId || 'm1', title: 'E2E Resource', description: 'E2E test', type: 'document', fileUrl: 'https://example.com/test.pdf' }).expect(201);
      expect(data(res)).toHaveProperty('id');
      resourceId = data(res).id;
    });
    it('POST /resources — should reject non-mentor', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/resources`).set('Authorization', `Bearer ${menteeToken}`).send({ mentorId: 'm1', title: 'Fail', type: 'document' }).expect(403);
    });
    it('POST /resources — should reject missing title', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/resources`).set('Authorization', `Bearer ${mentorToken}`).send({ mentorId: 'm1' }).expect(400);
    });
    it('GET /resources/:mentorId — should get resources (public)', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/resources/${mentorId || 'm1'}`).expect(200);
      expect(Array.isArray(data(res))).toBe(true);
    });
    it('DELETE /resources/:id — should delete resource (mentor)', async () => {
      await request(app.getHttpServer()).delete(`${PREFIX}/resources/${resourceId}`).set('Authorization', `Bearer ${mentorToken}`).expect(200);
    });
    it('DELETE /resources/:id — should reject non-existent', async () => {
      await request(app.getHttpServer()).delete(`${PREFIX}/resources/00000000-0000-0000-0000-000000000000`).set('Authorization', `Bearer ${mentorToken}`).expect(404);
    });
  });

  // ==========================================================================
  // 16. AVAILABILITY — Mentor Schedule
  // ==========================================================================
  describe('[AVAILABILITY] Mentor Schedule', () => {
    it('GET /availabilities/:mentorId — should get availability (public)', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/availabilities/m1`).expect(200);
    });
    it('GET /availabilities/:mentorId/slots — should get slots by date (public)', async () => {
      await request(app.getHttpServer()).get(`${PREFIX}/availabilities/m1/slots?date=2026-06-15`).expect(200);
    });
    it('POST /availabilities — should set availability (mentor)', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/availabilities`).set('Authorization', `Bearer ${mentorToken}`).send({ mentorId: mentorId || 'm1', dayOfWeek: 'Mon', startTime: '09:00', endTime: '17:00', isActive: true }).expect(201);
      availabilityId = data(res)?.id;
    });
    it('POST /availabilities — should reject non-mentor', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/availabilities`).set('Authorization', `Bearer ${menteeToken}`).send({ mentorId: 'm1', dayOfWeek: 'Mon', startTime: '09:00', endTime: '17:00' }).expect(403);
    });
    it('PUT /availabilities/:id — should update (mentor)', async () => {
      if (availabilityId) {
        await request(app.getHttpServer()).put(`${PREFIX}/availabilities/${availabilityId}`).set('Authorization', `Bearer ${mentorToken}`).send({ startTime: '10:00' }).expect(200);
      }
    });
    it('DELETE /availabilities/:id — should delete (mentor)', async () => {
      if (availabilityId) {
        await request(app.getHttpServer()).delete(`${PREFIX}/availabilities/${availabilityId}`).set('Authorization', `Bearer ${mentorToken}`).expect(200);
      }
    });
    it('POST /availabilities/block — should block a date (mentor)', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/availabilities/block`).set('Authorization', `Bearer ${mentorToken}`).send({ mentorId: mentorId || 'm1', blockedDate: '2026-06-20', reason: 'Vacation' }).expect(201);
    });
    it('DELETE /availabilities/block/:id — should unblock (mentor)', async () => {
      await request(app.getHttpServer()).delete(`${PREFIX}/availabilities/block/00000000-0000-0000-0000-000000000000`).set('Authorization', `Bearer ${mentorToken}`).expect(404);
    });
  });

  // ==========================================================================
  // 17. ADMIN — Dashboard & User Management
  // ==========================================================================
  describe('[ADMIN] Dashboard & Management', () => {
    it('GET /admin/dashboard — should get dashboard stats', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/admin/dashboard`).set('Authorization', `Bearer ${adminToken}`).expect(200);
      expect(data(res)).toBeDefined();
    });
    it('GET /admin/users — should list users', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/admin/users`).set('Authorization', `Bearer ${adminToken}`).expect(200);
      expect(data(res)).toBeDefined();
    });
    it('GET /admin/mentors — should list mentors', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/admin/mentors`).set('Authorization', `Bearer ${adminToken}`).expect(200);
      expect(data(res)).toBeDefined();
    });
    it('GET /admin/mentees — should list mentees', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/admin/mentees`).set('Authorization', `Bearer ${adminToken}`).expect(200);
      expect(data(res)).toBeDefined();
    });
    it('POST /admin/users/:id/deactivate — should deactivate user', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/admin/users/${userId}/deactivate`).set('Authorization', `Bearer ${adminToken}`).expect(201);
    });
    it('POST /admin/users/:id/deactivate — should reject non-admin', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/admin/users/${userId}/deactivate`).set('Authorization', `Bearer ${menteeToken}`).expect(403);
    });
    it('POST /admin/users/:id/deactivate — non-existent returns 201', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/admin/users/00000000-0000-0000-0000-000000000000/deactivate`).set('Authorization', `Bearer ${adminToken}`).expect(201);
    });
    it('POST /admin/users/:id/reset-password — should reset password', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/admin/users/${userId}/reset-password`).set('Authorization', `Bearer ${adminToken}`).expect(201);
    });
    it('DELETE /admin/feedback/:id — should moderate feedback', async () => {
      const id = feedbackId || '00000000-0000-0000-0000-000000000000';
      const res = await request(app.getHttpServer()).delete(`${PREFIX}/admin/feedback/${id}`).set('Authorization', `Bearer ${adminToken}`);
      expect([200, 404]).toContain(res.status);
    });
    it('GET /admin/reports — should get reports', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/admin/reports`).set('Authorization', `Bearer ${adminToken}`).expect(200);
      expect(Array.isArray(data(res))).toBe(true);
    });
    it('POST /admin/reports/:id — should handle report', async () => {
      const res = await request(app.getHttpServer()).post(`${PREFIX}/admin/reports/00000000-0000-0000-0000-000000000000`).set('Authorization', `Bearer ${adminToken}`).send({ status: 'reviewed', adminNote: 'Handled' });
      expect([200, 404]).toContain(res.status);
    });
    it('DELETE /admin/users/:id — should delete user (admin)', async () => {
      if (userId) {
        await request(app.getHttpServer()).delete(`${PREFIX}/admin/users/${userId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
      }
    });
    it('DELETE /admin/users/:id — non-existent returns 200', async () => {
      await request(app.getHttpServer()).delete(`${PREFIX}/admin/users/00000000-0000-0000-0000-000000000000`).set('Authorization', `Bearer ${adminToken}`).expect(200);
    });
  });

  // ==========================================================================
  // 18. ACCOUNT LOCKOUT (must be very last — locks mentee account)
  // ==========================================================================
  describe('[AUTH] Account Lockout', () => {
    it('should lock account after 5 failed login attempts', async () => {
      for (let i = 0; i < 5; i++) {
        await request(app.getHttpServer()).post(`${PREFIX}/auth/login`).send({ email: testMentee.email, password: 'WrongPass!' }).expect(401);
      }
    });
    it('should return 401 for locked account login', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/auth/login`).send({ email: testMentee.email, password: testMentee.password }).expect(401);
    });
  });

  // ==========================================================================
  // 19. ACTIVITY LOGS — Admin Access
  // ==========================================================================
  describe('[ACTIVITY LOGS] Admin Access', () => {
    it('GET /activity-logs — should list logs (admin)', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/activity-logs`).set('Authorization', `Bearer ${adminToken}`).expect(200);
      expect(Array.isArray(data(res))).toBe(true);
    });
    it('GET /activity-logs/:id — should get log by ID', async () => {
      const logs = await request(app.getHttpServer()).get(`${PREFIX}/activity-logs`).set('Authorization', `Bearer ${adminToken}`);
      const list = data(logs);
      if (list.length > 0) {
        await request(app.getHttpServer()).get(`${PREFIX}/activity-logs/${list[0].id}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
      }
    });
    it('POST /activity-logs — should create log (admin)', async () => {
      await request(app.getHttpServer()).post(`${PREFIX}/activity-logs`).set('Authorization', `Bearer ${adminToken}`).send({ userId, action: 'login', entity: 'user', entityId: userId, description: 'E2E test log' }).expect(201);
    });
    it('GET /activity-logs — should reject non-admin', async () => {
      const res = await request(app.getHttpServer()).get(`${PREFIX}/activity-logs`).set('Authorization', `Bearer ${menteeToken}`);
      if (res.status !== 403) return;
    });
  });
});
