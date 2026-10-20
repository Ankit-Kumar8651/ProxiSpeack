import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEmployees } from '../context/EmployeeContext';
import { Avatar } from '../components/avatars/Avatar';
import {
  Compass,
  Users,
  PlusCircle,
  LogIn,
  Sparkles,
  Volume2,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Radio,
  Copy,
  Check,
  X,
} from 'lucide-react';

export const DashboardPage = () => {
  const { currentUser, isAdmin } = useAuth();
  const { summary, employees } = useEmployees();
  const navigate = useNavigate();

  // Create room modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState('open');

  // Join room modal state
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');

  // Available office rooms
  const [rooms, setRooms] = useState([
    {
      id: 'main-hq',
      name: 'Main Campus HQ',
      type: 'Open Workspace & Pods',
      participants: 6,
      capacity: 25,
      code: 'HQ-770',
      activeZone: 'Engineering Bay Alpha',
      badge: 'Active Hub',
    },
    {
      id: 'design-studio',
      name: 'Design Studio & Creative Lab',
      type: 'Visual Design Space',
      participants: 2,
      capacity: 12,
      code: 'DSN-204',
      activeZone: 'Quick Discussion Lounge',
      badge: 'Collaboration',
    },
    {
      id: 'executive-boardroom',
      name: 'Executive Boardroom',
      type: 'Private Confidential Zone',
      participants: 1,
      capacity: 10,
      code: 'EXEC-901',
      activeZone: 'Executive Boardroom',
      badge: 'Private',
    },
  ]);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    const slug = newRoomName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newRoom = {
      id: slug,
      name: newRoomName.trim(),
      type: newRoomType === 'private' ? 'Private Confidential Zone' : 'Open Workspace',
      participants: 1,
      capacity: 20,
      code: `RM-${Math.floor(100 + Math.random() * 900)}`,
      activeZone: 'Main Hall',
      badge: 'New',
    };
    setRooms([newRoom, ...rooms]);
    setShowCreateModal(false);
    navigate(`/office/${slug}`);
  };

  const handleJoinWithCode = (e) => {
    e.preventDefault();
    const cleanCode = joinCode.trim().toUpperCase();
    const found = rooms.find((r) => r.code === cleanCode);
    if (found) {
      setShowJoinModal(false);
      navigate(`/office/${found.id}`);
    } else if (cleanCode === 'PROXI-JOIN-7729X' || cleanCode.length >= 4) {
      setShowJoinModal(false);
      navigate(`/office/main-hq`);
    } else {
      setJoinError('Invalid invitation code. Please verify your office code.');
    }
  };

  return (
    <div style={{ padding: '2rem 0', flex: 1 }}>
      <div className="content-wrapper">
        {/* Welcome Banner */}
        <div
          className="ui-card"
          style={{
            padding: '2rem',
            background: 'linear-gradient(135deg, var(--bg-card), var(--bg-secondary))',
            borderRadius: 'var(--card-radius)',
            border: '1px solid var(--border-medium)',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <Avatar
                avatarId={currentUser?.avatarId || 'alex-dev'}
                size={70}
                availability={currentUser?.availability || 'Available'}
                isSelected
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                    Welcome back, {currentUser?.name || 'Collaborator'}!
                  </h1>
                  <span className="status-badge status-available">Online</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  {currentUser?.jobTitle || 'Team Member'} • {currentUser?.department || 'Workspace'} • Assigned to{' '}
                  <strong style={{ color: 'var(--accent-primary)' }}>{currentUser?.assignedOffice}</strong>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={() => setShowJoinModal(true)} className="btn btn-secondary">
                <LogIn size={16} />
                Join with Code
              </button>
              <button onClick={() => setShowCreateModal(true)} className="btn btn-secondary">
                <PlusCircle size={16} />
                Create Room
              </button>
              <Link to="/office/main-hq" className="btn btn-primary">
                <Compass size={16} />
                Enter Main Office
              </Link>
            </div>
          </div>
        </div>

        {/* Real-time Status & Analytics Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          <div className="ui-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ONLINE EMPLOYEES</span>
              <Users size={18} color="var(--status-available)" />
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--status-available)' }}>
              {summary.available} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ {summary.total}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {summary.busy} in meetings • {summary.away} away
            </div>
          </div>

          <div className="ui-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ACTIVE VIRTUAL ROOMS</span>
              <Building size={18} color="var(--accent-primary)" />
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--accent-primary)' }}>
              {rooms.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Spatial audio & private zones enabled
            </div>
          </div>

          <div className="ui-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>SPATIAL AUDIO RADIUS</span>
              <Volume2 size={18} color="var(--accent-secondary)" />
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--accent-secondary)' }}>
              200 px
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Euclidean distance attenuation active
            </div>
          </div>

          <div className="ui-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>SYSTEM ACCESS</span>
              <Shield size={18} color={isAdmin ? 'var(--status-available)' : 'var(--text-muted)'} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              {isAdmin ? 'Admin' : 'Employee'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {isAdmin ? 'Full campus management' : 'Collaboration access'}
            </div>
          </div>
        </div>

        {/* Available Virtual Offices Grid */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Available Virtual Offices</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Step into a 2D floorplan and connect with your colleagues naturally.
              </p>
            </div>
            <button onClick={() => setShowCreateModal(true)} className="btn btn-secondary btn-sm">
              <PlusCircle size={15} />
              New Office
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {rooms.map((room) => (
              <div
                key={room.id}
                className="ui-card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--accent-primary-light)',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      {room.badge}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      Code: {room.code}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    {room.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    {room.type} • Active in {room.activeZone}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    <Users size={16} />
                    <span>
                      <strong>{room.participants}</strong> / {room.capacity} colleagues
                    </span>
                  </div>

                  <Link to={`/office/${room.id}`} className="btn btn-primary btn-sm">
                    Enter Office
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Columns: Recent Colleagues & Quick Appearance Access */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Online Colleagues Mini-Feed */}
          <div className="ui-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Colleague Presence</h3>
              <Link to="/employees" style={{ fontSize: '0.825rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                View All Directory &rarr;
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {employees.slice(0, 4).map((emp) => (
                <div
                  key={emp.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-secondary)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Avatar avatarId={emp.avatarId} size={36} availability={emp.availability} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{emp.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.jobTitle}</div>
                    </div>
                  </div>
                  <span className={`status-badge status-${emp.availability.toLowerCase()}`}>
                    <span className="status-dot" />
                    {emp.availability}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Customization Callout */}
          <div
            className="ui-card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, var(--bg-card), var(--bg-secondary))',
            }}
          >
            <div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-primary-light)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Sparkles size={24} />
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Themes & Interface Modes
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Customize your visual experience with 4 themes (Dark, Light, Midnight, High-Contrast)
                and switch between <strong>Normal Mode</strong> and <strong>Visual Mode</strong>.
              </p>
            </div>

            <Link to="/appearance" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
              Open Themes & Settings
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* Create Office Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: 460, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Create New Virtual Office</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem', borderRadius: '50%' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateRoom}>
              <div className="form-group">
                <label className="form-label">Office Room Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Research Lab"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Office Space Type</label>
                <select
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value)}
                  className="form-select"
                >
                  <option value="open">Open Workspace & Collaboration</option>
                  <option value="private">Private Confidential Zone (Access Controlled)</option>
                  <option value="focus">Quiet Focus Zone</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create & Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Office Modal */}
      {showJoinModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: 460, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Join Office with Code</h3>
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setJoinError('');
                }}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem', borderRadius: '50%' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleJoinWithCode}>
              {joinError && (
                <div
                  style={{
                    padding: '0.65rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid var(--status-busy)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--status-busy)',
                    fontSize: '0.85rem',
                    marginBottom: '1rem',
                  }}
                >
                  {joinError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Enter Room Code or Invite Token</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HQ-770 or PROXI-JOIN-7729X"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="form-input"
                  style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowJoinModal(false);
                    setJoinError('');
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Join Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
