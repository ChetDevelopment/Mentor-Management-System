const router = require('express').Router();
const { getRepo } = require('../db');
const { authGuard, rolesGuard } = require('../middleware/auth');
const { Category } = require('../../dist/entities/category/category.entity');

router.get('/', async (req, res) => {
  try {
    const repo = await getRepo(Category);
    const cats = await repo.find({ where: { isActive: true } });
    res.json({ success: true, data: cats });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const repo = await getRepo(Category);
    const cat = await repo.findOne({ where: { id: req.params.id } });
    if (!cat) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: cat });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(Category);
    const exists = await repo.findOne({ where: { name: req.body.name } });
    if (exists) return res.status(400).json({ success: false, message: 'Category already exists' });
    const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const cat = await repo.save({ name: req.body.name, description: req.body.description, slug, isActive: true });
    res.status(201).json({ success: true, data: cat });
  } catch (e) {
    if (e.code === '23505') return res.status(400).json({ success: false, message: 'Duplicate entry' });
    res.status(500).json({ success: false, message: e.message });
  }
});

router.put('/:id', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(Category);
    const data = { ...req.body };
    if (data.name) data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await repo.update(req.params.id, data);
    const cat = await repo.findOne({ where: { id: req.params.id } });
    res.json({ success: true, data: cat });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', authGuard, rolesGuard('admin'), async (req, res) => {
  try {
    const repo = await getRepo(Category);
    await repo.update(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
