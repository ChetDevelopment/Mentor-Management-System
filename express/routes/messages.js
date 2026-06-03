const router = require('express').Router();
const { getRepo } = require('../db');
const { authGuard } = require('../middleware/auth');
const { Message } = require('../../dist/entities/message.entity');

router.post('/', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Message);
    const msg = await repo.save({ senderId: req.body.senderId, receiverId: req.body.receiverId, content: req.body.content, isRead: false });
    res.status(201).json({ success: true, data: msg });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/conversations', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Message);
    const msgs = await repo.find({
      where: [{ senderId: req.user.userId }, { receiverId: req.user.userId }],
      order: { createdAt: 'DESC' },
      take: 50,
    });
    res.json({ success: true, data: msgs });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/:senderId/:receiverId', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Message);
    const msgs = await repo.find({
      where: [
        { senderId: req.params.senderId, receiverId: req.params.receiverId },
        { senderId: req.params.receiverId, receiverId: req.params.senderId },
      ],
      order: { createdAt: 'ASC' },
    });
    res.json({ success: true, data: msgs });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id/read', authGuard, async (req, res) => {
  try {
    const repo = await getRepo(Message);
    await repo.update(req.params.id, { isRead: true, readAt: new Date() });
    res.json({ success: true, message: 'Marked as read' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
