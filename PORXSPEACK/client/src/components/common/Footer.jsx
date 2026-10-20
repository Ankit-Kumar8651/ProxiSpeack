import React from 'react';
import { Link } from 'react-router-dom';
import { Volume2, Code2, Shield, Radio, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-secondary)',
        padding: '3rem 0 1.5rem 0',
        marginTop: 'auto',
      }}
    >
      <div className="content-wrapper">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Brand info */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontWeight: 800,
                fontSize: '1.2rem',
                fontFamily: 'var(--font-display)',
                marginBottom: '0.85rem',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <Volume2 size={18} strokeWidth={2.5} />
              </div>
              <span>
                Proxi<span style={{ color: 'var(--accent-primary)' }}>Speak</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Virtual office and spatial audio collaboration platform. Bringing spontaneous, natural
              conversations back to remote and hybrid teams.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
              Platform
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <Link to="/features">Spatial Audio Features</Link>
              <Link to="/how-it-works">Virtual Campus Model</Link>
              <Link to="/office/main-hq">2D Virtual Office</Link>
              <Link to="/appearance">Theme Customization</Link>
            </div>
          </div>

          {/* Collaboration */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
              Collaboration
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <Link to="/employees">Employee Directory</Link>
              <Link to="/dashboard">Office Rooms</Link>
              <span>Private Zones & Focus Pods</span>
              <span>Wave & Quick Talk</span>
            </div>
          </div>

          {/* Architecture & Tech */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
              Architecture
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Built with React, HTML5 2D Canvas, Web Audio API, WebRTC & Euclidean distance modeling.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
              <Radio size={14} />
              <span>Phase 1 Prototype Active</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} ProxiSpeak. Crafted for remote team collaboration.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Virtual Coordinate Spatial Audio Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
