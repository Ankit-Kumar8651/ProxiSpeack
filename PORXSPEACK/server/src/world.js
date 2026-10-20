// Virtual office geometry (must match the client's OfficePage.jsx)
export const MAP = { w: 1000, h: 650 };
export const AVATAR_RADIUS = 20;

export const OBSTACLES = [
  { x: 90, y: 90, w: 180, h: 50 },
  { x: 340, y: 90, w: 180, h: 50 },
  { x: 90, y: 200, w: 180, h: 50 },
  { x: 340, y: 200, w: 180, h: 50 },
  { x: 720, y: 110, w: 170, h: 110 },
  { x: 70, y: 400, w: 70, h: 50 },
  { x: 180, y: 400, w: 70, h: 50 },
  { x: 70, y: 510, w: 70, h: 50 },
  { x: 180, y: 510, w: 70, h: 50 },
  { x: 700, y: 400, w: 90, h: 90 },
  { x: 840, y: 400, w: 90, h: 90 },
];

const SPAWN_SPOTS = [
  { x: 220, y: 150 }, { x: 470, y: 150 }, { x: 220, y: 260 }, { x: 470, y: 260 },
  { x: 180, y: 320 }, { x: 450, y: 320 }, { x: 620, y: 220 }, { x: 620, y: 450 },
  { x: 780, y: 350 }, { x: 890, y: 520 }, { x: 300, y: 480 }, { x: 550, y: 120 },
  { x: 300, y: 380 }, { x: 600, y: 540 }, { x: 780, y: 240 }, { x: 850, y: 240 },
  { x: 120, y: 320 }, { x: 530, y: 420 },
];

// Peers farther apart than this will not have WebRTC offers relayed (client hears up to 200px)
export const RELAY_RANGE = 450;

export const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export const isFinitePoint = (p) => p && Number.isFinite(p.x) && Number.isFinite(p.y);

export const clampToMap = (p) => ({
  x: Math.round(Math.min(MAP.w - AVATAR_RADIUS, Math.max(AVATAR_RADIUS, p.x))),
  y: Math.round(Math.min(MAP.h - AVATAR_RADIUS, Math.max(AVATAR_RADIUS, p.y))),
});

export const isWalkable = (x, y) => {
  if (x - AVATAR_RADIUS < 15 || x + AVATAR_RADIUS > MAP.w - 15) return false;
  if (y - AVATAR_RADIUS < 15 || y + AVATAR_RADIUS > MAP.h - 15) return false;
  return !OBSTACLES.some(
    (o) => x + AVATAR_RADIUS > o.x && x - AVATAR_RADIUS < o.x + o.w && y + AVATAR_RADIUS > o.y && y - AVATAR_RADIUS < o.y + o.h
  );
};

/** First valid, unoccupied spot: the requested one if possible, else a known-good spawn. */
export const findSpawn = (requested, occupied) => {
  const free = (p) => isWalkable(p.x, p.y) && occupied.every((o) => distance(o, p) >= 42);
  if (isFinitePoint(requested)) {
    const p = clampToMap(requested);
    if (free(p)) return p;
  }
  for (const spot of SPAWN_SPOTS) if (free(spot)) return { ...spot };
  for (let y = 40; y < MAP.h; y += 30) {
    for (let x = 40; x < MAP.w; x += 30) if (free({ x, y })) return { x, y };
  }
  return { ...SPAWN_SPOTS[0] };
};

/** Participants within `range` pixels of `origin` (brute force: fine for 50-200 users per room). */
export const nearby = (participants, origin, range, exceptSocketId) =>
  [...participants.values()].filter((p) => p.socketId !== exceptSocketId && distance(p, origin) <= range);
