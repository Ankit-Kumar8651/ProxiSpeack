# ProxiSpeak - Geospatial Proximity Audio

```
PORXSPEACK/
  client/   React + Vite + Canvas + Web Audio + WebRTC
  server/   Express + Socket.io (+ optional MongoDB)   <-- NEW: backend was missing from the zip
```

## Run it (two terminals)

```bash
# Terminal 1 - backend (http://localhost:4000)
cd server
npm install
copy .env.example .env        # Windows   (Mac/Linux: cp .env.example .env)
npm start

# Terminal 2 - frontend (http://localhost:5173)
cd client
npm install                   # reinstall: the old node_modules were Windows-only builds
npm run dev
```

Open **http://localhost:5173** (use `localhost`, not a LAN IP - browsers only allow the microphone on localhost/HTTPS).

### First login
The server creates one administrator on first start:

| User ID | Password     |
|---------|--------------|
| `admin` | `Admin@12345` |

Change `ADMIN_PASSWORD` in `server/.env` before sharing the server. Everybody else uses **Create an account**, then logs in.

## 1) Login / Sign-up - what changed
* **Every page except `/login` and `/signup` is protected** (Home, Features, Dashboard, Office, Employees, Profile, even the 404 page). Unauthenticated visitors are redirected to Login.
* Log in with **User ID (or email) + password**. Sign-up asks for Full Name, **User ID**, Email, Department, Password; it only *creates* the account - the user then logs in.
* Passwords are hashed with bcrypt on the server; login returns a signed JWT (12 h). The old build stored plaintext passwords in `localStorage`, accepted a fake offline login when the server was down and had "Admin Demo / Employee Demo" buttons that skipped the password. All removed.
* The session lives in `sessionStorage` and is re-verified with the server on every page load: closing the browser = log in again, and two tabs can be two different users (needed to test audio on one PC).
* Admin accounts: the public sign-up can no longer pick "Workspace Admin". Admins come from the seeded account, or from the optional **Admin Invite Code** (`ADMIN_INVITE_CODE` in `.env`; empty = disabled). Employee add/edit/delete is admin-only on the server.
* Socket.io connections also require the token, and user identity is taken from the token, not from what the browser claims.

## 2) Speaker / audio - root causes and fixes (`client/src/pages/OfficePage.jsx`)
| # | Bug | Fix |
|---|-----|-----|
| 1 | **There was no server**, so no signaling/WebRTC could ever happen | `server/` added; implements the exact events the client already used |
| 2 | The socket effect depended on callbacks that depended on `livePeers`, so **every peer movement disconnected the socket and closed all calls** | Handlers use refs; effect depends only on room + user token |
| 3 | Calls were created **without an audio line when your mic was off** - muted users could never hear anyone, and turning the mic on later never renegotiated | Offerer always reserves a send+receive audio transceiver; mic is attached with `replaceTrack` (no renegotiation) |
| 4 | `AudioContext` was created inside `ontrack` (no user gesture) and stayed **suspended** | Created/resumed on mount + every click/keypress; "Enable Sound" banner if the browser still blocks it |
| 5 | Remote WebRTC streams sent into Web Audio **stay silent in Chrome** unless also attached to a media element | Muted `<audio>` element attached to each remote stream; Web Audio does the real output |
| 6 | Volume was computed from a **stale `livePeers` closure** and ignored changes (e.g. peer un-muting) until you moved | Reads a ref and re-runs on every roster/position change |
| 7 | No speaker control at all | **Speaker On/Off**, volume slider and a **Test** tone button in the top bar |
| 8 | ICE candidates arriving before the remote description were dropped | Queued and flushed after `setRemoteDescription` |
| 9 | Two peers could both send offers (glare) | The peer with the smaller socket id always offers |
| 10 | Calls to everyone in the room (full mesh) | Calls open only within 260 px and close beyond 340 px (audible range is 200 px); server also refuses to relay offers beyond 450 px |

Audio chain per person: `MediaStreamSource -> Gain (distance volume) -> StereoPanner (left/right) -> master Gain (speaker/volume) -> speakers`.

## Test the audio with one computer
1. Sign up two accounts (e.g. `alice`, `bob`). Log in as Alice in a normal window and as Bob in an **incognito window** (or a second browser).
2. Both open **Virtual Office**, click the **Mic** button and allow the microphone.
3. Use headphones (otherwise the two tabs feed back). Walk the avatars together with WASD / arrows: volume rises as you get close and pans left/right with position.
4. No sound? Click **Test** - you should hear a beep. If you do, the speaker path is fine and the issue is the mic/permissions; if not, check the OS/browser output device.

## Optional: MongoDB
Leave `MONGODB_URI` empty to store accounts in `server/data/db.json`. To use MongoDB set e.g. `MONGODB_URI=mongodb://127.0.0.1:27017/proxispeak` and `npm install` (mongoose is an optional dependency).

## One-server production build
```bash
cd client && npm run build
cd ../server && npm start      # now serves the app AND the API on http://localhost:4000
```

## Not included yet (from the week plan)
Redis Pub/Sub scaling, MongoDB `$near`/`$geoWithin` proximity queries and the <20 ms benchmark, persisted layouts, sound-blocking furniture, and TURN servers for strict NATs. Server-side proximity currently uses an in-memory distance check (`server/src/world.js`, covered by `npm test`).
