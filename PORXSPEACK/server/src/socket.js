import { verifyToken, publicUser } from './auth.js';
import { findSpawn, clampToMap, isFinitePoint, distance, RELAY_RANGE } from './world.js';

const ROOM_RE = /^[a-zA-Z0-9_-]{1,40}$/;
const SIGNAL_TYPES = new Set(['offer', 'answer', 'candidate', 'bye']);

export const attachSocket = (io, store) => {
  /** roomId -> Map(socketId -> participant) */
  const rooms = new Map();
  const channel = (roomId) => `room:${roomId}`;

  // ---- Only logged-in users may open a socket; identity comes from the token, not the client
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('unauthorized'));
      const payload = verifyToken(token);
      const user = await store.findById(payload.sub);
      if (!user) return next(new Error('unauthorized'));
      socket.data.user = publicUser(user);
      next();
    } catch {
      next(new Error('unauthorized'));
    }
  });

  const leaveRoom = (socket) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (room) {
      room.delete(socket.id);
      if (room.size === 0) rooms.delete(roomId);
    }
    socket.leave(channel(roomId));
    socket.to(channel(roomId)).emit('presence:left', { socketId: socket.id });
    socket.data.roomId = null;
  };

  const me = (socket) => rooms.get(socket.data.roomId)?.get(socket.id);

  io.on('connection', (socket) => {
    socket.on('office:join', (payload = {}) => {
      leaveRoom(socket);

      const roomId = ROOM_RE.test(payload.roomId || '') ? payload.roomId : 'main-hq';
      const room = rooms.get(roomId) || new Map();
      rooms.set(roomId, room);

      const position = findSpawn(payload.initialPosition, [...room.values()]);
      const u = socket.data.user;
      const participant = {
        socketId: socket.id,
        id: u.id,
        name: u.name,
        email: u.email,
        avatarId: u.avatarId,
        role: u.role,
        jobTitle: u.jobTitle,
        department: u.department,
        availability: u.availability,
        micActive: Boolean(payload.user?.micActive),
        speaking: false,
        x: position.x,
        y: position.y,
      };

      room.set(socket.id, participant);
      socket.data.roomId = roomId;
      socket.join(channel(roomId));

      socket.emit('office:joined', {
        socketId: socket.id,
        position,
        participants: [...room.values()],
      });
      socket.to(channel(roomId)).emit('presence:joined', participant);
    });

    socket.on('office:leave', () => leaveRoom(socket));

    socket.on('position:update', (pos) => {
      const p = me(socket);
      if (!p || !isFinitePoint(pos)) return;
      const next = clampToMap(pos);
      p.x = next.x;
      p.y = next.y;
      // volatile: if a client is slow, drop stale movement instead of queueing it
      socket.to(channel(socket.data.roomId)).volatile.emit('position:update', { socketId: socket.id, ...next });
    });

    socket.on('mic:toggle', ({ active } = {}) => {
      const p = me(socket);
      if (!p) return;
      p.micActive = Boolean(active);
      socket.to(channel(socket.data.roomId)).emit('mic:status', { socketId: socket.id, micActive: p.micActive });
    });

    socket.on('speaking:update', ({ speaking } = {}) => {
      const p = me(socket);
      if (!p) return;
      p.speaking = Boolean(speaking);
      socket.to(channel(socket.data.roomId)).volatile.emit('speaking:update', { socketId: socket.id, speaking: p.speaking });
    });

    // ---- WebRTC signaling relay (offer / answer / ICE candidate / bye)
    socket.on('webrtc:signal', ({ toSocketId, signalData } = {}) => {
      const from = me(socket);
      const to = rooms.get(socket.data.roomId)?.get(toSocketId);
      if (!from || !to || !signalData || !SIGNAL_TYPES.has(signalData.type)) return;
      if (signalData.sdp && String(signalData.sdp).length > 50_000) return;

      // Only people "within earshot" may start a call
      if (signalData.type === 'offer' && distance(from, to) > RELAY_RANGE) return;

      io.to(toSocketId).emit('webrtc:signal', { fromSocketId: socket.id, signalData });
    });

    socket.on('wave:send', ({ toSocketId, message } = {}) => {
      const from = me(socket);
      const to = rooms.get(socket.data.roomId)?.get(toSocketId);
      if (!from || !to) return;
      io.to(toSocketId).emit('wave:received', {
        fromUser: { id: from.id, name: from.name, avatarId: from.avatarId, socketId: from.socketId },
        message: String(message || `${from.name} sent you a wave!`).slice(0, 200),
      });
    });

    socket.on('disconnect', () => leaveRoom(socket));
  });

  return { rooms };
};
