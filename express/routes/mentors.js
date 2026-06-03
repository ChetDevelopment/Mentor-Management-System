const router = require('express').Router();
const { getRepo } = require('../db');
const { authGuard, rolesGuard } = require('../middleware/auth');
const { Mentor } = require('../../dist/entities/mentor/mentor.entity');

router.get('/', async (req, res) => {
  try {
    const repo = await getRepo(Mentor);
    const mentors = await repo.find({ relations: ['user'] });
    const result = mentors.map(m => ({ ...m, user: m.user ? { id: m.user.id, email: m.user.email, firstName: m.user.firstName, lastName: m.user.lastName, role: m.user.role } : null }));
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const repo = await getRepo(Mentor);
    const m = await repo.findOne({ where: { id: req.params.id }, relations: ['user'] });
    if (!m) return res.status(404).json({ success: false, message: 'Not found' });
    if (m.user) m.user = { id: m.user.id, email: m.user.email, firstName: m.user.firstName, lastName: m.user.lastName, role: m.user.role };
    res.json({ success: true, data: m });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Mentor);
    await repo.update(req.params.id, req.body);
    res.json({ success: true, message: 'Updated' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/:id/approve', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(Mentor);
    await repo.update(req.params.id, { status: 'approved', approvedAt: new Date() });
    res.status(201).json({ success: true, message: 'Approved' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/:id/reject', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(Mentor);
    await repo.update(req.params.id, { status: 'rejected', rejectionReason: req.body.reason || '' });
    res.status(201).json({ success: true, message: 'Rejected' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/:id/suspend', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(Mentor);
    await repo.update(req.params.id, { status: 'suspended' });
    res.json({ success: true, message: 'Suspended' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
