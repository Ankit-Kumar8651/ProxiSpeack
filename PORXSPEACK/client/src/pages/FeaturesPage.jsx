import React from 'react';
import { Link } from 'react-router-dom';
import {
  Volume2,
  Compass,
  Users,
  Shield,
  Radio,
  Sliders,
  Sparkles,
  Zap,
  Lock,
  Smile,
  Hand,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const FeaturesPage = () => {
  return (
    <div style={{ padding: '3rem 0', flex: 1 }}>
      <div className="content-wrapper">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 3.5rem auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--accent-primary)',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            <Sparkles size={16} /> Architectural Capabilities
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              marginBottom: '1rem',
              lineHeight: 1.2,
            }}
          >
            Engineered for Natural Human Collaboration
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Every interaction in ProxiSpeak is modeled after real physical dynamics—from how sound travels
            across open workspaces to how private conversations remain confidential.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
          {/* Feature 1 */}
          <div className="ui-card" style={{ padding: '2rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-primary-light)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Volume2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Proximity-Based Spatial Audio
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Unlike video call software where everyone is at the exact same audio volume, ProxiSpeak calculates
              real-time distance using Euclidean coordinates. Audio volume diminishes smoothly as you move away.
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <code>Math.sqrt((x2 - x1)² + (y2 - y1)²)</code>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="ui-card" style={{ padding: '2rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(236, 72, 153, 0.12)',
                color: '#EC4899',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Lock size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Private Conversation Zones
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Step into an Executive Boardroom or Private Pod to immediately isolate your conversation.
              Server-enforced access controls ensure uninvited users outside cannot eavesdrop.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#EC4899', fontWeight: 600 }}>
              Access-Controlled Zone Enclosures
            </div>
          </div>

          {/* Feature 3 */}
          <div className="ui-card" style={{ padding: '2rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.12)',
                color: '#F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Hand size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Wave & Quick Talk Requests
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Want to see if a colleague has a moment to chat without disturbing their focus? Tap the Wave button
              to send an instant visual greeting that they can accept or decline with one click.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#F59E0B', fontWeight: 600 }}>
              Polite, Asynchronous Initiations
            </div>
          </div>

          {/* Feature 4 */}
          <div className="ui-card" style={{ padding: '2rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Smile size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Cartoon Avatar Identity System
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Express yourself with tailored cartoon avatars designed for engineering, design, and management
              roles. Built with zero external dependencies to prevent broken images.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600 }}>
              Vector Scalable SVG Characters
            </div>
          </div>

          {/* Feature 5 */}
          <div className="ui-card" style={{ padding: '2rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(6, 182, 212, 0.12)',
                color: '#06B6D4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Compass size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Collision & Spatial Navigation
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Navigate desks, walls, corridors, and plants without clipping. Seamlessly switch between desktop
              WASD/arrow controls and mobile touch joysticks.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#06B6D4', fontWeight: 600 }}>
              Hardware-Accelerated 2D Canvas
            </div>
          </div>

          {/* Feature 6 */}
          <div className="ui-card" style={{ padding: '2rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(139, 92, 246, 0.12)',
                color: '#8B5CF6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Sliders size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Dual Interface Presentation
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Choose between <strong>Normal Mode</strong> for clean, distraction-free productivity and{' '}
              <strong>Visual Mode</strong> for vibrant glassmorphic cards and illuminated avatar rings.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#8B5CF6', fontWeight: 600 }}>
              Independent of 4 Color Themes
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/office/main-hq" className="btn btn-primary btn-lg">
            Experience ProxiSpeak Now <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
