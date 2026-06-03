require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { getDb } = require('./db');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/v1/health', require('./routes/health'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/skills', require('./routes/skills'));
app.use('/api/v1/categories', require('./routes/categories'));
app.use('/api/v1/mentors', require('./routes/mentors'));
app.use('/api/v1/mentees', require('./routes/mentees'));
app.use('/api/v1/sessions', require('./routes/sessions'));
app.use('/api/v1/resources', require('./routes/resources'));
app.use('/api/v1/availabilities', require('./routes/availability'));
app.use('/api/v1/notifications', require('./routes/notifications'));
app.use('/api/v1/messages', require('./routes/messages'));
app.use('/api/v1/matchings', require('./routes/matchings'));
app.use('/api/v1/feedback', require('./routes/feedback'));
app.use('/api/v1/admin', require('./routes/admin'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || 'Internal error' });
});

const PORT = process.env.PORT || 3000;

// For Vercel — export handler
if (process.env.VERCEL) {
  getDb().then(() => console.log('DB ready for Vercel'));
  module.exports = app;
} else {
  // For local — start server
  getDb().then(() => {
    app.listen(PORT, () => console.log(`Express server running on port ${PORT}`));
  }).catch(err => {
    console.error('Failed to connect to DB:', err.message);
    process.exit(1);
  });
}
