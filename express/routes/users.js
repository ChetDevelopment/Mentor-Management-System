const router = require('express').Router();
const { getRepo } = require('../db');
const { authGuard, rolesGuard } = require('../middleware/auth');
const { User } = require('../../dist/entities/user/user.entity');

router.get('/profile', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(User);
    const user = await repo.findOne({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/profile', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(User);
    await repo.update(req.user.userId, req.body);
    res.json({ success: true, message: 'Updated' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(User);
    const users = await repo.find({ select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt'] });
    res.json({ success: true, data: users });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/:id', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(User);
    const user = await repo.findOne({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(User);
    await repo.update(req.params.id, req.body);
    res.json({ success: true, message: 'Updated' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(User);
    const user = await repo.findOne({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    await repo.softDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
