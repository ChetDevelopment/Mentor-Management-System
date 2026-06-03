const router = require('express').Router();
const { getRepo } = require('../db');
const { authGuard, rolesGuard } = require('../middleware/auth');
const { Resource } = require('../../dist/entities/resource/resource.entity');

router.get('/:mentorId', async (req, res) => {
  try {
    const repo = await getRepo(Resource);
    const resources = await repo.find({ where: { mentorId: req.params.mentorId } });
    res.json({ success: true, data: resources });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/', authGuard, rolesGuard('mentor'), async (req, res) => {
  try {
    const repo = await getRepo(Resource);
    const resource = await repo.save({ mentorId: req.body.mentorId, title: req.body.title, description: req.body.description, type: req.body.type || 'document', fileUrl: req.body.fileUrl, linkUrl: req.body.linkUrl });
    res.status(201).json({ success: true, data: resource });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', authGuard, rolesGuard('mentor'), async (req, res) => {
  try {
    const repo = await getRepo(Resource);
    await repo.delete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
