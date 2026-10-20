import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Avatar } from '../components/avatars/Avatar';
import {
  Sparkles,
  Layout,
  Sun,
  Moon,
  Eye,
  Check,
  CheckCircle2,
  Sliders,
  Palette,
  Volume2,
} from 'lucide-react';

export const AppearancePage = () => {
  const { theme, setTheme, uiMode, setUiMode, THEMES, UI_MODES } = useTheme();

  return (
    <div style={{ padding: '2rem 0', flex: 1 }}>
      <div className="content-wrapper">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '0.35rem',
            }}
          >
            <Palette color="var(--accent-primary)" size={28} />
            Themes & Interface Appearance
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Customize your color theme and switch between <strong>Normal Mode</strong> and{' '}
            <strong>Visual Mode</strong>. Preferences are saved automatically.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Section 1: Color Themes */}
          <div className="ui-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-primary-light)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Palette size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Color Palette Theme</h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Applies globally to the navbar, cards, forms, and canvas
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {THEMES.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                      border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--card-radius)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        {t.name}
                        {isSelected && <Check size={16} />}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {t.desc}
                      </div>
                    </div>

                    {/* Color dot previews */}
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <span
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background:
                            t.id === 'light'
                              ? '#F8FAFC'
                              : t.id === 'midnight'
                              ? '#050711'
                              : t.id === 'high-contrast'
                              ? '#000'
                              : '#0F172A',
                          border: '1px solid #94A3B8',
                        }}
                      />
                      <span
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background:
                            t.id === 'high-contrast'
                              ? '#FFFF00'
                              : t.id === 'midnight'
                              ? '#38BDF8'
                              : '#6366F1',
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Interface Mode (Normal vs Visual) */}
          <div className="ui-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-primary-light)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sliders size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Interface Presentation Mode</h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Independent from color theme (Works on Light or Dark)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {UI_MODES.map((mode) => {
                const isSelected = uiMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setUiMode(mode.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '1.15rem',
                      background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                      border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--card-radius)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '1rem',
                          color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                        }}
                      >
                        {mode.name}
                        {isSelected && <CheckCircle2 size={16} />}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          background: isSelected ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                          color: isSelected ? '#fff' : 'var(--text-secondary)',
                          fontWeight: 600,
                        }}
                      >
                        {mode.id === 'normal' ? 'Standard & Compact' : 'Rich Glassmorphic'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {mode.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live UI Components Showcase & Interactive Preview */}
        <div className="ui-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Live Appearance Showcase</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Demonstrating current combination: <strong>{theme.toUpperCase()}</strong> +{' '}
                <strong>{uiMode.toUpperCase()} MODE</strong>
              </p>
            </div>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--accent-primary)',
                background: 'var(--accent-primary-light)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              Real-time Token Binding
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Card Sample 1 */}
            <div className="ui-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Avatar avatarId="sarah-design" size={48} availability="Available" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Sarah Chen</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lead Product Designer</div>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Cards automatically inherit smooth borders, hover elevations, and dynamic glassmorphism.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm">Connect</button>
                <button className="btn btn-secondary btn-sm">Profile</button>
              </div>
            </div>

            {/* Card Sample 2 */}
            <div className="ui-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                FORM CONTROLS & INPUTS
              </div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Workspace Name</label>
                <input
                  type="text"
                  readOnly
                  value="ProxiSpeak Global Campus"
                  className="form-input"
                  style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span className="status-badge status-available">Available</span>
                <span className="status-badge status-busy">Busy</span>
                <span className="status-badge status-away">Away</span>
              </div>
            </div>

            {/* Card Sample 3 */}
            <div className="ui-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                SPATIAL AUDIO PREVIEW
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Volume2 size={20} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Distance: 45px (88% Volume)</span>
              </div>
              <div
                style={{
                  height: 6,
                  background: 'var(--border-subtle)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: '88%',
                    background: 'linear-gradient(90deg, #10B981, var(--accent-primary))',
                  }}
                />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Stereo Panning: Left -0.25 | Natural Attenuation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearancePage;
