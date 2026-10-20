import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Volume2, User, Lock, CheckCircle } from 'lucide-react';

export const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from?.pathname || '/dashboard';
  const justRegistered = location.state?.registered;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(identifier, password);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid User ID or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
      }}
    >
      <div className="ui-card" style={{ width: '100%', maxWidth: 440, padding: '2rem' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              marginBottom: '1rem',
              boxShadow: '0 4px 12px var(--accent-glow)',
            }}
          >
            <Volume2 size={26} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Log in with your User ID and password to enter your virtual office.
          </p>
        </div>

        {justRegistered && !error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10B981',
              borderRadius: 'var(--radius-sm)',
              color: '#10B981',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <CheckCircle size={16} /> Account created. Please log in with your new User ID and password.
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--status-busy)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--status-busy)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">User ID or Email</label>
            <div style={{ position: 'relative' }}>
              <User
                size={18}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                required
                autoComplete="username"
                autoFocus
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="your-user-id"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}
          >
            {isLoading ? 'Signing In...' : 'Log In'}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          First time here?{' '}
          <Link to="/signup" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
            Create an account &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
