const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getRepo } = require('../db');
const { authGuard, JWT_SECRET } = require('../middleware/auth');
const { User } = require('../../dist/entities/user/user.entity');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

    const repo = await getRepo(User);
    const user = await repo.findOne({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m', audience: 'mentor-management-api', issuer: 'mentor-management-system' });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    await repo.update(user.id, { lastLogin: new Date() });
    res.status(201).json({ success: true, data: { user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName }, accessToken, refreshToken }, message: 'Login successful' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Missing required fields' });
    if (password.length < 12) return res.status(400).json({ success: false, message: 'Password must be at least 12 characters' });

    const repo = await getRepo(User);
    const exists = await repo.findOne({ where: { email } });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await repo.save({ email, password: hashed, firstName, lastName, role: role || 'mentee', isActive: true });
    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m', audience: 'mentor-management-api', issuer: 'mentor-management-system' });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ success: true, data: { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken }, message: 'Registration successful' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  res.status(201).json({ success: true, message: 'If account exists, reset link sent' });
});

// Logout
router.post('/logout', authGuard, async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out' });
});

// Sessions
router.get('/sessions', authGuard, async (req, res) => {
  res.status(200).json({ success: true, data: [] });
});

module.exports = router;
