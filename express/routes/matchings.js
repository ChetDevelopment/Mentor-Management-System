const router = require('express').Router();
const { getRepo } = require('../db');
const { authGuard, rolesGuard } = require('../middleware/auth');
const { Matching } = require('../../dist/entities/matching/matching.entity');

router.get('/', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Matching);
    const list = await repo.find();
    res.json({ success: true, data: list });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/:id', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Matching);
    const m = await repo.findOne({ where: { id: req.params.id } });
    if (!m) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: m });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(Matching);
    const m = await repo.save({ mentorId: req.body.mentorId, menteeId: req.body.menteeId, reason: req.body.reason, status: 'pending' });
    res.status(201).json({ success: true, data: m });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Matching);
    await repo.update(req.params.id, req.body);
    res.json({ success: true, message: 'Updated' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(Matching);
    await repo.delete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
