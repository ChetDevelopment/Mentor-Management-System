const router = require('express').Router();
const { getRepo } = require('../db');
const { authGuard, rolesGuard } = require('../middleware/auth');
const { Session } = require('../../dist/entities/session/session.entity');

router.get('/', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Session);
    const sessions = await repo.find();
    res.json({ success: true, data: sessions });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Session);
    const session = await repo.save({ mentorId: req.body.mentorId, menteeId: req.body.menteeId, title: req.body.title, description: req.body.description, scheduledAt: req.body.scheduledAt, duration: req.body.duration || 60, status: 'pending' });
    res.status(201).json({ success: true, data: session });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/:id', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Session);
    const session = await repo.findOne({ where: { id: req.params.id } });
    if (!session) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: session });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Session);
    await repo.update(req.params.id, req.body);
    res.json({ success: true, message: 'Updated' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/:id/accept', authGuard, rolesGuard('mentor'), async (req, res) => {
  try {
    const repo = await getRepo(Session);
    await repo.update(req.params.id, { status: 'confirmed' });
    res.json({ success: true, message: 'Accepted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/:id/decline', authGuard, rolesGuard('mentor'), async (req, res) => {
  try {
    const repo = await getRepo(Session);
    await repo.update(req.params.id, { status: 'cancelled' });
    res.json({ success: true, message: 'Declined' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/:id/complete', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Session);
    await repo.update(req.params.id, { status: 'completed', completedAt: new Date() });
    res.json({ success: true, message: 'Completed' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/:id/cancel', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Session);
    await repo.update(req.params.id, { status: 'cancelled' });
    res.json({ success: true, message: 'Cancelled' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Session);
    await repo.delete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
