const router = require('express').Router();
const { getRepo } = require('../db');
const { authGuard, rolesGuard } = require('../middleware/auth');
const { User } = require('../../dist/entities/user/user.entity');
const { Mentor } = require('../../dist/entities/mentor/mentor.entity');
const { Mentee } = require('../../dist/entities/mentee/mentee.entity');
const { Session } = require('../../dist/entities/session/session.entity');

router.get('/dashboard', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const [users, mentors, mentees, sessions] = await Promise.all([
      (await getRepo(User)).count(),
      (await getRepo(Mentor)).count(),
      (await getRepo(Mentee)).count(),
      (await getRepo(Session)).count(),
    ]);
    res.json({ success: true, data: { totalUsers: users, totalMentors: mentors, totalMentees: mentees, totalSessions: sessions } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/users', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(User);
    const users = await repo.find({ select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt'], take: 50 });
    res.json({ success: true, data: users });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/mentors', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(Mentor);
    const list = await repo.find({ take: 50 });
    res.json({ success: true, data: list });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/mentees', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(Mentee);
    const list = await repo.find({ take: 50 });
    res.json({ success: true, data: list });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/reports', authGuard, rolesGuard('admin'), async (req, res) => {
  res.json({ success: true, data: [] });
});

module.exports = router;
