import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1rem',
        textAlign: 'center',
      }}
    >
      <div className="ui-card" style={{ maxWidth: 500, padding: '3rem 2rem' }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--accent-primary-light)',
            color: 'var(--accent-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <Compass size={36} />
        </div>

        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            lineHeight: 1,
            marginBottom: '0.75rem',
            color: 'var(--accent-primary)',
          }}
        >
          404
        </h1>

        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Virtual Office Zone Not Found
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          The room or route you are looking for does not exist or has been relocated to another coordinate.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
          <Link to="/" className="btn btn-secondary">
            <ArrowLeft size={16} /> Return to Home
          </Link>
          <Link to="/office/main-hq" className="btn btn-primary">
            Enter Main Campus
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
