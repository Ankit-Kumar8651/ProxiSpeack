import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../avatars/Avatar';
import {
  Menu,
  X,
  Volume2,
  Moon,
  Sun,
  Layout,
  Bell,
  LogOut,
  User,
  Users,
  Compass,
  Building,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { theme, setTheme, uiMode, setUiMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'midnight' : 'dark';
    setTheme(nextTheme);
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 0.85rem',
    borderRadius: 'var(--btn-radius)',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
    background: isActive ? 'var(--accent-primary-light)' : 'transparent',
    transition: 'all 0.15s ease',
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--header-glass)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'background-color 0.2s ease',
      }}
    >
      <div
        className="content-wrapper"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.25rem',
        }}
      >
        {/* Brand Logo */}
        <Link
          to={isAuthenticated ? '/' : '/login'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontWeight: 800,
            fontSize: '1.25rem',
            fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 12px var(--accent-glow)',
            }}
          >
            <Volume2 size={22} strokeWidth={2.5} />
          </div>
          <span>
            Proxi<span style={{ color: 'var(--accent-primary)' }}>Speak</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.4rem',
          }}
          className="desktop-nav"
        >
          {!isAuthenticated ? null : (
            <>
              <NavLink to="/" style={navLinkStyle} end>
                Home
              </NavLink>
              <NavLink to="/dashboard" style={navLinkStyle}>
                <Building size={16} />
                Dashboard
              </NavLink>
              <NavLink to="/office/main-hq" style={navLinkStyle}>
                <Compass size={16} />
                Virtual Office
              </NavLink>
              <NavLink to="/employees" style={navLinkStyle}>
                <Users size={16} />
                Employees
              </NavLink>
              <NavLink to="/appearance" style={navLinkStyle}>
                <Sparkles size={16} />
                Themes & UI
              </NavLink>
            </>
          )}
        </nav>

        {/* Desktop Right Actions */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.75rem',
          }}
          className="desktop-actions"
        >
          {/* Theme Quick Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.45rem', borderRadius: '50%' }}
            title={`Current theme: ${theme}. Click to switch.`}
          >
            {theme === 'light' ? <Sun size={17} color="#F59E0B" /> : <Moon size={17} />}
          </button>

          {!isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {/* Notification Popover Button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.45rem', borderRadius: '50%', position: 'relative' }}
                  title="Notifications"
                >
                  <Bell size={17} />
                  <span
                    style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'var(--status-busy)',
                    }}
                  />
                </button>

                {showNotifications && (
                  <div
                    className="ui-card"
                    style={{
                      position: 'absolute',
                      top: '115%',
                      right: 0,
                      width: '280px',
                      padding: '0.75rem',
                      zIndex: 60,
                      boxShadow: 'var(--shadow-xl)',
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                      Notifications
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ padding: '0.4rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                        👋 Sarah Chen entered <strong>Design Studio</strong>
                      </div>
                      <div style={{ padding: '0.4rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                        ⚡ Proximity audio range active (180px radius)
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Link with Avatar */}
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.6rem 0.25rem 0.35rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <Avatar
                  avatarId={currentUser?.avatarId || 'alex-dev'}
                  size={30}
                  availability={currentUser?.availability || 'Available'}
                />
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    maxWidth: 110,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {currentUser?.name?.split(' ')[0] || 'User'}
                </span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Logout from ProxiSpeak"
                style={{ color: 'var(--status-busy)' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="mobile-toggle">
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.4rem', borderRadius: '50%' }}
          >
            {theme === 'light' ? <Sun size={16} color="#F59E0B" /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.4rem' }}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            padding: '1rem',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-medium)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            animation: 'fadeIn 0.2s ease',
          }}
          className="mobile-drawer"
        >
          {isAuthenticated && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <Avatar
                avatarId={currentUser?.avatarId || 'alex-dev'}
                size={40}
                availability={currentUser?.availability}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{currentUser?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {currentUser?.email} ({currentUser?.role})
                </div>
              </div>
            </div>
          )}

          {!isAuthenticated ? (
            <>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Sign Up
                </Link>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)' }}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}
              >
                Dashboard
              </Link>
              <Link
                to="/office/main-hq"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--accent-primary)', fontWeight: 600 }}
              >
                Virtual Office (2D)
              </Link>
              <Link
                to="/employees"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}
              >
                Employees
              </Link>
              <Link
                to="/appearance"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}
              >
                Themes & UI Mode
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}
              >
                Profile & Avatars
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm"
                style={{ marginTop: '0.5rem' }}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>
      )}

      {/* Responsive media styling for desktop vs mobile */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
          .mobile-drawer { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
