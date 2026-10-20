import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/avatars/Avatar';
import {
  Volume2,
  Compass,
  Users,
  Shield,
  Radio,
  ArrowRight,
  Sparkles,
  Zap,
  Lock,
  Smile,
  Layers,
  CheckCircle,
} from 'lucide-react';

export const HomePage = () => {
  const { isAuthenticated, currentUser } = useAuth();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '4.5rem 0 3.5rem 0',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at 50% -10%, rgba(99, 102, 241, 0.18), transparent 70%)',
        }}
      >
        <div className="content-wrapper" style={{ textAlign: 'center' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-primary-light)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: 'var(--accent-primary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={16} />
            Next-Generation Spatial Virtual Office
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              maxWidth: 900,
              margin: '0 auto 1.25rem auto',
            }}
          >
            Work Together,{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Naturally.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: 680,
              margin: '0 auto 2.25rem auto',
              lineHeight: 1.6,
            }}
          >
            Experience a virtual office where conversations happen naturally, teams stay connected, and
            collaboration feels effortless.
          </p>

          {/* Call to Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '3.5rem',
            }}
          >
            {isAuthenticated ? (
              <Link to="/office/main-hq" className="btn btn-primary btn-lg">
                <Compass size={20} />
                Enter Your Office ({currentUser?.name?.split(' ')[0]})
              </Link>
            ) : (
              <Link to="/signup" className="btn btn-primary btn-lg">
                Get Started Free
                <ArrowRight size={18} />
              </Link>
            )}

            <Link to="/features" className="btn btn-secondary btn-lg">
              Explore Features
            </Link>
          </div>

          {/* Interactive Virtual Office 2D Preview Teaser */}
          <div
            className="ui-card"
            style={{
              maxWidth: 960,
              margin: '0 auto',
              padding: '1.5rem',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {/* Window bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                marginBottom: '1rem',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                PROXISPEAK LIVE 2D VIRTUAL CAMPUS
              </div>
              <span className="status-badge status-available">Live Engine</span>
            </div>

            {/* Visual preview representation */}
            <div
              style={{
                height: 340,
                borderRadius: 'var(--radius-md)',
                background: '#0F172A',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {/* Radar ring animation */}
              <div
                style={{
                  position: 'absolute',
                  width: 260,
                  height: 260,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0.0) 70%)',
                  border: '1.5px dashed rgba(99, 102, 241, 0.5)',
                  left: '42%',
                  top: '45%',
                  transform: 'translate(-50%, -50%)',
                }}
              />

              {/* Characters inside preview */}
              <div
                style={{
                  position: 'absolute',
                  left: '42%',
                  top: '45%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <Avatar avatarId="alex-dev" size={54} isSelected />
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginTop: 4 }}>
                  Alex (You)
                </div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  left: '58%',
                  top: '40%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <Avatar avatarId="sarah-design" size={48} availability="Available" />
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', marginTop: 4 }}>
                  Sarah (Designer)
                </div>
                <div
                  style={{
                    fontSize: '0.65rem',
                    color: '#22D3EE',
                    background: 'rgba(15, 23, 42, 0.8)',
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}
                >
                  64px • 82% Vol
                </div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  left: '24%',
                  top: '65%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <Avatar avatarId="marcus-lead" size={44} availability="Busy" />
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', marginTop: 4 }}>
                  Marcus (PM)
                </div>
              </div>

              {/* Zone label tag in preview */}
              <div
                style={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  color: '#94A3B8',
                }}
              >
                Zone: <strong>Engineering Bay Alpha</strong>
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                }}
              >
                <Link to="/office/main-hq" className="btn btn-primary btn-sm">
                  Launch Live Demo <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proximity Spatial Audio Explanation */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="content-wrapper">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--accent-secondary)',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                <Volume2 size={16} /> True Spatial Physics
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  lineHeight: 1.25,
                  marginBottom: '1rem',
                }}
              >
                Conversations that fade in and out, just like in real life.
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                Walk up to a coworker's desk to say hello, step into a glass conference room for private team
                deliberations, or sit in a quiet focus pod without endless scheduled Zoom links.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem' }}>
                  <CheckCircle size={18} color="var(--status-available)" />
                  <span>
                    <strong>Euclidean Distance Modeling:</strong> Volume attenuates proportionally using{' '}
                    <code>Math.hypot(Δx, Δy)</code>.
                  </span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem' }}>
                  <CheckCircle size={18} color="var(--status-available)" />
                  <span>
                    <strong>Stereo Spatial Panning:</strong> Hear teammates from the left or right speaker based on orientation.
                  </span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem' }}>
                  <CheckCircle size={18} color="var(--status-available)" />
                  <span>
                    <strong>Private Zones:</strong> Automatically isolates audio inside executive boardrooms and focus pods.
                  </span>
                </li>
              </ul>
            </div>

            <div
              className="ui-card"
              style={{
                padding: '2rem',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-medium)',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                How Spatial Proximity Works
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Close Collaboration (30px)</span>
                    <span style={{ color: '#10B981', fontWeight: 700, fontSize: '0.85rem' }}>100% Volume</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--border-subtle)', borderRadius: 3 }}>
                    <div style={{ width: '100%', height: '100%', background: '#10B981', borderRadius: 3 }} />
                  </div>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Adjacent Desks (100px)</span>
                    <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: '0.85rem' }}>55% Volume</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--border-subtle)', borderRadius: 3 }}>
                    <div style={{ width: '55%', height: '100%', background: '#F59E0B', borderRadius: 3 }} />
                  </div>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Across the Office (250px)</span>
                    <span style={{ color: '#6B7280', fontWeight: 700, fontSize: '0.85rem' }}>0% (Silent)</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--border-subtle)', borderRadius: 3 }}>
                    <div style={{ width: '0%', height: '100%', background: '#6B7280', borderRadius: 3 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Simple Guide */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="content-wrapper" style={{ textAlign: 'center' }}>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              marginBottom: '0.5rem',
            }}
          >
            Three Simple Steps to Get Started
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1rem' }}>
            No complicated installations or VR hardware required. Works on any modern web browser.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.75rem',
              textAlign: 'left',
            }}
          >
            {/* Step 1 */}
            <div className="ui-card" style={{ padding: '2rem' }}>
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
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '1.25rem',
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Create an Office
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Set up a virtual office room with customized meeting zones, private boardrooms, and focus pods.
              </p>
            </div>

            {/* Step 2 */}
            <div className="ui-card" style={{ padding: '2rem' }}>
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
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '1.25rem',
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Invite Your Team
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Share secure invitation codes or direct room links. Assign custom cartoon avatars for every employee.
              </p>
            </div>

            {/* Step 3 */}
            <div className="ui-card" style={{ padding: '2rem' }}>
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
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '1.25rem',
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Move, Meet & Collaborate
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Navigate smoothly with keyboard or mobile touch controls. Speak naturally as your avatars walk together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="content-wrapper">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>
              Built for Modern Product Teams
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              A complete collaboration suite engineered with clean software architecture.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div className="ui-card" style={{ padding: '1.5rem' }}>
              <Smile size={28} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Cartoon Avatar System
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Say goodbye to generic grey circles. Choose from distinct developer, designer, analyst, and lead
                character avatars.
              </p>
            </div>

            <div className="ui-card" style={{ padding: '1.5rem' }}>
              <Users size={28} color="var(--accent-secondary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Employee Directory
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Search, filter, update availability statuses, and manage team members with role-based access control.
              </p>
            </div>

            <div className="ui-card" style={{ padding: '1.5rem' }}>
              <Sparkles size={28} color="#F59E0B" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                4 Themes & 2 Interface Modes
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Switch between Light, Dark, Midnight, and High-Contrast palettes, plus toggle Normal Mode vs Visual Mode.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="content-wrapper">
          <div
            className="ui-card"
            style={{
              padding: '3rem 2rem',
              background: 'linear-gradient(135deg, var(--bg-card), var(--bg-secondary))',
              border: '1px solid var(--accent-primary)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.75rem' }}>
              Ready to modernize your remote workspace?
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 550, margin: '0 auto 2rem auto', fontSize: '1.05rem' }}>
              Step into the ProxiSpeak campus today and start communicating naturally with your colleagues.
            </p>
            <Link to="/office/main-hq" className="btn btn-primary btn-lg">
              Launch Virtual Office Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
