const router = require('express').Router();
const { getRepo } = require('../db');
const { authGuard, rolesGuard } = require('../middleware/auth');
const { Skill } = require('../../dist/entities/skill/skill.entity');

router.get('/', async (req, res) => {
  try {
    const repo = await getRepo(Skill);
    const skills = await repo.find({ where: { isActive: true } });
    res.json({ success: true, data: skills });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/category/:categoryId', async (req, res) => {
  try {
    const repo = await getRepo(Skill);
    const skills = await repo.find({ where: { categoryId: req.params.categoryId, isActive: true } });
    res.json({ success: true, data: skills });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const repo = await getRepo(Skill);
    const skill = await repo.findOne({ where: { id: req.params.id } });
    if (!skill) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: skill });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(Skill);
    const exists = await repo.findOne({ where: { name: req.body.name } });
    if (exists) return res.status(400).json({ success: false, message: 'Skill already exists' });
    const skill = await repo.save({ name: req.body.name, description: req.body.description, isActive: true });
    res.status(201).json({ success: true, data: skill });
  } catch (e) {
    if (e.code === '23505') return res.status(400).json({ success: false, message: 'Duplicate entry' });
    res.status(500).json({ success: false, message: e.message });
  }
});

router.put('/:id', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(Skill);
    await repo.update(req.params.id, req.body);
    const skill = await repo.findOne({ where: { id: req.params.id } });
    res.json({ success: true, data: skill });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(Skill);
    await repo.update(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
