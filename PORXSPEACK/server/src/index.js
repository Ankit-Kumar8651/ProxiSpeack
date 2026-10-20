import express from 'express';
import cors from 'cors';
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Server } from 'socket.io';

import { config } from './config.js';
import { createStore } from './store.js';
import { authRouter, seedAdmin } from './auth.js';
import { employeesRouter } from './employees.js';
import { attachSocket } from './socket.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const store = createStore();
await store.init();
await seedAdmin(store);

const app = express();
app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, store: store.kind }));
app.use('/api/auth', authRouter(store));
app.use('/api/employees', employeesRouter(store));
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

// Optional: serve the built client (client/dist) from this same server
const dist = path.join(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(path.join(dist, 'index.html'))) {
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use((err, _req, res, _next) => {
  console.error('[http] unhandled error', err);
  res.status(500).json({ error: 'Internal server error.' });
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: config.clientOrigin, credentials: true } });
attachSocket(io, store);

server.listen(config.port, () => {
  console.log(`[server] ProxiSpeak API + signaling on http://localhost:${config.port}  (store: ${store.kind})`);
});
