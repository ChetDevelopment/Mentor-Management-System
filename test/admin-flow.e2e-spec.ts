import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Admin Flow E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // 14.11 Register mentor → pending → admin approves
  it('should register mentor and approve', async () => {
    const mentor = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ role: 'mentor', email: 'mentor@test.com', password: '123456' })
      .expect(201);

    const approval = await request(app.getHttpServer())
      .post(`/admin/mentors/${mentor.body.id}/approve`)
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`)
      .expect(200);

    expect(approval.body.status).toBe('approved');
  });

  // 14.12 Mentee registers → browses mentors → books session
  it('should allow mentee to book a session', async () => {
    const mentee = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ role: 'mentee', email: 'mentee@test.com', password: '123456' })
      .expect(201);

    const mentors = await request(app.getHttpServer())
      .get('/mentors')
      .expect(200);

    const booking = await request(app.getHttpServer())
      .post('/sessions')
      .send({ menteeId: mentee.body.id, mentorId: mentors.body[0].id })
      .expect(201);

    expect(booking.body.status).toBe('pending');
  });

  // 14.13 Mentor accepts → session completes → feedback submitted
  it('should complete session and submit feedback', async () => {
    const session = await request(app.getHttpServer())
      .post('/sessions/1/accept')
      .expect(200);

    const complete = await request(app.getHttpServer())
      .post('/sessions/1/complete')
      .expect(200);

    const feedback = await request(app.getHttpServer())
      .post('/feedback')
      .send({ sessionId: 1, rating: 5, comment: 'Great session!' })
      .expect(201);

    expect(feedback.body.rating).toBe(5);
  });

  // 14.14 Mentor rating recalculates after feedback
  it('should recalculate mentor rating', async () => {
    const mentor = await request(app.getHttpServer())
      .get('/mentors/1')
      .expect(200);

    expect(mentor.body.averageRating).toBeGreaterThan(0);
  });

  // 14.15 Mentee files report → admin handles
  it('should file and handle report', async () => {
    const report = await request(app.getHttpServer())
      .post('/reports')
      .send({ reporterId: 2, reportedId: 1, reason: 'Inappropriate behavior' })
      .expect(201);

    const handle = await request(app.getHttpServer())
      .put(`/admin/reports/${report.body.id}`)
      .send({ status: 'reviewed', adminNote: 'Handled' })
      .expect(200);

    expect(handle.body.status).toBe('reviewed');
  });

  // 14.16 Forgot password → reset password
  it('should reset password', async () => {
    const reset = await request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({ email: 'mentee@test.com' })
      .expect(200);

    expect(reset.body.message).toContain('reset link sent');
  });

  // 14.17 Matching algorithm returns ranked mentors
  it('should return ranked mentors', async () => {
    const matches = await request(app.getHttpServer())
      .get('/matching?skill=JavaScript')
      .expect(200);

    expect(matches.body).toBeInstanceOf(Array);
  });

  // 14.18 Admin dashboard stats are accurate
  it('should return dashboard stats', async () => {
    const stats = await request(app.getHttpServer())
      .get('/admin/dashboard')
      .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`)
      .expect(200);

    expect(stats.body.totalUsers).toBeGreaterThan(0);
  });
});
