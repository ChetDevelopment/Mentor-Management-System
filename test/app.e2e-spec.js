"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const request = require("supertest");
const app_module_1 = require("../src/app.module");
describe('MentorKhet API — Full QA Test Suite', () => {
    let app;
    let adminToken;
    let mentorToken;
    let menteeToken;
    let createdUserId;
    let createdMentorId;
    let createdMenteeId;
    let createdSkillId;
    let createdCategoryId;
    let createdSessionId;
    let createdFeedbackId;
    let createdNotificationId;
    let createdMatchingId;
    let createdResourceId;
    let createdAvailabilityId;
    let createdActivityLogId;
    let resetToken;
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
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    describe('[AUTH] Registration & Authentication', () => {
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
        it('POST /auth/register — should register mentor', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/auth/register')
                .send(testMentor)
                .expect(201);
            expect(res.body.user.role).toBe('mentor');
            expect(res.body).toHaveProperty('accessToken');
            mentorToken = res.body.accessToken;
        });
        it('POST /auth/register — should register mentee', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/auth/register')
                .send(testMentee)
                .expect(201);
            expect(res.body.user.role).toBe('mentee');
            expect(res.body).toHaveProperty('accessToken');
            menteeToken = res.body.accessToken;
        });
        it('POST /auth/register — should reject duplicate email', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/register')
                .send(testAdmin)
                .expect(400);
        });
        it('POST /auth/register — should reject missing required fields', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/auth/register')
                .send({ email: 'incomplete@test.com' })
                .expect(400);
            expect(res.body.message).toBeDefined();
        });
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
        it('POST /auth/login — should login successfully', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/auth/login')
                .send({ email: testAdmin.email, password: testAdmin.password })
                .expect(201);
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body.user.email).toBe(testAdmin.email);
            adminToken = res.body.accessToken;
        });
        it('POST /auth/login — should reject wrong password', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/login')
                .send({ email: testAdmin.email, password: 'WrongPassword!' })
                .expect(401);
        });
        it('POST /auth/login — should reject non-existent email', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/login')
                .send({ email: 'nonexistent@test.com', password: 'TestPass123!' })
                .expect(401);
        });
        it('POST /auth/login — should reject missing password', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/login')
                .send({ email: testAdmin.email })
                .expect(400);
        });
        it('POST /auth/forgot-password — should generate reset token', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/auth/forgot-password')
                .send({ email: testAdmin.email })
                .expect(201);
            expect(res.body).toHaveProperty('resetToken');
            resetToken = res.body.resetToken;
        });
        it('POST /auth/forgot-password — should reject non-existent email', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/forgot-password')
                .send({ email: 'ghost@test.com' })
                .expect(400);
        });
        it('POST /auth/reset-password — should reset password', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/reset-password')
                .send({ token: resetToken, password: 'NewPass123!' })
                .expect(201);
        });
        it('POST /auth/login — should login with new password after reset', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/auth/login')
                .send({ email: testAdmin.email, password: 'NewPass123!' })
                .expect(201);
            adminToken = res.body.accessToken;
        });
        it('POST /auth/reset-password — should reject invalid token', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/reset-password')
                .send({ token: 'invalid-token-123', password: 'NewPass123!' })
                .expect(400);
        });
        it('POST /auth/reset-password — should reject weak password', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/reset-password')
                .send({ token: resetToken, password: '123' })
                .expect(400);
        });
        it('POST /auth/logout — should logout successfully', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(201);
        });
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
    describe('[AUTH GUARD] Route Protection', () => {
        it('GET /api/users/profile — should reject without token', async () => {
            await request(app.getHttpServer())
                .get('/api/users/profile')
                .expect(401);
        });
        it('GET /api/users/profile — should reject malformed token', async () => {
            await request(app.getHttpServer())
                .get('/api/users/profile')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);
        });
        it('GET /api/users/profile — should reject empty Bearer', async () => {
            await request(app.getHttpServer())
                .get('/api/users/profile')
                .set('Authorization', 'Bearer ')
                .expect(401);
        });
        it('GET /api/sessions — should reject without token', async () => {
            await request(app.getHttpServer())
                .get('/api/sessions')
                .expect(401);
        });
        it('GET /api/admin/dashboard — should reject non-admin', async () => {
            await request(app.getHttpServer())
                .get('/api/admin/dashboard')
                .set('Authorization', `Bearer ${menteeToken}`)
                .expect(403);
        });
        it('GET /api/skills — public route should work without token', async () => {
            await request(app.getHttpServer())
                .get('/api/skills')
                .expect(200);
        });
    });
    describe('[USERS] Profile & CRUD', () => {
        it('GET /api/users/profile — should get own profile', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ userId: '' })
                .expect(200);
            expect(res.body).toHaveProperty('email');
            createdUserId = res.body.id;
        });
        it('PUT /api/users/profile — should update own profile', async () => {
            await request(app.getHttpServer())
                .put('/api/users/profile')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ userId: createdUserId, firstName: 'UpdatedAdmin' })
                .expect(200);
        });
        it('PUT /api/users/profile — should reject empty body', async () => {
            await request(app.getHttpServer())
                .put('/api/users/profile')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ userId: createdUserId })
                .expect(400);
        });
        it('GET /api/users — should list all users (admin)', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(3);
        });
        it('GET /api/users/:id — should get user by ID (admin)', async () => {
            await request(app.getHttpServer())
                .get(`/api/users/${createdUserId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
        it('GET /api/users/:id — should return 404 for non-existent user', async () => {
            await request(app.getHttpServer())
                .get('/api/users/00000000-0000-0000-0000-000000000000')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        });
        it('GET /api/users — should reject non-admin', async () => {
            await request(app.getHttpServer())
                .get('/api/users')
                .set('Authorization', `Bearer ${menteeToken}`)
                .expect(403);
        });
    });
    describe('[SKILLS] CRUD & Categories', () => {
        it('GET /api/skills — should list skills (public)', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/skills')
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
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
        it('POST /api/skills — should reject missing name', async () => {
            await request(app.getHttpServer())
                .post('/api/skills')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ description: 'No name' })
                .expect(400);
        });
        it('POST /api/skills — should reject non-admin', async () => {
            await request(app.getHttpServer())
                .post('/api/skills')
                .set('Authorization', `Bearer ${menteeToken}`)
                .send({ name: 'Should-Fail' })
                .expect(403);
        });
        it('GET /api/skills/:id — should get skill by ID (public)', async () => {
            const res = await request(app.getHttpServer())
                .get(`/api/skills/${createdSkillId}`)
                .expect(200);
            expect(res.body.id).toBe(createdSkillId);
        });
        it('GET /api/skills/:id — should return 404 for non-existent', async () => {
            await request(app.getHttpServer())
                .get('/api/skills/00000000-0000-0000-0000-000000000000')
                .expect(404);
        });
        it('PUT /api/skills/:id — should update skill (admin)', async () => {
            await request(app.getHttpServer())
                .put(`/api/skills/${createdSkillId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ description: 'Updated description' })
                .expect(200);
        });
        it('DELETE /api/skills/:id — should delete skill (admin)', async () => {
            await request(app.getHttpServer())
                .delete(`/api/skills/${createdSkillId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
        it('GET /api/skills/:id — should return 404 for deleted skill', async () => {
            await request(app.getHttpServer())
                .get(`/api/skills/${createdSkillId}`)
                .expect(404);
        });
    });
    describe('[MENTORS] CRUD & Status Management', () => {
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
        it('GET /api/mentors — should list mentors', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/mentors')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
        it('PUT /api/mentors/:id — should update mentor', async () => {
            await request(app.getHttpServer())
                .put(`/api/mentors/${createdMentorId}`)
                .send({ title: 'Lead QA Engineer' })
                .expect(200);
        });
        it('PUT /api/mentors/:id — should reject invalid phone', async () => {
            await request(app.getHttpServer())
                .put(`/api/mentors/${createdMentorId}`)
                .send({ phone: 'invalid-phone' })
                .expect(400);
        });
        it('POST /api/mentors/:id/approve — should approve mentor (admin)', async () => {
            await request(app.getHttpServer())
                .post(`/api/mentors/${createdMentorId}/approve`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(201);
        });
        it('POST /api/mentors/:id/approve — should reject non-admin', async () => {
            await request(app.getHttpServer())
                .post(`/api/mentors/${createdMentorId}/approve`)
                .set('Authorization', `Bearer ${menteeToken}`)
                .expect(403);
        });
        it('POST /api/mentors/:id/reject — should reject mentor (admin)', async () => {
            await request(app.getHttpServer())
                .post(`/api/mentors/${createdMentorId}/reject`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ reason: 'Insufficient qualifications' })
                .expect(201);
        });
        it('POST /api/mentors/:id/suspend — should suspend mentor (admin)', async () => {
            await request(app.getHttpServer())
                .post(`/api/mentors/${createdMentorId}/suspend`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(201);
        });
        it('DELETE /api/mentors/:id — should delete mentor (admin)', async () => {
            await request(app.getHttpServer())
                .delete(`/api/mentors/${createdMentorId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
    });
    describe('[MENTEES] CRUD', () => {
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
        it('GET /api/mentees — should list mentees', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/mentees')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
        it('GET /api/mentees/:id — should get mentee by ID', async () => {
            await request(app.getHttpServer())
                .get(`/api/mentees/${createdMenteeId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
        it('PUT /api/mentees/:id — should update mentee', async () => {
            await request(app.getHttpServer())
                .put(`/api/mentees/${createdMenteeId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ occupation: 'Junior Developer' })
                .expect(200);
        });
        it('DELETE /api/mentees/:id — should reject non-admin', async () => {
            await request(app.getHttpServer())
                .delete(`/api/mentees/${createdMenteeId}`)
                .set('Authorization', `Bearer ${menteeToken}`)
                .expect(403);
        });
        it('DELETE /api/mentees/:id — should delete mentee (admin)', async () => {
            await request(app.getHttpServer())
                .delete(`/api/mentees/${createdMenteeId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
    });
    describe('[SESSIONS] Full Lifecycle', () => {
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
        it('POST /api/sessions — should reject missing fields', async () => {
            await request(app.getHttpServer())
                .post('/api/sessions')
                .set('Authorization', `Bearer ${menteeToken}`)
                .send({ title: 'Incomplete' })
                .expect(400);
        });
        it('GET /api/sessions — should list sessions', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/sessions')
                .set('Authorization', `Bearer ${menteeToken}`)
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
        it('GET /api/sessions/:id — should get session', async () => {
            await request(app.getHttpServer())
                .get(`/api/sessions/${createdSessionId}`)
                .set('Authorization', `Bearer ${menteeToken}`)
                .expect(200);
        });
        it('PUT /api/sessions/:id — should update session', async () => {
            await request(app.getHttpServer())
                .put(`/api/sessions/${createdSessionId}`)
                .set('Authorization', `Bearer ${menteeToken}`)
                .send({ title: 'Updated Session Title' })
                .expect(200);
        });
        it('POST /api/sessions/:id/accept — should reject non-mentor', async () => {
            await request(app.getHttpServer())
                .post(`/api/sessions/${createdSessionId}/accept`)
                .set('Authorization', `Bearer ${menteeToken}`)
                .expect(403);
        });
        it('POST /api/sessions/:id/accept — should accept session (mentor)', async () => {
            await request(app.getHttpServer())
                .post(`/api/sessions/${createdSessionId}/accept`)
                .set('Authorization', `Bearer ${mentorToken}`)
                .expect(201);
        });
        it('POST /api/sessions/:id/decline — should reject non-mentor', async () => {
            await request(app.getHttpServer())
                .post(`/api/sessions/${createdSessionId}/decline`)
                .set('Authorization', `Bearer ${menteeToken}`)
                .expect(403);
        });
        it('POST /api/sessions/:id/complete — should complete session', async () => {
            await request(app.getHttpServer())
                .post(`/api/sessions/${createdSessionId}/complete`)
                .set('Authorization', `Bearer ${mentorToken}`)
                .expect(201);
        });
        it('POST /api/sessions/:id/cancel — should cancel session', async () => {
            await request(app.getHttpServer())
                .post(`/api/sessions/${createdSessionId}/cancel`)
                .set('Authorization', `Bearer ${mentorToken}`)
                .expect(201);
        });
        it('POST /api/sessions/:id/cancel — should reject non-existent', async () => {
            await request(app.getHttpServer())
                .post('/api/sessions/00000000-0000-0000-0000-000000000000/cancel')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        });
        it('POST /api/sessions/:id/no-show — should mark session as no-show', async () => {
            await request(app.getHttpServer())
                .post(`/api/sessions/${createdSessionId}/no-show`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(201);
        });
        it('DELETE /api/sessions/:id — should delete session', async () => {
            await request(app.getHttpServer())
                .delete(`/api/sessions/${createdSessionId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
    });
    describe('[MATCHINGS] CRUD', () => {
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
        it('POST /api/matchings — should reject non-admin', async () => {
            await request(app.getHttpServer())
                .post('/api/matchings')
                .set('Authorization', `Bearer ${menteeToken}`)
                .send({ mentorId: 'm1', menteeId: 'e1' })
                .expect(403);
        });
        it('GET /api/matchings — should list matchings', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/matchings')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
        it('PUT /api/matchings/:id — should update matching', async () => {
            await request(app.getHttpServer())
                .put(`/api/matchings/${createdMatchingId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ status: 'accepted' })
                .expect(200);
        });
        it('GET /api/matchings/:id — should get matching by ID', async () => {
            await request(app.getHttpServer())
                .get(`/api/matchings/${createdMatchingId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
        it('DELETE /api/matchings/:id — should delete matching (admin)', async () => {
            await request(app.getHttpServer())
                .delete(`/api/matchings/${createdMatchingId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
    });
    describe('[FEEDBACK] CRUD', () => {
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
        it('POST /api/feedback — should reject missing rating', async () => {
            await request(app.getHttpServer())
                .post('/api/feedback')
                .set('Authorization', `Bearer ${menteeToken}`)
                .send({ mentorId: 'm1', menteeId: 'e1' })
                .expect(400);
        });
        it('GET /api/feedback — should list feedback', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/feedback')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
        it('GET /api/feedback/mentor/:mentorId — should get feedback by mentor', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/feedback/mentor/m1')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
        it('PUT /api/feedback/:id — should update feedback', async () => {
            await request(app.getHttpServer())
                .put(`/api/feedback/${createdFeedbackId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ rating: 4, comment: 'Updated comment' })
                .expect(200);
        });
        it('GET /api/feedback/:id — should get feedback by ID', async () => {
            await request(app.getHttpServer())
                .get(`/api/feedback/${createdFeedbackId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
        it('DELETE /api/feedback/:id — should delete feedback', async () => {
            await request(app.getHttpServer())
                .delete(`/api/feedback/${createdFeedbackId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
    });
    describe('[NOTIFICATIONS] CRUD', () => {
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
        it('GET /api/notifications — should list notifications', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/notifications')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
        it('GET /api/notifications/:id — should get notification by ID', async () => {
            await request(app.getHttpServer())
                .get(`/api/notifications/${createdNotificationId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
        it('GET /api/notifications/unread — should get unread count', async () => {
            await request(app.getHttpServer())
                .get('/api/notifications/unread')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
        it('PUT /api/notifications/:id/read — should mark as read', async () => {
            await request(app.getHttpServer())
                .put(`/api/notifications/${createdNotificationId}/read`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
        it('DELETE /api/notifications/:id — should delete notification', async () => {
            await request(app.getHttpServer())
                .delete(`/api/notifications/${createdNotificationId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
    });
    describe('[ADMIN] Dashboard & Management', () => {
        it('GET /api/admin/dashboard — should get dashboard stats', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/admin/dashboard')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            expect(res.body).toBeDefined();
        });
        it('GET /api/admin/users — should list all users', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
        it('GET /api/admin/mentors — should list all mentors', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/admin/mentors')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
        it('GET /api/admin/mentees — should list all mentees', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/admin/mentees')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
        it('POST /api/admin/users/:id/deactivate — should deactivate user', async () => {
            await request(app.getHttpServer())
                .post(`/api/admin/users/${createdUserId}/deactivate`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(201);
        });
        it('POST /api/admin/users/:id/deactivate — should reject non-admin', async () => {
            await request(app.getHttpServer())
                .post(`/api/admin/users/${createdUserId}/deactivate`)
                .set('Authorization', `Bearer ${menteeToken}`)
                .expect(403);
        });
        it('POST /api/admin/users/:id/reset-password — should reset user password (admin)', async () => {
            await request(app.getHttpServer())
                .post(`/api/admin/users/${createdUserId}/reset-password`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ password: 'NewTempPass123!' })
                .expect(201);
        });
        it('DELETE /api/admin/feedback/:id — should moderate feedback (admin)', async () => {
            await request(app.getHttpServer())
                .delete(`/api/admin/feedback/${createdFeedbackId || '00000000-0000-0000-0000-000000000000'}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
        it('DELETE /api/admin/users/:id — should delete user (admin)', async () => {
            await request(app.getHttpServer())
                .delete(`/api/admin/users/${createdUserId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
    });
    describe('[ACTIVITY LOGS] Admin Access', () => {
        it('GET /api/activity-logs — should list activity logs (admin)', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/activity-logs')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
        it('GET /api/activity-logs/:id — should get activity log by ID (admin)', async () => {
            const logs = await request(app.getHttpServer())
                .get('/api/activity-logs')
                .set('Authorization', `Bearer ${adminToken}`);
            if (logs.body.length > 0) {
                await request(app.getHttpServer())
                    .get(`/api/activity-logs/${logs.body[0].id}`)
                    .set('Authorization', `Bearer ${adminToken}`)
                    .expect(200);
            }
        });
        it('POST /api/activity-logs — should create activity log (admin)', async () => {
            await request(app.getHttpServer())
                .post('/api/activity-logs')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                action: 'create',
                entity: 'test',
                entityId: '00000000-0000-0000-0000-000000000000',
                description: 'QA test log entry',
            })
                .expect(201);
        });
        it('GET /api/activity-logs — should reject non-admin', async () => {
            await request(app.getHttpServer())
                .get('/api/activity-logs')
                .set('Authorization', `Bearer ${menteeToken}`)
                .expect(403);
        });
    });
    describe('[RESOURCES] Mentor Content', () => {
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
        it('POST /api/resources — should reject missing title', async () => {
            await request(app.getHttpServer())
                .post('/api/resources')
                .set('Authorization', `Bearer ${mentorToken}`)
                .send({ mentorId: 'm1' })
                .expect(400);
        });
        it('GET /api/resources/:mentorId — should get resources (public)', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/resources/m1')
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
        it('DELETE /api/resources/:id — should delete resource (mentor)', async () => {
            await request(app.getHttpServer())
                .delete(`/api/resources/${createdResourceId}`)
                .set('Authorization', `Bearer ${mentorToken}`)
                .expect(200);
        });
    });
    describe('[AVAILABILITY] Mentor Schedule', () => {
        it('GET /api/availabilities/:mentorId — should get mentor availability (public)', async () => {
            await request(app.getHttpServer())
                .get('/api/availabilities/m1')
                .expect(200);
        });
        it('GET /api/availabilities/:mentorId/slots — should get slots by date (public)', async () => {
            await request(app.getHttpServer())
                .get('/api/availabilities/m1/slots?date=2026-06-15')
                .expect(200);
        });
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
        it('POST /api/availabilities — should reject non-mentor', async () => {
            await request(app.getHttpServer())
                .post('/api/availabilities')
                .set('Authorization', `Bearer ${menteeToken}`)
                .send({ mentorId: 'm1', date: '2026-06-15', startTime: '09:00', endTime: '17:00' })
                .expect(403);
        });
        it('PUT /api/availabilities/:id — should update availability (mentor)', async () => {
            if (createdAvailabilityId) {
                await request(app.getHttpServer())
                    .put(`/api/availabilities/${createdAvailabilityId}`)
                    .set('Authorization', `Bearer ${mentorToken}`)
                    .send({ startTime: '10:00', endTime: '16:00' })
                    .expect(200);
            }
        });
        it('DELETE /api/availabilities/:id — should delete availability (mentor)', async () => {
            if (createdAvailabilityId) {
                await request(app.getHttpServer())
                    .delete(`/api/availabilities/${createdAvailabilityId}`)
                    .set('Authorization', `Bearer ${mentorToken}`)
                    .expect(200);
            }
        });
        it('POST /api/availabilities/block — should block a date (mentor)', async () => {
            await request(app.getHttpServer())
                .post('/api/availabilities/block')
                .set('Authorization', `Bearer ${mentorToken}`)
                .send({ mentorId: 'm1', date: '2026-06-20', startTime: '00:00', endTime: '23:59' })
                .expect(201);
        });
    });
    describe('[EDGE CASES] Validation, Security & Error Handling', () => {
        it('POST /auth/register — should reject empty body', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/register')
                .send({})
                .expect(400);
        });
        it('POST /auth/register — should reject invalid role', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/register')
                .send({
                email: 'badrole@test.com',
                password: 'TestPass123!',
                firstName: 'Bad',
                lastName: 'Role',
                role: 'superadmin',
            })
                .expect(400);
        });
        it('POST /auth/login — should reject empty body', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/login')
                .send({})
                .expect(400);
        });
        it('POST /auth/forgot-password — should reject empty body', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/forgot-password')
                .send({})
                .expect(400);
        });
        it('POST /auth/reset-password — should reject empty body', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/reset-password')
                .send({})
                .expect(400);
        });
        it('POST /auth/logout — should reject without token', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/logout')
                .expect(401);
        });
        it('POST /auth/refresh-token — should reject without token', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/refresh-token')
                .expect(401);
        });
        it('GET /api/users/profile — should reject without token (unauthenticated)', async () => {
            await request(app.getHttpServer())
                .get('/api/users/profile')
                .expect(401);
        });
        it('PUT /api/users/profile — should reject without token', async () => {
            await request(app.getHttpServer())
                .put('/api/users/profile')
                .send({ userId: 'test', firstName: 'Hacker' })
                .expect(401);
        });
        it('GET /api/users — should reject non-admin (mentor)', async () => {
            await request(app.getHttpServer())
                .get('/api/users')
                .set('Authorization', `Bearer ${mentorToken}`)
                .expect(403);
        });
        it('PUT /api/users/:id — should return 404 for non-existent user', async () => {
            await request(app.getHttpServer())
                .put('/api/users/00000000-0000-0000-0000-000000000000')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ firstName: 'Ghost' })
                .expect(404);
        });
        it('POST /api/skills — should create and then reject duplicate name', async () => {
            const name = `Dup-Skill-${Date.now()}`;
            await request(app.getHttpServer())
                .post('/api/skills')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name })
                .expect(201);
            await request(app.getHttpServer())
                .post('/api/skills')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name })
                .expect(400);
        });
        it('POST /api/skills — should reject unknown fields', async () => {
            await request(app.getHttpServer())
                .post('/api/skills')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'ValidName', unknownField: 'should fail' })
                .expect(400);
        });
        it('PUT /api/skills/:id — should reject non-admin', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/skills')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: `Temp-${Date.now()}` })
                .expect(201);
            await request(app.getHttpServer())
                .put(`/api/skills/${res.body.id}`)
                .set('Authorization', `Bearer ${menteeToken}`)
                .send({ name: 'Hacked' })
                .expect(403);
        });
        it('POST /api/sessions — should reject duration > 180', async () => {
            await request(app.getHttpServer())
                .post('/api/sessions')
                .set('Authorization', `Bearer ${menteeToken}`)
                .send({
                mentorId: 'm1',
                menteeId: 'e1',
                title: 'Too Long',
                scheduledAt: new Date(Date.now() + 86400000).toISOString(),
                duration: 200,
            })
                .expect(400);
        });
        it('POST /api/sessions — should reject duration < 15', async () => {
            await request(app.getHttpServer())
                .post('/api/sessions')
                .set('Authorization', `Bearer ${menteeToken}`)
                .send({
                mentorId: 'm1',
                menteeId: 'e1',
                title: 'Too Short',
                scheduledAt: new Date(Date.now() + 86400000).toISOString(),
                duration: 5,
            })
                .expect(400);
        });
        it('POST /api/mentors/:id/approve — should reject non-existent mentor', async () => {
            await request(app.getHttpServer())
                .post('/api/mentors/00000000-0000-0000-0000-000000000000/approve')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        });
        it('POST /api/mentors/:id/reject — should reject non-existent', async () => {
            await request(app.getHttpServer())
                .post('/api/mentors/00000000-0000-0000-0000-000000000000/reject')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ reason: 'Test' })
                .expect(404);
        });
        it('POST /api/feedback — should reject rating < 1', async () => {
            await request(app.getHttpServer())
                .post('/api/feedback')
                .set('Authorization', `Bearer ${menteeToken}`)
                .send({ mentorId: 'm1', menteeId: 'e1', rating: 0 })
                .expect(400);
        });
        it('POST /api/feedback — should reject empty body', async () => {
            await request(app.getHttpServer())
                .post('/api/feedback')
                .set('Authorization', `Bearer ${menteeToken}`)
                .send({})
                .expect(400);
        });
        it('POST /api/notifications — should create notification for any userId (admin)', async () => {
            await request(app.getHttpServer())
                .post('/api/notifications')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                userId: '00000000-0000-0000-0000-000000000000',
                title: 'Ghost Notification',
                message: 'For non-existent user',
            })
                .expect(201);
        });
        it('DELETE /api/notifications/:id — should reject non-existent', async () => {
            await request(app.getHttpServer())
                .delete('/api/notifications/00000000-0000-0000-0000-000000000000')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        });
        it('POST /api/admin/users/:id/deactivate — should reject non-existent', async () => {
            await request(app.getHttpServer())
                .post('/api/admin/users/00000000-0000-0000-0000-000000000000/deactivate')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        });
        it('DELETE /api/admin/users/:id — should reject non-existent', async () => {
            await request(app.getHttpServer())
                .delete('/api/admin/users/00000000-0000-0000-0000-000000000000')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        });
        it('POST /api/activity-logs — should reject missing required fields', async () => {
            await request(app.getHttpServer())
                .post('/api/activity-logs')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ description: 'Incomplete' })
                .expect(400);
        });
        it('POST /api/resources — should reject invalid resource type', async () => {
            await request(app.getHttpServer())
                .post('/api/resources')
                .set('Authorization', `Bearer ${mentorToken}`)
                .send({
                mentorId: 'm1',
                title: 'Invalid Type',
                type: 'invalid_type',
            })
                .expect(400);
        });
        it('DELETE /api/resources/:id — should reject non-existent', async () => {
            await request(app.getHttpServer())
                .delete('/api/resources/00000000-0000-0000-0000-000000000000')
                .set('Authorization', `Bearer ${mentorToken}`)
                .expect(404);
        });
        it('POST /api/matchings — should reject non-admin (mentor)', async () => {
            await request(app.getHttpServer())
                .post('/api/matchings')
                .set('Authorization', `Bearer ${mentorToken}`)
                .send({ mentorId: 'm1', menteeId: 'e1' })
                .expect(403);
        });
        it('POST /api/sessions/:id/accept — should reject mentee', async () => {
            await request(app.getHttpServer())
                .post(`/api/sessions/${createdSessionId || '00000000-0000-0000-0000-000000000000'}/accept`)
                .set('Authorization', `Bearer ${menteeToken}`)
                .expect(403);
        });
        it('GET /api/skills/category/:categoryId — should return empty array for non-existent', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/skills/category/00000000-0000-0000-0000-000000000000')
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });
});
//# sourceMappingURL=app.e2e-spec.js.map