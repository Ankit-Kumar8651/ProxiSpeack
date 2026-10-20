import { Router } from 'express';
import { requireAuth, requireAdmin, publicUser } from './auth.js';

const toEmployee = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  department: u.department,
  jobTitle: u.jobTitle,
  role: u.role,
  avatarId: u.avatarId,
  availability: u.availability,
  assignedOffice: u.assignedOffice,
  dateJoined: u.dateJoined,
});

// Express 4 does not catch rejected promises by itself
const h = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const pick = (b, keys) => Object.fromEntries(keys.filter((k) => b[k] !== undefined).map((k) => [k, b[k]]));
const EDITABLE = ['name', 'email', 'department', 'jobTitle', 'role', 'avatarId', 'availability', 'assignedOffice', 'x', 'y'];

export const employeesRouter = (store) => {
  const router = Router();
  router.use(requireAuth(store)); // every route needs a logged-in user

  // Everyone who is logged in can see the roster
  router.get('/', h(async (_req, res) => {
    const [users, roster] = await Promise.all([store.listUsers(), store.listRoster()]);
    res.json({ employees: [...users.map(toEmployee), ...roster] });
  }));

  // Only admins can change it
  router.post('/', requireAdmin, h(async (req, res) => {
    const b = req.body || {};
    if (!b.name?.trim() || !b.email?.trim()) return res.status(400).json({ error: 'Name and email are required.' });
    const email = b.email.trim().toLowerCase();
    const [users, roster] = await Promise.all([store.listUsers(), store.listRoster()]);
    if ([...users, ...roster].some((e) => e.email?.toLowerCase() === email)) {
      return res.status(409).json({ error: 'An employee with this email address already exists.' });
    }
    const wanted = /^EMP-\d+$/.test(b.id || '') && !roster.some((e) => e.id === b.id) ? b.id : null;
    const max = roster.reduce((m, e) => Math.max(m, Number(e.id?.match(/EMP-(\d+)/)?.[1] || 0)), 0);
    const entry = {
      ...pick(b, EDITABLE),
      id: wanted || `EMP-${String(max + 1).padStart(3, '0')}`,
      email,
      role: b.role === 'admin' ? 'admin' : 'employee',
      dateJoined: new Date().toISOString().split('T')[0],
    };
    res.status(201).json({ employee: await store.addRoster(entry) });
  }));

  router.put('/:id', requireAdmin, h(async (req, res) => {
    const updates = pick(req.body || {}, EDITABLE);
    const asUser = await store.findById(req.params.id);
    if (asUser) {
      // Passwords/ids can never be changed through this route; keep at least one admin
      if (asUser.id === req.user.id && updates.role && updates.role !== 'admin') {
        return res.status(400).json({ error: 'You cannot remove your own admin role.' });
      }
      delete updates.x;
      delete updates.y;
      delete updates.email;
      return res.json({ employee: toEmployee(await store.updateUser(asUser.id, updates)) });
    }
    const entry = await store.updateRoster(req.params.id, updates);
    if (!entry) return res.status(404).json({ error: 'Employee not found.' });
    res.json({ employee: entry });
  }));

  router.delete('/:id', requireAdmin, h(async (req, res) => {
    if (req.params.id === req.user.id) return res.status(400).json({ error: 'You cannot delete your own account.' });
    const removed = (await store.deleteUser(req.params.id)) || (await store.deleteRoster(req.params.id));
    if (!removed) return res.status(404).json({ error: 'Employee not found.' });
    res.status(204).end();
  }));

  return router;
};

export { publicUser };
