const router = require('express').Router();
const { getRepo } = require('../db');
const { authGuard, rolesGuard } = require('../middleware/auth');
const { Notification } = require('../../dist/entities/notification.entity');

router.post('/', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(Notification);
    const notif = await repo.save({ userId: req.body.userId, title: req.body.title, message: req.body.message, type: req.body.type || 'in_app', isRead: false });
    res.status(201).json({ success: true, data: notif });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Notification);
    const notifs = await repo.find({ where: { userId: req.user.userId }, order: { createdAt: 'DESC' } });
    res.json({ success: true, data: notifs });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/unread', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Notification);
    const notifs = await repo.find({ where: { userId: req.user.userId, isRead: false }, order: { createdAt: 'DESC' } });
    res.json({ success: true, data: notifs });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/detail/:id', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Notification);
    const notif = await repo.findOne({ where: { id: req.params.id } });
    if (!notif) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: notif });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id/read', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Notification);
    await repo.update(req.params.id, { isRead: true, readAt: new Date() });
    res.json({ success: true, message: 'Marked as read' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/read-all', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Notification);
    await repo.update({ userId: req.user.userId, isRead: false }, { isRead: true, readAt: new Date() });
    res.json({ success: true, message: 'All marked as read' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Notification);
    const notif = await repo.findOne({ where: { id: req.params.id } });
    if (!notif) return res.status(404).json({ success: false, message: 'Not found' });
    await repo.delete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
