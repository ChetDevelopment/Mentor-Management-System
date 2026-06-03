const router = require('express').Router();
const { getRepo } = require('../db');
const { authGuard, rolesGuard } = require('../middleware/auth');
const { Mentee } = require('../../dist/entities/mentee/mentee.entity');

router.get('/', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Mentee);
    const mentees = await repo.find({ relations: ['user'] });
    const result = mentees.map(m => ({ ...m, user: m.user ? { id: m.user.id, email: m.user.email, firstName: m.user.firstName, lastName: m.user.lastName } : null }));
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Mentee);
    const mentee = await repo.save({ userId: req.body.userId, currentLevel: req.body.currentLevel, organization: req.body.organization, careerGoal: req.body.careerGoal, interests: req.body.interests || [], isActive: true });
    res.status(201).json({ success: true, data: mentee });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/:id', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Mentee);
    const m = await repo.findOne({ where: { id: req.params.id }, relations: ['user'] });
    if (!m) return res.status(404).json({ success: false, message: 'Not found' });
    if (m.user) m.user = { id: m.user.id, email: m.user.email, firstName: m.user.firstName, lastName: m.user.lastName };
    res.json({ success: true, data: m });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Mentee);
    await repo.update(req.params.id, req.body);
    res.json({ success: true, message: 'Updated' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(Mentee);
    const m = await repo.findOne({ where: { id: req.params.id } });
    if (!m) return res.status(404).json({ success: false, message: 'Not found' });
    await repo.delete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
