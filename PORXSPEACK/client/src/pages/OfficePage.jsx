import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useEmployees, isPositionValid, findAvailableSpot } from '../context/EmployeeContext';
import { Avatar, AvatarGraphic, getAvatarPreset } from '../components/avatars/Avatar';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Users,
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Hand,
  MessageSquare,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  ChevronRight,
  Shield,
  Radio,
  Eye,
  EyeOff,
  Sparkles,
  Wifi,
  WifiOff,
  AlertCircle,
} from 'lucide-react';

// Audible threshold in virtual pixels (volume reaches 0 at this distance)
const AUDIBLE_RANGE = 200;
// A WebRTC call is opened a little BEFORE you can hear someone and closed a
// little AFTER you stop hearing them, so calls do not flap on the boundary.
const CONNECT_RANGE = AUDIBLE_RANGE + 60;
const DISCONNECT_RANGE = AUDIBLE_RANGE + 140;

// Zone Definitions
const ZONES = [
  {
    id: 'zone-engineering',
    name: 'Engineering Bay Alpha',
    type: 'open',
    color: 'rgba(99, 102, 241, 0.08)',
    borderColor: 'rgba(99, 102, 241, 0.35)',
    rect: { x: 30, y: 30, w: 570, h: 280 },
    description: 'General workstations & team cluster',
  },
  {
    id: 'zone-boardroom',
    name: 'Executive Boardroom',
    type: 'private',
    color: 'rgba(236, 72, 153, 0.08)',
    borderColor: 'rgba(236, 72, 153, 0.4)',
    rect: { x: 640, y: 30, w: 330, h: 280 },
    description: 'Private meeting space (Server Access Controlled)',
  },
  {
    id: 'zone-focus',
    name: 'Focus Pod (Quiet Zone)',
    type: 'focus',
    color: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    rect: { x: 30, y: 350, w: 280, h: 260 },
    description: 'Deep work zone - do not disturb',
  },
  {
    id: 'zone-lounge',
    name: 'Coffee Lounge & Discussion',
    type: 'discussion',
    color: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    rect: { x: 640, y: 350, w: 330, h: 260 },
    description: 'Casual talk, water cooler & breaks',
  },
];

// Obstacles for Collision Detection (Desks, Walls, Tables)
const OBSTACLES = [
  { x: 90, y: 90, w: 180, h: 50, label: 'Desk Cluster A' },
  { x: 340, y: 90, w: 180, h: 50, label: 'Desk Cluster B' },
  { x: 90, y: 200, w: 180, h: 50, label: 'Desk Cluster C' },
  { x: 340, y: 200, w: 180, h: 50, label: 'Desk Cluster D' },
  { x: 720, y: 110, w: 170, h: 110, label: 'Conference Table' },
  { x: 70, y: 400, w: 70, h: 50, label: 'Pod 1' },
  { x: 180, y: 400, w: 70, h: 50, label: 'Pod 2' },
  { x: 70, y: 510, w: 70, h: 50, label: 'Pod 3' },
  { x: 180, y: 510, w: 70, h: 50, label: 'Pod 4' },
  { x: 700, y: 400, w: 90, h: 90, label: 'Lounge Round Table' },
  { x: 840, y: 400, w: 90, h: 90, label: 'Coffee Bar Counter' },
];

export const OfficePage = () => {
  const { roomId = 'main-hq' } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { employees } = useEmployees();

  const canvasRef = useRef(null);

  // Office state
  const [zoom, setZoom] = useState(1);
  const [showRadar, setShowRadar] = useState(true);
  const [micActive, setMicActive] = useState(false);
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
  const [audioError, setAudioError] = useState('');
  const [activeZone, setActiveZone] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [waveAlert, setWaveAlert] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [volume, setVolume] = useState(0.9);
  const [audioState, setAudioState] = useState('suspended');

  // Player position (virtual coordinates)
  const [playerPos, setPlayerPos] = useState({ x: 220, y: 150 });
  const playerPosRef = useRef({ x: 220, y: 150 });

  // Real-time live connected participants from Socket.IO: socketId -> participant
  const [livePeers, setLivePeers] = useState(new Map());

  // Socket, WebRTC, and Audio Graph references
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const peerConnectionsRef = useRef(new Map()); // socketId -> RTCPeerConnection
  const peerAudioNodesRef = useRef(new Map()); // socketId -> { gainNode, pannerNode, sourceNode, element }
  const masterGainRef = useRef(null);
  const pendingCandidatesRef = useRef(new Map()); // socketId -> RTCIceCandidateInit[]
  const lastAttemptRef = useRef(new Map()); // socketId -> last call attempt (ms)
  const livePeersRef = useRef(new Map());
  const speakerOnRef = useRef(true);
  const volumeRef = useRef(0.9);
  const micActiveRef = useRef(false);
  const currentUserRef = useRef(currentUser);
  const activeKeysRef = useRef(new Set());
  const touchDirectionRef = useRef(null);
  const lastEmitTimeRef = useRef(0);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // Keep playerPosRef in sync with state
  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);

  // Determine current active zone
  const checkCurrentZone = useCallback((x, y) => {
    const found = ZONES.find((z) => {
      return (
        x >= z.rect.x &&
        x <= z.rect.x + z.rect.w &&
        y >= z.rect.y &&
        y <= z.rect.y + z.rect.h
      );
    });
    return found || null;
  }, []);

  // Check collision against office boundaries and obstacles
  const canMoveTo = useCallback((newX, newY) => {
    const radius = 20;
    const mapW = 1000;
    const mapH = 650;

    if (newX - radius < 15 || newX + radius > mapW - 15) return false;
    if (newY - radius < 15 || newY + radius > mapH - 15) return false;

    for (const obs of OBSTACLES) {
      if (
        newX + radius > obs.x &&
        newX - radius < obs.x + obs.w &&
        newY + radius > obs.y &&
        newY - radius < obs.y + obs.h
      ) {
        return false;
      }
    }
    return true;
  }, []);

  // Euclidean Distance calculation
  const calculateDistance = (x1, y1, x2, y2) => {
    return Math.round(Math.hypot(x2 - x1, y2 - y1));
  };

  // ======================================================================
  // AUDIO ENGINE  (Web Audio API + WebRTC)
  // Pipeline per remote peer:
  //   MediaStreamSource -> GainNode (distance volume) -> StereoPanner (left/right)
  //   -> master GainNode (speaker on/off + volume slider) -> speakers
  // ======================================================================

  // Create (or resume) the shared AudioContext + master gain.
  // Browsers keep an AudioContext "suspended" until a user gesture - this is the
  // #1 reason for "no sound", so it is resumed on every click/key press too.
  const ensureAudio = useCallback(() => {
    let ctx = audioContextRef.current;
    if (!ctx || ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
      const master = ctx.createGain();
      master.gain.value = speakerOnRef.current ? volumeRef.current : 0;
      master.connect(ctx.destination);
      masterGainRef.current = master;
      audioContextRef.current = ctx;
      ctx.onstatechange = () => setAudioState(ctx.state);
      setAudioState(ctx.state);
    }
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }, []);

  // Distance -> volume + stereo pan for every connected remote peer.
  // Reads peers from a ref (never stale) so it is safe to call from anywhere.
  const updateSpatialAudio = useCallback((pos = playerPosRef.current) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    const t = ctx.currentTime;

    peerAudioNodesRef.current.forEach((nodes, socketId) => {
      const peer = livePeersRef.current.get(socketId);
      if (!peer) return;

      const dist = Math.hypot(peer.x - pos.x, peer.y - pos.y);
      if (dist < AUDIBLE_RANGE) {
        // 1.0 when touching -> 0.0 at AUDIBLE_RANGE (curved so it feels natural)
        const volume = Math.pow(1 - dist / AUDIBLE_RANGE, 1.5);
        nodes.gainNode.gain.setTargetAtTime(volume, t, 0.05);
        if (nodes.pannerNode) {
          const pan = Math.max(-1, Math.min(1, (peer.x - pos.x) / (AUDIBLE_RANGE * 0.6)));
          nodes.pannerNode.pan.setTargetAtTime(pan, t, 0.05);
        }
      } else {
        nodes.gainNode.gain.setTargetAtTime(0, t, 0.05);
      }
    });
  }, []);

  const detachRemoteAudio = useCallback((remoteSocketId) => {
    const nodes = peerAudioNodesRef.current.get(remoteSocketId);
    if (!nodes) return;
    try {
      nodes.sourceNode.disconnect();
      nodes.gainNode.disconnect();
      if (nodes.pannerNode) nodes.pannerNode.disconnect();
    } catch {
      /* already disconnected */
    }
    if (nodes.element) {
      nodes.element.pause();
      nodes.element.srcObject = null;
    }
    peerAudioNodesRef.current.delete(remoteSocketId);
  }, []);

  // Route an incoming remote MediaStream through the spatial audio graph
  const attachRemoteAudio = useCallback(
    (remoteSocketId, stream) => {
      const ctx = ensureAudio();
      if (!ctx || !masterGainRef.current) return;
      detachRemoteAudio(remoteSocketId);

      // IMPORTANT (Chrome bug): a remote WebRTC stream only delivers samples to
      // Web Audio if it is ALSO attached to a media element. The element is
      // muted so the sound is not played twice - Web Audio does the real output.
      const element = new Audio();
      element.srcObject = stream;
      element.muted = true;
      element.autoplay = true;
      element.play().catch(() => {});

      const sourceNode = ctx.createMediaStreamSource(stream);
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0; // silent until the distance maths says otherwise
      const pannerNode = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

      sourceNode.connect(gainNode);
      if (pannerNode) {
        gainNode.connect(pannerNode);
        pannerNode.connect(masterGainRef.current);
      } else {
        gainNode.connect(masterGainRef.current);
      }

      peerAudioNodesRef.current.set(remoteSocketId, { sourceNode, gainNode, pannerNode, element, stream });
      updateSpatialAudio();
    },
    [ensureAudio, detachRemoteAudio, updateSpatialAudio]
  );

  const findAudioTransceiver = (pc) =>
    pc.getTransceivers().find((t) => t.receiver && t.receiver.track && t.receiver.track.kind === 'audio');

  // Put our microphone track on a connection (works before AND after negotiation)
  const attachLocalTrack = useCallback((pc) => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    const transceiver = findAudioTransceiver(pc);
    if (track && transceiver) {
      transceiver.sender.replaceTrack(track).catch((err) => console.warn('[WebRTC] replaceTrack failed', err));
    }
  }, []);

  const closePeerConnection = useCallback(
    (remoteSocketId, notifyRemote = true) => {
      const pc = peerConnectionsRef.current.get(remoteSocketId);
      if (pc) {
        pc.onicecandidate = null;
        pc.ontrack = null;
        pc.onconnectionstatechange = null;
        pc.close();
        peerConnectionsRef.current.delete(remoteSocketId);
        if (notifyRemote && socketRef.current?.connected) {
          socketRef.current.emit('webrtc:signal', { toSocketId: remoteSocketId, signalData: { type: 'bye' } });
        }
      }
      pendingCandidatesRef.current.delete(remoteSocketId);
      detachRemoteAudio(remoteSocketId);
    },
    [detachRemoteAudio]
  );

  const getPeerConnection = useCallback(
    (remoteSocketId, isInitiator) => {
      const existing = peerConnectionsRef.current.get(remoteSocketId);
      if (existing) return existing;

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }],
      });

      // The offerer ALWAYS reserves a send+receive audio line, even while its mic is
      // off. Without this, a user who joins muted would never be able to HEAR anyone,
      // and enabling the mic later would need a renegotiation that never happened.
      if (isInitiator) pc.addTransceiver('audio', { direction: 'sendrecv' });

      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit('webrtc:signal', {
            toSocketId: remoteSocketId,
            signalData: { type: 'candidate', candidate: event.candidate },
          });
        }
      };

      pc.ontrack = (event) => {
        const stream = event.streams[0] || new MediaStream([event.track]);
        attachRemoteAudio(remoteSocketId, stream);
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
          if (peerConnectionsRef.current.get(remoteSocketId) === pc) {
            closePeerConnection(remoteSocketId, false);
          }
        }
      };

      pendingCandidatesRef.current.set(remoteSocketId, []);
      peerConnectionsRef.current.set(remoteSocketId, pc);
      return pc;
    },
    [attachRemoteAudio, closePeerConnection]
  );

  // We are the offerer (the peer with the smaller socket id always offers -> no glare)
  const callPeer = useCallback(
    async (remoteSocketId) => {
      const pc = getPeerConnection(remoteSocketId, true);
      attachLocalTrack(pc);
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current?.emit('webrtc:signal', {
          toSocketId: remoteSocketId,
          signalData: { type: 'offer', sdp: offer.sdp },
        });
      } catch (err) {
        console.error('[WebRTC] Call peer failed:', err);
        closePeerConnection(remoteSocketId, false);
      }
    },
    [getPeerConnection, attachLocalTrack, closePeerConnection]
  );

  const flushPendingCandidates = async (pc, remoteSocketId) => {
    const queue = pendingCandidatesRef.current.get(remoteSocketId) || [];
    pendingCandidatesRef.current.set(remoteSocketId, []);
    for (const candidate of queue) {
      try {
        await pc.addIceCandidate(candidate);
      } catch (err) {
        console.warn('[WebRTC] addIceCandidate failed', err);
      }
    }
  };

  // Incoming offer / answer / ICE candidate / bye
  const handleSignalingData = useCallback(
    async (fromSocketId, signalData) => {
      try {
        if (signalData.type === 'bye') {
          closePeerConnection(fromSocketId, false);
          return;
        }

        if (signalData.type === 'offer') {
          // Fresh start for every offer
          closePeerConnection(fromSocketId, false);
          const pc = getPeerConnection(fromSocketId, false);
          await pc.setRemoteDescription({ type: 'offer', sdp: signalData.sdp });

          // Make the transceiver created by the remote offer two-way and give it our mic
          const transceiver = findAudioTransceiver(pc);
          if (transceiver) transceiver.direction = 'sendrecv';
          attachLocalTrack(pc);

          await flushPendingCandidates(pc, fromSocketId);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socketRef.current?.emit('webrtc:signal', {
            toSocketId: fromSocketId,
            signalData: { type: 'answer', sdp: answer.sdp },
          });
          return;
        }

        const pc = peerConnectionsRef.current.get(fromSocketId);
        if (!pc) return;

        if (signalData.type === 'answer') {
          await pc.setRemoteDescription({ type: 'answer', sdp: signalData.sdp });
          await flushPendingCandidates(pc, fromSocketId);
        } else if (signalData.type === 'candidate' && signalData.candidate) {
          if (pc.remoteDescription) {
            await pc.addIceCandidate(signalData.candidate);
          } else {
            pendingCandidatesRef.current.get(fromSocketId)?.push(signalData.candidate);
          }
        }
      } catch (err) {
        console.error('[WebRTC] Signaling error:', err);
      }
    },
    [getPeerConnection, closePeerConnection, attachLocalTrack]
  );

  // Proximity-driven connection manager: only people "within earshot" get a
  // WebRTC connection; walking away closes it (hysteresis stops flapping).
  const manageConnections = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || !socket.id) return;
    const pos = playerPosRef.current;
    const now = Date.now();

    livePeersRef.current.forEach((peer, id) => {
      const dist = Math.hypot(peer.x - pos.x, peer.y - pos.y);
      const connected = peerConnectionsRef.current.has(id);

      if (!connected && dist <= CONNECT_RANGE && socket.id < id) {
        const last = lastAttemptRef.current.get(id) || 0;
        if (now - last > 2500) {
          lastAttemptRef.current.set(id, now);
          callPeer(id);
        }
      } else if (connected && dist > DISCONNECT_RANGE) {
        closePeerConnection(id, true);
      }
    });

    // Drop connections to people who left the room
    Array.from(peerConnectionsRef.current.keys()).forEach((id) => {
      if (!livePeersRef.current.has(id)) closePeerConnection(id, false);
    });
  }, [callPeer, closePeerConnection]);

  // Keep refs in sync + react to any movement / roster change
  useEffect(() => {
    livePeersRef.current = livePeers;
    manageConnections();
    updateSpatialAudio();
  }, [livePeers, playerPos, manageConnections, updateSpatialAudio]);

  // Speaker on/off + volume (master gain)
  useEffect(() => {
    speakerOnRef.current = speakerOn;
    volumeRef.current = volume;
    const ctx = audioContextRef.current;
    const master = masterGainRef.current;
    if (ctx && master) master.gain.setTargetAtTime(speakerOn ? volume : 0, ctx.currentTime, 0.03);
  }, [speakerOn, volume]);

  useEffect(() => {
    micActiveRef.current = micActive;
  }, [micActive]);

  // Unlock audio on the first user gesture (browser autoplay policy)
  useEffect(() => {
    const unlock = () => ensureAudio();
    unlock();
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [ensureAudio]);

  // Release microphone + audio device when leaving the page
  useEffect(() => {
    return () => {
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      const ctx = audioContextRef.current;
      audioContextRef.current = null;
      masterGainRef.current = null;
      if (ctx) ctx.close().catch(() => {});
    };
  }, []);

  // Short beep so the user can verify the speaker path works
  const testSpeaker = () => {
    const ctx = ensureAudio();
    if (!ctx || !masterGainRef.current) {
      setAudioError('Web Audio is not supported in this browser.');
      return;
    }
    if (!speakerOnRef.current) setSpeakerOn(true);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.value = 660;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    osc.connect(g);
    g.connect(masterGainRef.current);
    osc.start();
    osc.stop(ctx.currentTime + 0.55);
  };

  // ======================================================================
  // SOCKET.IO  (authenticated with the login token)
  // Deps are primitives only, so this does NOT reconnect on every movement
  // (the old version tore down the socket + all calls on each peer move).
  // ======================================================================
  const userToken = currentUser?.token;
  const userKey = currentUser?.id;
  useEffect(() => {
    const user = currentUserRef.current;
    if (!user?.token) return;

    const socket = io(window.location.origin, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      auth: { token: user.token },
      reconnectionAttempts: 10,
      timeout: 10000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
      const u = currentUserRef.current;
      socket.emit('office:join', {
        roomId,
        user: {
          id: u.id,
          name: u.name,
          email: u.email,
          avatarId: u.avatarId,
          role: u.role,
          jobTitle: u.jobTitle,
          department: u.department,
          availability: u.availability,
          micActive: micActiveRef.current,
        },
        initialPosition: playerPosRef.current,
      });
    });

    socket.on('connect_error', (err) => {
      setSocketConnected(false);
      if (err?.message === 'unauthorized') logout(); // token rejected -> back to login
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
      Array.from(peerConnectionsRef.current.keys()).forEach((id) => closePeerConnection(id, false));
    });

    socket.on('office:joined', ({ socketId, position, participants }) => {
      if (position && Number.isFinite(position.x) && Number.isFinite(position.y)) {
        setPlayerPos(position);
        playerPosRef.current = position;
        setActiveZone(checkCurrentZone(position.x, position.y));
      }
      Array.from(peerConnectionsRef.current.keys()).forEach((id) => closePeerConnection(id, false));
      const newMap = new Map();
      (participants || []).forEach((p) => {
        if (p.socketId !== socketId) newMap.set(p.socketId, p);
      });
      livePeersRef.current = newMap;
      setLivePeers(newMap); // effect above opens calls to whoever is in range
    });

    socket.on('presence:joined', (p) => {
      if (p.socketId === socket.id) return;
      setLivePeers((prev) => new Map(prev).set(p.socketId, p));
    });

    socket.on('presence:left', ({ socketId }) => {
      setLivePeers((prev) => {
        const next = new Map(prev);
        next.delete(socketId);
        return next;
      });
      closePeerConnection(socketId, false);
    });

    socket.on('position:update', ({ socketId, x, y }) => {
      setLivePeers((prev) => {
        const peer = prev.get(socketId);
        if (!peer) return prev;
        return new Map(prev).set(socketId, { ...peer, x, y });
      });
    });

    socket.on('speaking:update', ({ socketId, speaking }) => {
      setLivePeers((prev) => {
        const peer = prev.get(socketId);
        if (!peer) return prev;
        return new Map(prev).set(socketId, { ...peer, speaking });
      });
    });

    socket.on('mic:status', ({ socketId, micActive: peerMicActive }) => {
      setLivePeers((prev) => {
        const peer = prev.get(socketId);
        if (!peer) return prev;
        return new Map(prev).set(socketId, { ...peer, micActive: peerMicActive });
      });
    });

    socket.on('webrtc:signal', ({ fromSocketId, signalData }) => {
      handleSignalingData(fromSocketId, signalData);
    });

    socket.on('wave:received', ({ fromUser, message }) => {
      setWaveAlert({
        type: 'received',
        fromUser,
        message: message || `${fromUser?.name || 'A teammate'} sent you a wave!`,
      });
    });

    return () => {
      socket.emit('office:leave');
      socket.disconnect();
      socketRef.current = null;
      Array.from(peerConnectionsRef.current.keys()).forEach((id) => closePeerConnection(id, false));
      livePeersRef.current = new Map();
      setLivePeers(new Map());
      setSocketConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userToken, userKey, logout, checkCurrentZone, closePeerConnection, handleSignalingData]);

  // Combined colleague positions: merge static employee records with live connected users
  const colleaguePositions = useMemo(() => {
    // 1. Exclude the current logged-in user from static list
    const otherEmployees = employees.filter(
      (emp) => emp.email?.toLowerCase() !== currentUser?.email?.toLowerCase() && emp.id !== currentUser?.id
    );

    // 2. Map static employees, replacing with live data if currently connected online
    const liveArray = Array.from(livePeers.values());

    const result = otherEmployees.map((emp) => {
      // Find matching live participant by email or user ID
      const live = liveArray.find((p) => p.email?.toLowerCase() === emp.email?.toLowerCase() || p.id === emp.id);
      if (live) {
        return {
          ...emp,
          socketId: live.socketId,
          x: live.x,
          y: live.y,
          isOnline: true,
          micActive: live.micActive,
          speaking: live.speaking,
        };
      }
      return {
        ...emp,
        isOnline: false,
        x: emp.x || 300,
        y: emp.y || 200,
      };
    });

    // 3. Include any live participants who are not in the static employees roster
    liveArray.forEach((live) => {
      const alreadyListed = result.some(
        (r) => r.socketId === live.socketId || (r.email && r.email.toLowerCase() === live.email?.toLowerCase())
      );
      if (!alreadyListed) {
        result.push({
          id: live.id,
          name: live.name,
          email: live.email,
          jobTitle: live.jobTitle,
          department: live.department,
          avatarId: live.avatarId,
          availability: live.availability,
          x: live.x,
          y: live.y,
          socketId: live.socketId,
          isOnline: true,
          micActive: live.micActive,
          speaking: live.speaking,
        });
      }
    });

    return result;
  }, [employees, currentUser, livePeers]);

  // Smooth continuous movement execution with wall-sliding collision
  const executeStep = useCallback(
    (dx, dy) => {
      if (dx === 0 && dy === 0) return;

      const current = playerPosRef.current;
      let nextX = current.x;
      let nextY = current.y;

      // Normalize diagonal speed
      let stepX = dx;
      let stepY = dy;
      if (dx !== 0 && dy !== 0) {
        stepX = Math.round(dx * 0.7071);
        stepY = Math.round(dy * 0.7071);
      }

      // Wall-sliding: test X movement independently
      if (canMoveTo(current.x + stepX, current.y)) {
        nextX = current.x + stepX;
      }
      // Test Y movement independently
      if (canMoveTo(nextX, current.y + stepY)) {
        nextY = current.y + stepY;
      }

      if (nextX !== current.x || nextY !== current.y) {
        const newPos = { x: nextX, y: nextY };
        setPlayerPos(newPos);
        playerPosRef.current = newPos;

        // Check active zone
        const zone = checkCurrentZone(nextX, nextY);
        setActiveZone(zone);

        // Update spatial audio attenuation
        updateSpatialAudio(newPos);

        // Throttled emit to socket for real-time synchronization
        const now = Date.now();
        if (now - lastEmitTimeRef.current > 40 && socketRef.current) {
          lastEmitTimeRef.current = now;
          socketRef.current.emit('position:update', newPos);
        }
      }
    },
    [canMoveTo, checkCurrentZone, updateSpatialAudio]
  );

  // Movement animation frame loop (handles both keyboard and touch continuous inputs)
  useEffect(() => {
    let animId;
    const speed = 7;

    const tick = () => {
      let dx = 0;
      let dy = 0;

      const keys = activeKeysRef.current;
      if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) dy -= speed;
      if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) dy += speed;
      if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) dx -= speed;
      if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) dx += speed;

      // Touch continuous direction
      if (touchDirectionRef.current) {
        dx += touchDirectionRef.current.x * speed;
        dy += touchDirectionRef.current.y * speed;
      }

      if (dx !== 0 || dy !== 0) {
        executeStep(dx, dy);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [executeStep]);

  // Keyboard input listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 's', 'S', 'a', 'A', 'd', 'D'].includes(e.key)) {
        e.preventDefault();
        activeKeysRef.current.add(e.key);
      }
    };

    const handleKeyUp = (e) => {
      activeKeysRef.current.delete(e.key);
      // Clean up case variations
      if (e.key === 'w' || e.key === 'W') {
        activeKeysRef.current.delete('w');
        activeKeysRef.current.delete('W');
      }
      if (e.key === 's' || e.key === 'S') {
        activeKeysRef.current.delete('s');
        activeKeysRef.current.delete('S');
      }
      if (e.key === 'a' || e.key === 'A') {
        activeKeysRef.current.delete('a');
        activeKeysRef.current.delete('A');
      }
      if (e.key === 'd' || e.key === 'D') {
        activeKeysRef.current.delete('d');
        activeKeysRef.current.delete('D');
      }
    };

    const handleWindowBlur = () => {
      activeKeysRef.current.clear();
      touchDirectionRef.current = null;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  // Microphone toggle. The stream is created ONCE and then only enabled/disabled,
  // and the track is pushed into every open call with replaceTrack (no renegotiation).
  const toggleMicrophone = async () => {
    setAudioError('');
    ensureAudio();

    if (!micActive) {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw Object.assign(new Error('unsupported'), { name: 'UnsupportedError' });
        }

        let stream = localStreamRef.current;
        const live = stream && stream.getAudioTracks().some((t) => t.readyState === 'live');
        if (!live) {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
          });
          localStreamRef.current = stream;
          peerConnectionsRef.current.forEach((pc) => attachLocalTrack(pc));
        }
        stream.getAudioTracks().forEach((t) => {
          t.enabled = true;
        });

        setMicPermissionGranted(true);
        setMicActive(true);
        socketRef.current?.emit('mic:toggle', { active: true });
      } catch (err) {
        console.error('[Audio] Microphone error:', err);
        let message = 'Could not start the microphone.';
        if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
          message = 'Microphone access was blocked. Allow the microphone in your browser address bar and try again.';
        } else if (err.name === 'NotFoundError') {
          message = 'No microphone was found on this device.';
        } else if (err.name === 'NotReadableError') {
          message = 'The microphone is being used by another application.';
        } else if (!window.isSecureContext) {
          message = 'Microphone needs a secure page: open the app via http://localhost:5173 or HTTPS (not a LAN IP address).';
        } else if (err.name === 'UnsupportedError') {
          message = 'Microphone access is not supported in this browser.';
        }
        setAudioError(message);
        setMicActive(false);
      }
    } else {
      localStreamRef.current?.getAudioTracks().forEach((t) => {
        t.enabled = false;
      });
      setMicActive(false);
      socketRef.current?.emit('mic:toggle', { active: false });
    }
  };

  // Canvas click to move directly
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const targetX = Math.round((e.clientX - rect.left) * scaleX);
    const targetY = Math.round((e.clientY - rect.top) * scaleY);

    if (canMoveTo(targetX, targetY)) {
      setPlayerPos({ x: targetX, y: targetY });
      playerPosRef.current = { x: targetX, y: targetY };
      const zone = checkCurrentZone(targetX, targetY);
      setActiveZone(zone);
      updateSpatialAudio({ x: targetX, y: targetY });

      if (socketRef.current) {
        socketRef.current.emit('position:update', { x: targetX, y: targetY });
      }
    }
  };

  // Continuous Touch D-Pad handlers
  const handleTouchStart = (dirX, dirY) => (e) => {
    e.preventDefault();
    touchDirectionRef.current = { x: dirX, y: dirY };
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    touchDirectionRef.current = null;
  };

  // Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // 1. Clear & Background floor
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, w, h);

      // 2. Subtle office floor tile grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 3. Office Zones
      ZONES.forEach((zone) => {
        const { x, y, w: zw, h: zh } = zone.rect;
        ctx.fillStyle = zone.color;
        ctx.fillRect(x, y, zw, zh);

        ctx.strokeStyle = zone.borderColor;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.strokeRect(x, y, zw, zh);
        ctx.setLineDash([]);

        // Zone header pill
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(x + 10, y + 10, 200, 26);
        ctx.strokeStyle = zone.borderColor;
        ctx.strokeRect(x + 10, y + 10, 200, 26);

        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(zone.name, x + 20, y + 27);
      });

      // 4. Obstacles (Desks, Tables, Focus Carrels)
      OBSTACLES.forEach((obs) => {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(obs.x + 3, obs.y + 3, obs.w, obs.h);

        // Desk surface
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

        // Desk border
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

        // Desk labels
        ctx.fillStyle = '#94A3B8';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(obs.label, obs.x + obs.w / 2, obs.y + obs.h / 2 + 3);
        ctx.textAlign = 'left';
      });

      // 5. Decorative foliage plants
      const plants = [
        { x: 50, y: 310 },
        { x: 590, y: 310 },
        { x: 950, y: 310 },
        { x: 50, y: 620 },
        { x: 950, y: 620 },
      ];
      plants.forEach((p) => {
        ctx.fillStyle = '#B45309';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(p.x, p.y - 2, 11, 0, Math.PI * 2);
        ctx.fill();
      });

      // 6. Audible Proximity Radar for player
      const pos = playerPosRef.current;
      if (showRadar) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, AUDIBLE_RANGE, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, AUDIBLE_RANGE);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.14)');
        gradient.addColorStop(0.7, 'rgba(99, 102, 241, 0.05)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = 'rgba(99, 102, 241, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // 7. Colleagues & Live Peers Avatars
      colleaguePositions.forEach((colleague) => {
        const dist = Math.hypot(colleague.x - pos.x, colleague.y - pos.y);
        const isAudible = dist <= AUDIBLE_RANGE;

        // Proximity audio connection line
        if (isAudible) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
          ctx.lineTo(colleague.x, colleague.y);
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
          ctx.lineWidth = 2;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.restore();
        }

        // Speaking aura halo
        if (colleague.speaking) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(colleague.x, colleague.y, 30, 0, Math.PI * 2);
          ctx.strokeStyle = '#10B981';
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.restore();
        }

        // Avatar outer circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(colleague.x, colleague.y, 22, 0, Math.PI * 2);
        ctx.fillStyle = isAudible ? '#4F46E5' : '#334155';
        ctx.fill();
        ctx.strokeStyle = colleague.isOnline ? '#10B981' : isAudible ? '#22D3EE' : '#64748B';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Inner face color
        ctx.beginPath();
        ctx.arc(colleague.x, colleague.y, 18, 0, Math.PI * 2);
        ctx.fillStyle = '#FCD34D';
        ctx.fill();

        // Cartoon eyes & smile
        ctx.fillStyle = '#1E1B4B';
        ctx.beginPath();
        ctx.arc(colleague.x - 6, colleague.y - 2, 2.5, 0, Math.PI * 2);
        ctx.arc(colleague.x + 6, colleague.y - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(colleague.x, colleague.y + 3, 5, 0, Math.PI);
        ctx.stroke();
        ctx.restore();

        // Name tag label
        ctx.save();
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        const tagText = colleague.name.split(' ')[0];
        const textWidth = ctx.measureText(tagText).width;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(colleague.x - textWidth / 2 - 6, colleague.y - 36, textWidth + 12, 18);
        ctx.strokeStyle = isAudible ? '#10B981' : '#475569';
        ctx.strokeRect(colleague.x - textWidth / 2 - 6, colleague.y - 36, textWidth + 12, 18);

        ctx.fillStyle = isAudible ? '#34D399' : '#E2E8F0';
        ctx.fillText(tagText, colleague.x, colleague.y - 23);

        // Distance & volume indicator
        if (isAudible) {
          ctx.font = '9px Inter, sans-serif';
          ctx.fillStyle = '#06B6D4';
          ctx.fillText(`${Math.round(dist)}px`, colleague.x, colleague.y + 36);
        }

        // Availability status dot
        const statusColors = {
          Available: '#10B981',
          Busy: '#EF4444',
          Away: '#F59E0B',
          Offline: '#6B7280',
        };
        ctx.beginPath();
        ctx.arc(colleague.x + 14, colleague.y + 14, 5, 0, Math.PI * 2);
        ctx.fillStyle = statusColors[colleague.availability] || '#6B7280';
        ctx.fill();
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      });

      // 8. Player Avatar (You)
      ctx.save();
      // Glowing aura
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.35)';
      ctx.fill();

      // Outer ring
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 24, 0, Math.PI * 2);
      ctx.fillStyle = '#6366F1';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Face
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 19, 0, Math.PI * 2);
      ctx.fillStyle = '#FCD34D';
      ctx.fill();

      // Eyes & glasses
      ctx.fillStyle = '#1E1B4B';
      ctx.beginPath();
      ctx.arc(pos.x - 6, pos.y - 2, 2.5, 0, Math.PI * 2);
      ctx.arc(pos.x + 6, pos.y - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y + 3, 5, 0, Math.PI);
      ctx.stroke();

      // Mic status pulse
      if (micActive) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 34, 0, Math.PI * 2);
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // "You" Name Tag
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      const myTag = `${currentUser?.name?.split(' ')[0] || 'You'} (You)`;
      const myWidth = ctx.measureText(myTag).width;
      ctx.fillStyle = 'rgba(99, 102, 241, 0.9)';
      ctx.fillRect(pos.x - myWidth / 2 - 8, pos.y - 38, myWidth + 16, 20);
      ctx.strokeStyle = '#FFFFFF';
      ctx.strokeRect(pos.x - myWidth / 2 - 8, pos.y - 38, myWidth + 16, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(myTag, pos.x, pos.y - 24);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [colleaguePositions, currentUser, micActive, showRadar]);

  // Send Wave quick talk
  const handleSendWave = (target) => {
    if (socketRef.current && target.socketId) {
      socketRef.current.emit('wave:send', {
        toSocketId: target.socketId,
        message: `${currentUser?.name || 'A colleague'} waved at you from across the office!`,
      });
    }
    setWaveAlert({
      type: 'sent',
      message: `You waved at ${target.name}. They will see your invitation!`,
    });
  };

  // Copy Office Room Link
  const copyRoomInvite = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 4.25rem)',
        background: 'var(--bg-primary)',
        overflow: 'hidden',
      }}
    >
      {/* Browser autoplay policy: audio stays blocked until the user interacts */}
      {audioState !== 'running' && (
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.15)',
            borderBottom: '1px solid rgba(245, 158, 11, 0.5)',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            fontSize: '0.8rem',
            color: 'var(--text-primary)',
          }}
        >
          <span>
            <Volume2 size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Sound is blocked by your browser until you interact with the page.
          </span>
          <button onClick={ensureAudio} className="btn btn-primary btn-sm">
            Enable Sound
          </button>
        </div>
      )}

      {/* Audio Error Alert Banner */}
      {audioError && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            borderBottom: '1px solid var(--status-busy)',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'var(--status-busy)',
            fontSize: '0.85rem',
            zIndex: 100,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{audioError}</span>
          </div>
          <button
            onClick={() => setAudioError('')}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Office Top Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 1.25rem',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
          zIndex: 20,
          gap: '1rem',
        }}
      >
        {/* Left: Office Room Info & Real-Time Sync Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            to="/dashboard"
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.4rem 0.65rem' }}
            title="Back to Dashboard"
          >
            <ArrowLeft size={16} />
          </Link>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                {roomId.replace('-', ' ').toUpperCase()} CAMPUS
              </h2>
              <span
                className={`status-badge ${socketConnected ? 'status-available' : 'status-busy'}`}
                style={{ fontSize: '0.7rem' }}
              >
                {socketConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
                {socketConnected ? 'Real-Time Connected' : 'Connecting Server...'}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Current Zone:{' '}
              <strong style={{ color: activeZone ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                {activeZone ? activeZone.name : 'Hallway / Corridor'}
              </strong>
            </div>
          </div>
        </div>

        {/* Center: Audio Controls Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--bg-card)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {/* Mic Button */}
          <button
            onClick={toggleMicrophone}
            className={`btn btn-sm ${micActive ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              borderRadius: 'var(--radius-full)',
              gap: '0.4rem',
              color: micActive ? '#fff' : 'var(--text-primary)',
            }}
          >
            {micActive ? <Mic size={16} /> : <MicOff size={16} />}
            <span>{micActive ? 'Mic Active' : 'Mic Muted'}</span>
          </button>

          {/* Speaker (output) button + volume + test tone */}
          <button
            onClick={() => {
              ensureAudio();
              setSpeakerOn((v) => !v);
            }}
            className={`btn btn-sm ${speakerOn ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              borderRadius: 'var(--radius-full)',
              gap: '0.4rem',
              color: speakerOn ? '#fff' : 'var(--text-primary)',
            }}
            title={speakerOn ? 'Mute speaker' : 'Turn speaker on'}
          >
            {speakerOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{speakerOn ? 'Speaker On' : 'Speaker Off'}</span>
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            aria-label="Speaker volume"
            title={`Volume ${Math.round(volume * 100)}%`}
            style={{ width: 70, accentColor: 'var(--accent-primary)' }}
          />
          <button
            onClick={testSpeaker}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 0.65rem' }}
            title="Play a short test tone to check your speakers"
          >
            <span style={{ fontSize: '0.75rem' }}>Test</span>
          </button>

          {/* Radar circle toggle */}
          <button
            onClick={() => setShowRadar(!showRadar)}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 0.65rem' }}
            title="Toggle Audible Range Radar Circle"
          >
            {showRadar ? <Eye size={16} color="var(--accent-primary)" /> : <EyeOff size={16} />}
            <span style={{ fontSize: '0.75rem' }}>Radar</span>
          </button>

          {/* Zoom controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <button
              onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.35rem', borderRadius: '50%' }}
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.35rem', borderRadius: '50%' }}
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.35rem', borderRadius: '50%' }}
              title="Reset Zoom"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* Right: Invite & Participants toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={copyRoomInvite}
            className="btn btn-secondary btn-sm"
            title="Copy Office Invite Link"
          >
            {copiedLink ? <Check size={16} color="#10B981" /> : <Share2 size={16} />}
            <span>{copiedLink ? 'Copied!' : 'Share Office'}</span>
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`btn btn-sm ${sidebarOpen ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Users size={16} />
            <span>{colleaguePositions.length + 1} Present</span>
          </button>
        </div>
      </div>

      {/* Main Office Workspace */}
      <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Canvas Container */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--office-floor, #111827)',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease',
              boxShadow: 'var(--shadow-xl)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '2px solid var(--border-medium)',
            }}
          >
            <canvas
              ref={canvasRef}
              width={1000}
              height={650}
              onClick={handleCanvasClick}
              style={{
                display: 'block',
                cursor: 'crosshair',
              }}
            />
          </div>

          {/* Touch / D-Pad Movement Controls (Smooth Continuous Hold Supported) */}
          <div
            style={{
              position: 'absolute',
              bottom: 24,
              left: 24,
              zIndex: 30,
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-lg)',
              touchAction: 'none',
              userSelect: 'none',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 42px)',
                gridTemplateRows: 'repeat(3, 42px)',
                gap: 4,
              }}
            >
              <div />
              <button
                type="button"
                onPointerDown={handleTouchStart(0, -1)}
                onPointerUp={handleTouchEnd}
                onPointerLeave={handleTouchEnd}
                onPointerCancel={handleTouchEnd}
                className="btn btn-secondary"
                style={{ padding: 0 }}
                title="Move Up"
              >
                ▲
              </button>
              <div />
              <button
                type="button"
                onPointerDown={handleTouchStart(-1, 0)}
                onPointerUp={handleTouchEnd}
                onPointerLeave={handleTouchEnd}
                onPointerCancel={handleTouchEnd}
                className="btn btn-secondary"
                style={{ padding: 0 }}
                title="Move Left"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlayerPos({ x: 220, y: 150 });
                  playerPosRef.current = { x: 220, y: 150 };
                  if (socketRef.current) socketRef.current.emit('position:update', { x: 220, y: 150 });
                }}
                className="btn btn-primary"
                style={{ padding: 0, fontSize: '0.65rem' }}
                title="Reset Position"
              >
                HQ
              </button>
              <button
                type="button"
                onPointerDown={handleTouchStart(1, 0)}
                onPointerUp={handleTouchEnd}
                onPointerLeave={handleTouchEnd}
                onPointerCancel={handleTouchEnd}
                className="btn btn-secondary"
                style={{ padding: 0 }}
                title="Move Right"
              >
                ▶
              </button>
              <div />
              <button
                type="button"
                onPointerDown={handleTouchStart(0, 1)}
                onPointerUp={handleTouchEnd}
                onPointerLeave={handleTouchEnd}
                onPointerCancel={handleTouchEnd}
                className="btn btn-secondary"
                style={{ padding: 0 }}
                title="Move Down"
              >
                ▼
              </button>
              <div />
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Touch or WASD / Click Map
            </div>
          </div>

          {/* Active Zone Toast Alert */}
          {activeZone && (
            <div
              style={{
                position: 'absolute',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(15, 23, 42, 0.9)',
                border: `1px solid ${activeZone.borderColor}`,
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 20,
                backdropFilter: 'blur(8px)',
              }}
            >
              <Shield size={16} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Inside: {activeZone.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                ({activeZone.type === 'private' ? 'Confidential' : activeZone.type})
              </span>
            </div>
          )}

          {/* Wave Alert Notification Modal */}
          {waveAlert && (
            <div
              style={{
                position: 'absolute',
                top: 80,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--bg-card)',
                border: '2px solid var(--accent-primary)',
                padding: '1rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 40,
                maxWidth: 420,
                width: '90%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'var(--accent-primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-primary)',
                  }}
                >
                  <Hand size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Wave / Quick Talk</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {waveAlert.message}
                  </div>
                </div>
              </div>

              {waveAlert.type === 'received' && (
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setWaveAlert(null)}
                    className="btn btn-secondary btn-sm"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => {
                      if (!micActive) toggleMicrophone();
                      setWaveAlert(null);
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    Accept & Turn on Mic
                  </button>
                </div>
              )}
              {waveAlert.type === 'sent' && (
                <button
                  onClick={() => setWaveAlert(null)}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>

        {/* Collapsible Right Participant Panel */}
        {sidebarOpen && (
          <aside
            style={{
              width: 320,
              background: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              zIndex: 30,
            }}
          >
            {/* Panel Header */}
            <div
              style={{
                padding: '1rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Participants ({colleaguePositions.length + 1})</div>
              <span className="status-badge status-available">Spatial Audio WebRTC</span>
            </div>

            {/* Current Player Card */}
            <div
              style={{
                padding: '0.85rem 1rem',
                background: 'var(--accent-primary-light)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <Avatar
                avatarId={currentUser?.avatarId || 'alex-dev'}
                size={40}
                availability={currentUser?.availability}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                  {currentUser?.name} <span style={{ color: 'var(--accent-primary)' }}>(You)</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {currentUser?.jobTitle} • {micActive ? 'Mic Live' : 'Muted'}
                </div>
              </div>
            </div>

            {/* List of Colleagues with Proximity Math & Audio Attenuation */}
            <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Colleagues in Office
              </div>

              {colleaguePositions.map((colleague) => {
                const dist = calculateDistance(playerPos.x, playerPos.y, colleague.x, colleague.y);
                const isAudible = dist <= AUDIBLE_RANGE;
                const volumePercent = Math.max(0, Math.round((1 - dist / AUDIBLE_RANGE) * 100));

                return (
                  <div
                    key={colleague.id || colleague.socketId}
                    className="ui-card"
                    style={{
                      padding: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      borderColor: isAudible ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Avatar
                        avatarId={colleague.avatarId}
                        size={36}
                        availability={colleague.availability}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {colleague.name}
                          {colleague.isOnline && (
                            <span style={{ marginLeft: 6, fontSize: '0.7rem', color: '#10B981', fontWeight: 'normal' }}>
                              (Live)
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {colleague.jobTitle}
                        </div>
                      </div>

                      <button
                        onClick={() => handleSendWave(colleague)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                        title={`Send wave to ${colleague.name}`}
                      >
                        <Hand size={14} /> Wave
                      </button>
                    </div>

                    {/* Spatial Audio Calculation Box */}
                    <div
                      style={{
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.4rem 0.6rem',
                        fontSize: '0.75rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Distance: {dist}px</span>
                        <span style={{ fontWeight: 600, color: isAudible ? '#10B981' : '#64748B' }}>
                          {isAudible ? `${volumePercent}% Volume` : 'Out of range'}
                        </span>
                      </div>

                      {/* Volume Bar */}
                      <div
                        style={{
                          height: 4,
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: 2,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${volumePercent}%`,
                            background: isAudible ? 'linear-gradient(90deg, #10B981, #06B6D4)' : '#475569',
                            transition: 'width 0.1s linear',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default OfficePage;
