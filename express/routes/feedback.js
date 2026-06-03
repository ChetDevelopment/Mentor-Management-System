const router = require('express').Router();
const { getRepo } = require('../db');
const { authGuard, rolesGuard } = require('../middleware/auth');
const { Feedback } = require('../../dist/entities/feedback/feedback.entity');

router.get('/', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Feedback);
    const list = await repo.find();
    res.json({ success: true, data: list });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/mentor/:mentorId', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Feedback);
    const list = await repo.find({ where: { mentorId: req.params.mentorId } });
    res.json({ success: true, data: list });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/:id', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Feedback);
    const fb = await repo.findOne({ where: { id: req.params.id } });
    if (!fb) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: fb });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Feedback);
    const sessionId = req.body.sessionId || '00000000-0000-0000-0000-000000000000';
    const fb = await repo.save({ mentorId: req.body.mentorId, menteeId: req.body.menteeId, sessionId, rating: req.body.rating || 1, comment: req.body.comment, isAnonymous: req.body.isAnonymous || false });
    res.status(201).json({ success: true, data: fb });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Feedback);
    await repo.update(req.params.id, req.body);
    res.json({ success: true, message: 'Updated' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Feedback);
    await repo.delete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
