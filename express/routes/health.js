const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() }, message: 'Server running' });
});

module.exports = router;
