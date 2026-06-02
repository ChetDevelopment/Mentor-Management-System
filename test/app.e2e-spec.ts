import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('MentorKhet API (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let mentorToken: string;
  let menteeToken: string;
  let testUserId: string;
  let testMentorId: string;
  let testMenteeId: string;
  let testSessionId: string;
  let testFeedbackId: string;
  let testSkillId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ========== AUTH FLOW ==========

  describe('Auth', () => {
    it('POST /api/auth/register - should register a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'testadmin@test.com',
          password: 'Password123',
          firstName: 'Test',
          lastName: 'Admin',
          role: 'admin',
        })
        .expect(201);

      expect(res.body.user).toBeDefined();
      expect(res.body.accessToken).toBeDefined();
      adminToken = res.body.accessToken;
    });

    it('POST /api/auth/register - should register a mentor', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'testmentor@test.com',
          password: 'Password123',
          firstName: 'Test',
          lastName: 'Mentor',
          role: 'mentor',
        })
        .expect(201);

      mentorToken = res.body.accessToken;
    });

    it('POST /api/auth/register - should register a mentee', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'testmentee@test.com',
          password: 'Password123',
          firstName: 'Test',
          lastName: 'Mentee',
          role: 'mentee',
        })
        .expect(201);

      menteeToken = res.body.accessToken;
    });

    it('POST /api/auth/login - should login', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'testadmin@test.com', password: 'Password123' })
        .expect(201);

      expect(res.body.accessToken).toBeDefined();
      adminToken = res.body.accessToken;
    });

    it('POST /api/auth/login - should reject invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'testadmin@test.com', password: 'wrongpassword' })
        .expect(401);
    });

    it('POST /api/auth/forgot-password - should generate reset token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/forgot-password')
        .send({ email: 'testadmin@test.com' })
        .expect(201);

      expect(res.body.resetToken).toBeDefined();
    });

    it('POST /api/auth/reset-password - should reject without token', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/reset-password')
        .send({ token: 'invalid', password: 'NewPass123' })
        .expect(400);
    });
  });

  // ========== USER PROFILE ==========

  describe('Users', () => {
    it('GET /api/users/profile - should get own profile', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.email).toBe('testadmin@test.com');
      testUserId = res.body.id;
    });

    it('PUT /api/users/profile - should update profile', async () => {
      await request(app.getHttpServer())
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ firstName: 'Updated' })
        .expect(200);
    });

    it('GET /api/users/profile - should reject without token', async () => {
      await request(app.getHttpServer())
        .get('/api/users/profile')
        .expect(401);
    });
  });

  // ========== SKILLS ==========

  describe('Skills', () => {
    it('GET /api/skills - should list skills (public)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/skills')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /api/skills - should create skill (admin)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/skills')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Test Skill', description: 'Test' })
        .expect(201);

      testSkillId = res.body.id;
    });
  });

  // ========== MENTORS ==========

  describe('Mentors', () => {
    it('GET /api/mentors - should list mentors', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/mentors')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ========== SESSIONS ==========

  describe('Sessions', () => {
    it('POST /api/sessions - should create session request', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/sessions')
        .set('Authorization', `Bearer ${menteeToken}`)
        .send({
          mentorId: 'm1',
          menteeId: 'e1',
          title: 'Test Session',
          scheduledAt: '2026-06-15T14:00:00.000Z',
        })
        .expect(201);

      testSessionId = res.body.id;
    });

    it('GET /api/sessions - should list sessions', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/sessions')
        .set('Authorization', `Bearer ${menteeToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ========== FEEDBACK ==========

  describe('Feedback', () => {
    it('POST /api/feedback - should submit feedback', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/feedback')
        .set('Authorization', `Bearer ${menteeToken}`)
        .send({
          mentorId: 'm1',
          menteeId: 'e1',
          rating: 5,
          comment: 'Great session!',
        })
        .expect(201);

      testFeedbackId = res.body.id;
    });

    it('GET /api/feedback - should list feedback', async () => {
      await request(app.getHttpServer())
        .get('/api/feedback')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  // ========== ADMIN ==========

  describe('Admin', () => {
    it('GET /api/admin/dashboard - should get stats', async () => {
      await request(app.getHttpServer())
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('GET /api/admin/users - should list users', async () => {
      await request(app.getHttpServer())
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  // ========== ACTIVITY LOGS ==========

  describe('Activity Logs', () => {
    it('GET /api/activity-logs - should list logs (admin)', async () => {
      await request(app.getHttpServer())
        .get('/api/activity-logs')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  // ========== RESOURCES ==========

  describe('Resources', () => {
    it('GET /api/resources/:mentorId - should get resources (public)', async () => {
      await request(app.getHttpServer())
        .get('/api/resources/m1')
        .expect(200);
    });
  });

  // ========== NOTIFICATIONS ==========

  describe('Notifications', () => {
    it('GET /api/notifications - should list notifications', async () => {
      await request(app.getHttpServer())
        .get('/api/notifications')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('GET /api/notifications/unread - should get unread count', async () => {
      await request(app.getHttpServer())
        .get('/api/notifications/unread')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });
});
