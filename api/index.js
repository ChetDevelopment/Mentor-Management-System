const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { DataSource } = require('typeorm');

let dataSource = null;
let appReady = false;
const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Lazy DB connection
async function getDb() {
  if (appReady) return;
  if (dataSource) return;

  dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    synchronize: false,
    logging: ['error'],
    entities: [
      require('../dist/entities/user/user.entity').User,
      require('../dist/entities/mentor/mentor.entity').Mentor,
      require('../dist/entities/mentee/mentee.entity').Mentee,
      require('../dist/entities/skill/skill.entity').Skill,
      require('../dist/entities/category/category.entity').Category,
      require('../dist/entities/session/session.entity').Session,
      require('../dist/entities/message.entity').Message,
      require('../dist/entities/notification.entity').Notification,
      require('../dist/entities/resource/resource.entity').Resource,
      require('../dist/entities/availability/availability.entity').Availability,
      require('../dist/entities/blocked-date.entity').BlockedDate,
      require('../dist/entities/feedback/feedback.entity').Feedback,
      require('../dist/entities/matching/matching.entity').Matching,
    ],
    extra: { max: 5 },
  });

  await dataSource.initialize();
  appReady = true;
  console.log('DB connected');
}

// Middleware to ensure DB is ready
app.use(async (req, res, next) => {
  try {
    await getDb();
    next();
  } catch (e) {
    console.error('DB error:', e.message);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

// Inject DB
app.use((req, res, next) => {
  req.getRepo = (entity) => dataSource.getRepository(entity);
  next();
});

// Health (no DB needed)
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// Root welcome page
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html><head><title>Mentor Management API</title><style>body{font-family:system-ui;max-width:700px;margin:50px auto;padding:20px;background:#f5f5f5}h1{color:#1a237e}a{color:#1565c0}</style></head>
<body>
<h1>Mentor Management System API</h1>
<p>Status: Running</p>
<p>Base URL: <code>/api/v1</code></p>
<h2>Quick Links</h2>
<ul>
<li><a href="/api/v1/health">Health Check</a></li>
<li><a href="/api/v1/skills">Skills (Public)</a></li>
<li><a href="/api/v1/mentors">Mentors (Public)</a></li>
<li><a href="/api/v1/categories">Categories (Public)</a></li>
</ul>
</body></html>`);
});

// Auth
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function authGuard(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Auth required' });
  try { req.user = jwt.verify(h.slice(7), JWT_SECRET); next(); }
  catch { return res.status(401).json({ success: false, message: 'Invalid token' }); }
}
function roles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Auth required' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, message: 'Forbidden' });
    next();
  };
}

const { User } = require('../dist/entities/user/user.entity');

app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
    const repo = dataSource.getRepository(User);
    const user = await repo.findOne({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ success: true, data: { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    if (password.length < 12) return res.status(400).json({ success: false, message: 'Password must be 12+ chars' });
    const repo = dataSource.getRepository(User);
    const exists = await repo.findOne({ where: { email } });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await repo.save({ email, password: hashed, firstName, lastName, role: role || 'mentee', isActive: true });
    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ success: true, data: { user: { id: user.id, email: user.email, role: user.role }, accessToken } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Skills
const { Skill } = require('../dist/entities/skill/skill.entity');
app.get('/api/v1/skills', async (req, res) => {
  const list = await dataSource.getRepository(Skill).find({ where: { isActive: true } });
  res.json({ success: true, data: list });
});
app.post('/api/v1/skills', authGuard, roles('admin'), async (req, res) => {
  const exists = await dataSource.getRepository(Skill).findOne({ where: { name: req.body.name } });
  if (exists) return res.status(400).json({ success: false, message: 'Already exists' });
  const skill = await dataSource.getRepository(Skill).save({ name: req.body.name, isActive: true });
  res.status(201).json({ success: true, data: skill });
});
app.get('/api/v1/skills/:id', async (req, res) => {
  const s = await dataSource.getRepository(Skill).findOne({ where: { id: req.params.id } });
  if (!s) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: s });
});
app.put('/api/v1/skills/:id', authGuard, roles('admin'), async (req, res) => {
  await dataSource.getRepository(Skill).update(req.params.id, req.body);
  res.json({ success: true, message: 'Updated' });
});
app.delete('/api/v1/skills/:id', authGuard, roles('admin'), async (req, res) => {
  await dataSource.getRepository(Skill).update(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Deleted' });
});

// Categories
const { Category } = require('../dist/entities/category/category.entity');
app.get('/api/v1/categories', async (req, res) => {
  const list = await dataSource.getRepository(Category).find({ where: { isActive: true } });
  res.json({ success: true, data: list });
});
app.post('/api/v1/categories', authGuard, roles('admin'), async (req, res) => {
  const exists = await dataSource.getRepository(Category).findOne({ where: { name: req.body.name } });
  if (exists) return res.status(400).json({ success: false, message: 'Already exists' });
  const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const cat = await dataSource.getRepository(Category).save({ name: req.body.name, slug, isActive: true });
  res.status(201).json({ success: true, data: cat });
});
app.put('/api/v1/categories/:id', authGuard, roles('admin'), async (req, res) => {
  await dataSource.getRepository(Category).update(req.params.id, req.body);
  res.json({ success: true, message: 'Updated' });
});
app.delete('/api/v1/categories/:id', authGuard, roles('admin'), async (req, res) => {
  await dataSource.getRepository(Category).update(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Deleted' });
});

// Mentors
const { Mentor } = require('../dist/entities/mentor/mentor.entity');
app.get('/api/v1/mentors', async (req, res) => {
  const list = await dataSource.getRepository(Mentor).find({ relations: ['user'] });
  res.json({ success: true, data: list });
});

// Mentees
const { Mentee } = require('../dist/entities/mentee/mentee.entity');
app.get('/api/v1/mentees', authGuard, async (req, res) => {
  const list = await dataSource.getRepository(Mentee).find({ relations: ['user'] });
  res.json({ success: true, data: list });
});

// Admin
app.get('/api/v1/admin/dashboard', authGuard, roles('admin'), async (req, res) => {
  const [users, mentors] = await Promise.all([
    dataSource.getRepository(User).count(),
    dataSource.getRepository(Mentor).count(),
  ]);
  res.json({ success: true, data: { totalUsers: users, totalMentors: mentors } });
});

// Catch-all
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, next) => res.status(500).json({ success: false, message: err.message || 'Error' }));

module.exports = app;
