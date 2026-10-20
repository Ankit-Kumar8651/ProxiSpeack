// Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { FileStore } from '../src/store.js';
import { findSpawn, isWalkable, nearby, distance, clampToMap } from '../src/world.js';

test('findSpawn returns walkable, non-overlapping spots', () => {
  const occupied = [];
  for (let i = 0; i < 18; i++) {
    const p = findSpawn({ x: 220, y: 150 }, occupied);
    assert.ok(isWalkable(p.x, p.y), `spot ${JSON.stringify(p)} must be walkable`);
    assert.ok(occupied.every((o) => distance(o, p) >= 42), 'spots must not overlap');
    occupied.push(p);
  }
});

test('findSpawn rejects spots inside desks and out of bounds', () => {
  const inDesk = findSpawn({ x: 150, y: 110 }, []);
  assert.ok(isWalkable(inDesk.x, inDesk.y));
  const off = clampToMap({ x: -500, y: 99999 });
  assert.deepEqual(off, { x: 20, y: 630 });
});

test('nearby() filters by pixel radius and excludes self', () => {
  const m = new Map([
    ['a', { socketId: 'a', x: 100, y: 100 }],
    ['b', { socketId: 'b', x: 150, y: 100 }],
    ['c', { socketId: 'c', x: 900, y: 600 }],
  ]);
  assert.deepEqual(nearby(m, m.get('a'), 200, 'a').map((p) => p.socketId), ['b']);
});

test('nearby() over 200 users stays well under 20 ms', () => {
  const m = new Map();
  for (let i = 0; i < 200; i++) m.set(String(i), { socketId: String(i), x: Math.random() * 1000, y: Math.random() * 650 });
  const t0 = performance.now();
  for (let i = 0; i < 200; i++) nearby(m, m.get(String(i)), 200, String(i));
  const perQuery = (performance.now() - t0) / 200;
  assert.ok(perQuery < 20, `took ${perQuery.toFixed(3)} ms per query`);
});

test('FileStore persists users and finds by userId or email', async () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'ps-')), 'db.json');
  const s1 = new FileStore(file);
  await s1.init();
  await s1.createUser({ id: 'u1', userId: 'alex', email: 'alex@x.com', passwordHash: 'h', name: 'Alex' });
  assert.equal((await s1.findByIdentifier('ALEX')).id, 'u1');
  assert.equal((await s1.findByIdentifier('Alex@X.com')).id, 'u1');
  assert.equal(await s1.findByIdentifier('nobody'), null);

  const s2 = new FileStore(file); // simulates a server restart
  await s2.init();
  assert.equal((await s2.findById('u1')).name, 'Alex');
  await s2.updateUser('u1', { name: 'Alexander' });
  assert.equal((await s2.findById('u1')).name, 'Alexander');
});
