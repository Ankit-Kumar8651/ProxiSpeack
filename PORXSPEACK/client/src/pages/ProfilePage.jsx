import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/avatars/Avatar';
import { AvatarSelector } from '../components/avatars/AvatarSelector';
import { User, Mail, Briefcase, Building, Shield, Check, Save } from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    department: currentUser?.department || 'Engineering',
    jobTitle: currentUser?.jobTitle || '',
    avatarId: currentUser?.avatarId || 'alex-dev',
    availability: currentUser?.availability || 'Available',
    assignedOffice: currentUser?.assignedOffice || 'Open Workspace HQ',
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div style={{ padding: '2rem 0', flex: 1 }}>
      <div className="content-wrapper" style={{ maxWidth: 840 }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              marginBottom: '0.25rem',
            }}
          >
            User Profile & Identity
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Customize your cartoon avatar, availability, and personal workspace assignment.
          </p>
        </div>

        {/* Profile Card */}
        <div className="ui-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          {/* Top Banner with live avatar preview */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1.5rem',
              paddingBottom: '2rem',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '2rem',
            }}
          >
            <Avatar
              avatarId={formData.avatarId}
              size={84}
              availability={formData.availability}
              isSelected
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{formData.name || 'User'}</h2>
                <span className={`status-badge status-${formData.availability.toLowerCase()}`}>
                  <span className="status-dot" />
                  {formData.availability}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {formData.jobTitle || 'Team Member'} • {formData.department}
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Role: <strong style={{ color: 'var(--accent-primary)' }}>{currentUser?.role === 'admin' ? 'Administrator' : 'Standard Member'}</strong> •
                Joined: {currentUser?.dateJoined || '2025-01-01'}
              </div>
            </div>
          </div>

          {saveSuccess && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid var(--status-available)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--status-available)',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <Check size={18} />
              Profile and cartoon avatar updated successfully!
            </div>
          )}

          <form onSubmit={handleSave}>
            {/* Avatar Selector */}
            <div style={{ marginBottom: '1.75rem' }}>
              <AvatarSelector
                selectedAvatarId={formData.avatarId}
                onSelect={(id) => setFormData({ ...formData, avatarId: id })}
                columns={4}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Read-Only)</label>
                <input
                  type="email"
                  readOnly
                  disabled
                  value={formData.email}
                  className="form-input"
                  style={{ opacity: 0.7, cursor: 'not-allowed' }}
                />
              </div>

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
                <label className="form-label">Job Title</label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Live Availability</label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="form-select"
                >
                  <option value="Available">Available (Green)</option>
                  <option value="Busy">Busy (Red)</option>
                  <option value="Away">Away (Amber)</option>
                  <option value="Offline">Offline (Gray)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Virtual Office</label>
                <input
                  type="text"
                  value={formData.assignedOffice}
                  onChange={(e) => setFormData({ ...formData, assignedOffice: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary btn-lg">
                <Save size={18} />
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
