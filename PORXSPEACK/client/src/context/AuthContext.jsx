import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

/**
 * Session handling
 * ----------------
 * The session lives in sessionStorage (NOT localStorage):
 *  - closing the tab/browser logs the user out, so every new visit asks for ID + password;
 *  - two tabs can be logged in as two different users (needed to test proximity audio).
 * The token is verified against the server (GET /api/auth/me) on every page load,
 * so a stale or forged session can never open a protected page.
 */
const SESSION_KEY = 'proxispeak_user_session';

export const getStoredSession = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const NETWORK_ERROR =
  'Cannot reach the ProxiSpeak server. Start the backend first (cd server && npm start).';

async function postJson(url, body) {
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(NETWORK_ERROR);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // 502/504 from the Vite proxy means the backend is not running
    if (res.status >= 500 && !data.error) throw new Error(NETWORK_ERROR);
    throw new Error(data.error || 'Request failed. Please try again.');
  }
  return data;
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  // true until the stored token (if any) has been verified with the server
  const [authLoading, setAuthLoading] = useState(() => !!getStoredSession()?.token);

  // Verify an existing session with the server on first load
  useEffect(() => {
    const session = getStoredSession();
    if (!session?.token) {
      setAuthLoading(false);
      return;
    }
    let cancelled = false;
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${session.token}` } })
      .then(async (res) => {
        if (!res.ok) throw new Error('invalid');
        const data = await res.json();
        if (!cancelled) setCurrentUser({ ...data.user, token: session.token });
      })
      .catch(() => {
        sessionStorage.removeItem(SESSION_KEY);
        if (!cancelled) setCurrentUser(null);
      })
      .finally(() => {
        if (!cancelled) setAuthLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = (user) => {
    if (user) sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else sessionStorage.removeItem(SESSION_KEY);
  };

  // Login with User ID (or email) + password. Server-verified only - no offline bypass.
  const login = async (identifier, password) => {
    const data = await postJson('/api/auth/login', {
      identifier: identifier.trim(),
      password,
    });
    const user = { ...data.user, token: data.token };
    persist(user);
    setCurrentUser(user);
    return user;
  };

  // Signup only CREATES the account. The user must then log in.
  const signup = async ({
    name,
    userId,
    email,
    password,
    confirmPassword,
    avatarId = 'alex-dev',
    department = 'Engineering',
    adminCode = '',
  }) => {
    if (!name?.trim() || !userId?.trim() || !email?.trim() || !password) {
      throw new Error('All required fields must be filled.');
    }
    if (password.length < 6) throw new Error('Password must be at least 6 characters.');
    if (password !== confirmPassword) throw new Error('Passwords do not match.');

    const data = await postJson('/api/auth/signup', {
      name: name.trim(),
      userId: userId.trim(),
      email: email.trim(),
      password,
      avatarId,
      department,
      adminCode: adminCode.trim(),
    });
    return data.user; // NOT logged in yet
  };

  const logout = useCallback(() => {
    const session = getStoredSession();
    if (session?.token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.token}` },
      }).catch(() => {});
    }
    persist(null);
    setCurrentUser(null);
  }, []);

  // Update profile (kept in the session; persisted on the server when possible)
  const updateProfile = (updates) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    persist(updated);
    setCurrentUser(updated);
    fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentUser.token}`,
      },
      body: JSON.stringify(updates),
    }).catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authLoading,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
