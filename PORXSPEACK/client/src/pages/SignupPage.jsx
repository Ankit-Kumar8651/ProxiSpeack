import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AvatarSelector } from '../components/avatars/AvatarSelector';
import { Volume2, Mail, Lock, User, AtSign, KeyRound } from 'lucide-react';

export const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatarId: 'sarah-design',
    department: 'Engineering',
    adminCode: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^[a-zA-Z0-9._-]{3,20}$/.test(formData.userId.trim())) {
      setError('User ID must be 3-20 characters: letters, numbers, dot, dash or underscore.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      await signup(formData);
      // Account created -> user must now log in with the new credentials
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (err) {
      setError(err.message || 'Failed to create account.');
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
      <div className="ui-card" style={{ width: '100%', maxWidth: 540, padding: '2.25rem' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
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
              marginBottom: '0.75rem',
              boxShadow: '0 4px 12px var(--accent-glow)',
            }}
          >
            <Volume2 size={26} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
            Create Your ProxiSpeak Account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Join your colleagues in a 2D spatial collaboration workspace.
          </p>
        </div>

        {/* Error notification */}
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
          {/* Cartoon Avatar Picker */}
          <div style={{ marginBottom: '1.5rem' }}>
            <AvatarSelector
              selectedAvatarId={formData.avatarId}
              onSelect={(id) => setFormData({ ...formData, avatarId: id })}
              columns={4}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User
                  size={18}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">User ID * (used to log in)</label>
              <div style={{ position: 'relative' }}>
                <AtSign
                  size={18}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  placeholder="e.g. alex.rivera"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@company.com"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="form-select"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Analytics">Analytics</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Admin Invite Code (optional)</label>
              <div style={{ position: 'relative' }}>
                <KeyRound
                  size={18}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="password"
                  autoComplete="off"
                  value={formData.adminCode}
                  onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                  placeholder="Leave empty for a standard account"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.75rem', marginBottom: '1.25rem' }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
            Log in &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
