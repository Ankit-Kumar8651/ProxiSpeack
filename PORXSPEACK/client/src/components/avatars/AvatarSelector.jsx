import React from 'react';
import { AVATAR_PRESETS, AvatarGraphic } from './Avatar';
import { Check } from 'lucide-react';

export const AvatarSelector = ({ selectedAvatarId, onSelect, columns = 4 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <label className="form-label" style={{ marginBottom: 0 }}>
        Choose Your Cartoon Avatar
      </label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: '0.75rem',
        }}
      >
        {AVATAR_PRESETS.map((preset) => {
          const isSelected = selectedAvatarId === preset.id;
          return (
            <button
              type="button"
              key={preset.id}
              onClick={() => onSelect(preset.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.75rem 0.5rem',
                background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--card-radius)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
                transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                boxShadow: isSelected ? '0 4px 12px var(--accent-glow)' : 'none',
              }}
            >
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
              <AvatarGraphic avatarId={preset.id} size={54} />
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                  }}
                >
                  {preset.name.split(' ')[0]}
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  {preset.role}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarSelector;
