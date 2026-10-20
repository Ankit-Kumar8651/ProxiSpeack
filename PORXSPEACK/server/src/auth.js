import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { config } from './config.js';

const USER_ID_RE = /^[a-zA-Z0-9._-]{3,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AVAILABILITY = ['Available', 'Busy', 'Away', 'Offline'];

// Never send the password hash to a browser
export const publicUser = (u) => ({
  id: u.id,
  userId: u.userId,
  name: u.name,
  email: u.email,
  role: u.role,
  department: u.department,
  jobTitle: u.jobTitle,
  avatarId: u.avatarId,
  availability: u.availability,
  assignedOffice: u.assignedOffice,
  dateJoined: u.dateJoined,
});

export const signToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

export const verifyToken = (token) => jwt.verify(token, config.jwtSecret);

/** Express middleware factory: requires a valid Bearer token and loads the user. */
export const requireAuth = (store) => async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Please log in.' });
    const payload = verifyToken(token);
    const user = await store.findById(payload.sub);
    if (!user) return res.status(401).json({ error: 'Account no longer exists.' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Administrator access required.' });
  next();
};

// Very small in-memory brute-force guard: 8 failed logins / 15 min per ip+identifier
const failures = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 8;
const failKey = (req, id) => `${req.ip}|${String(id).toLowerCase()}`;
const isLocked = (key) => {
  const entry = failures.get(key);
  if (!entry) return false;
  if (Date.now() - entry.first > WINDOW_MS) {
    failures.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILS;
};
const recordFailure = (key) => {
  const entry = failures.get(key);
  if (!entry || Date.now() - entry.first > WINDOW_MS) failures.set(key, { count: 1, first: Date.now() });
  else entry.count += 1;
};

export const authRouter = (store) => {
  const router = Router();
  const guard = requireAuth(store);

  // ---- Sign up: creates the account only; the user must log in afterwards
  router.post('/signup', async (req, res) => {
    try {
      const { name, userId, email, password, avatarId, department, adminCode } = req.body || {};

      if (!name?.trim() || !userId?.trim() || !email?.trim() || !password) {
        return res.status(400).json({ error: 'All required fields must be filled.' });
      }
      if (!USER_ID_RE.test(userId.trim())) {
        return res
          .status(400)
          .json({ error: 'User ID must be 3-20 characters: letters, numbers, dot, dash or underscore.' });
      }
      if (!EMAIL_RE.test(email.trim())) return res.status(400).json({ error: 'Enter a valid email address.' });
      if (String(password).length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      }

      let role = 'employee';
      if (adminCode) {
        if (!config.adminInviteCode || adminCode !== config.adminInviteCode) {
          return res.status(403).json({ error: 'Invalid admin invite code.' });
        }
        role = 'admin';
      }

      if (await store.findByUserId(userId.trim())) {
        return res.status(409).json({ error: 'That User ID is already taken.' });
      }
      if (await store.findByEmail(email.trim())) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      const user = {
        id: `usr-${crypto.randomUUID()}`,
        userId: userId.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        passwordHash: await bcrypt.hash(String(password), 10),
        name: name.trim().slice(0, 60),
        role,
        department: department || 'Engineering',
        jobTitle: role === 'admin' ? 'Workspace Admin' : 'Team Member',
        avatarId: avatarId || 'alex-dev',
        availability: 'Available',
        assignedOffice: 'Open Workspace HQ',
        dateJoined: new Date().toISOString().split('T')[0],
      };
      await store.createUser(user);
      res.status(201).json({ user: publicUser(user) });
    } catch (err) {
      console.error('[auth] signup failed', err);
      res.status(500).json({ error: 'Could not create the account. Please try again.' });
    }
  });

  // ---- Log in with User ID (or email) + password
  router.post('/login', async (req, res) => {
    try {
      const { identifier, password } = req.body || {};
      if (!identifier?.trim() || !password) {
        return res.status(400).json({ error: 'Enter your User ID and password.' });
      }
      const key = failKey(req, identifier);
      if (isLocked(key)) {
        return res.status(429).json({ error: 'Too many failed attempts. Try again in 15 minutes.' });
      }

      const user = await store.findByIdentifier(identifier);
      // Same message for "no such user" and "wrong password" (no account enumeration)
      const ok = user && (await bcrypt.compare(String(password), user.passwordHash));
      if (!ok) {
        recordFailure(key);
        return res.status(401).json({ error: 'Invalid User ID or password.' });
      }
      failures.delete(key);
      res.json({ token: signToken(user), user: publicUser(user) });
    } catch (err) {
      console.error('[auth] login failed', err);
      res.status(500).json({ error: 'Login failed. Please try again.' });
    }
  });

  router.get('/me', guard, (req, res) => res.json({ user: publicUser(req.user) }));

  router.post('/logout', (_req, res) => res.status(204).end());

  router.put('/profile', guard, async (req, res) => {
    const allowed = {};
    const b = req.body || {};
    if (typeof b.name === 'string' && b.name.trim()) allowed.name = b.name.trim().slice(0, 60);
    if (typeof b.jobTitle === 'string') allowed.jobTitle = b.jobTitle.slice(0, 80);
    if (typeof b.department === 'string') allowed.department = b.department.slice(0, 40);
    if (typeof b.avatarId === 'string') allowed.avatarId = b.avatarId.slice(0, 40);
    if (AVAILABILITY.includes(b.availability)) allowed.availability = b.availability;
    const updated = await store.updateUser(req.user.id, allowed);
    res.json({ user: publicUser(updated) });
  });

  return router;
};

/** Create the first administrator if it does not exist yet. */
export const seedAdmin = async (store) => {
  const existing = await store.findByUserId(config.adminUserId);
  if (existing) return;
  await store.createUser({
    id: `usr-${crypto.randomUUID()}`,
    userId: config.adminUserId,
    email: config.adminEmail,
    passwordHash: await bcrypt.hash(config.adminPassword, 10),
    name: 'Workspace Admin',
    role: 'admin',
    department: 'Engineering',
    jobTitle: 'Administrator',
    avatarId: 'alex-dev',
    availability: 'Available',
    assignedOffice: 'Engineering Bay Alpha',
    dateJoined: new Date().toISOString().split('T')[0],
  });
  console.log(`[seed] Admin account created -> User ID: "${config.adminUserId}"  Password: "${config.adminPassword}"`);
  if (config.adminPassword === 'Admin@12345') console.log('[seed] Change ADMIN_PASSWORD in .env before sharing this server.');
};
