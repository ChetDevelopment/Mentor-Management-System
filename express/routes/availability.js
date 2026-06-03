const router = require('express').Router();
const { getRepo } = require('../db');
const { authGuard, rolesGuard } = require('../middleware/auth');
const { Availability } = require('../../dist/entities/availability/availability.entity');
const { BlockedDate } = require('../../dist/entities/blocked-date.entity');

router.get('/:mentorId', async (req, res) => {
  try {
    const repo = await getRepo(Availability);
    const avails = await repo.find({ where: { mentorId: req.params.mentorId, isActive: true } });
    res.json({ success: true, data: avails });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/:mentorId/slots', async (req, res) => {
  try {
    const repo = await getRepo(Availability);
    const date = req.query.date;
    const dayMap = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
    const dow = dayMap[new Date(date).getDay()];
    const avails = await repo.find({ where: { mentorId: req.params.mentorId, dayOfWeek: dow, isActive: true } });
    res.json({ success: true, data: avails });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/', authGuard, rolesGuard('mentor'), async (req, res) => {
  try {
    const repo = await getRepo(Availability);
    const avail = await repo.save({ mentorId: req.body.mentorId, dayOfWeek: req.body.dayOfWeek, startTime: req.body.startTime, endTime: req.body.endTime, isActive: true });
    res.status(201).json({ success: true, data: avail });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id', authGuard, rolesGuard('mentor'), async (req, res) => {
  try {
    const repo = await getRepo(Availability);
    await repo.update(req.params.id, req.body);
    res.json({ success: true, message: 'Updated' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', authGuard, rolesGuard('mentor'), async (req, res) => {
  try {
    const repo = await getRepo(Availability);
    await repo.delete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/block', authGuard, rolesGuard('mentor'), async (req, res) => {
  try {
    const repo = await getRepo(BlockedDate);
    const block = await repo.save({ mentorId: req.body.mentorId, blockedDate: req.body.blockedDate, reason: req.body.reason });
    res.status(201).json({ success: true, data: block });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/block/:id', authGuard, rolesGuard('mentor'), async (req, res) => {
  try {
    const repo = await getRepo(BlockedDate);
    await repo.delete(req.params.id);
    res.json({ success: true, message: 'Unblocked' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
