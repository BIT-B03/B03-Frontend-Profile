import { useEffect, useRef, useState } from 'react';
import { GetMyProfile } from '../api/api';

/**
 * Returns inline style for the position badge based on role hierarchy.
 * Mentor > Coordinator > Co-Coordinator > Member (default)
 */
export const getPositionStyle = (position) => {
  const p = (position || '').toLowerCase();

  if (p.includes('mentor')) {
    return {
      color: 'rgba(232, 100, 122, 0.95)',          // deep ruby/crimson — highest
      background: 'rgba(180, 30, 60, 0.12)',
      border: '1px solid rgba(180, 30, 60, 0.25)',
    };
  }
  if (p.includes('co-coord') || p.includes('co coord') || p === 'co-coordinator') {
    return {
      color: 'rgba(251, 191, 36, 0.9)',            // soft amber — supporting role
      background: 'rgba(245, 158, 11, 0.10)',
      border: '1px solid rgba(245, 158, 11, 0.22)',
    };
  }
  if (p.includes('coord')) {
    return {
      color: 'rgba(99, 165, 250, 0.95)',           // electric blue — authority
      background: 'rgba(60, 120, 220, 0.12)',
      border: '1px solid rgba(60, 120, 220, 0.25)',
    };
  }
  // Member / default — cool gray, subtle
  return {
    color: 'rgba(156, 163, 175, 0.75)',
    background: 'rgba(156, 163, 175, 0.07)',
    border: '1px solid rgba(156, 163, 175, 0.14)',
  };
};

const readHeaderUser = () => ({
  username: localStorage.getItem('username') || 'User',
  position: localStorage.getItem('position') || null,
  avatarUrl: localStorage.getItem('avatar_url') || null,
});

export default function useHeaderUser() {
  const [user, setUser] = useState(readHeaderUser);
  const hasRequestedProfile = useRef(false);
  const lastTokenRef = useRef(null);

  useEffect(() => {
    const handleStorage = (event) => {
      if (!event || (event.key !== 'username' && event.key !== 'position' && event.key !== 'avatar_url')) return;
      setUser(readHeaderUser());
    };

    const handleUserUpdated = () => {
      setUser(readHeaderUser());
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('user-updated', handleUserUpdated);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('user-updated', handleUserUpdated);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth_access_token');
    if (token !== lastTokenRef.current) {
      lastTokenRef.current = token;
      hasRequestedProfile.current = false;
      setUser(readHeaderUser());
    }

    if (!token) return;
    if (hasRequestedProfile.current) return;
    if (user?.avatarUrl) return;

    hasRequestedProfile.current = true;

    const run = async () => {
      try {
        const response = await GetMyProfile();
        const data = response?.data ?? response;
        const nextAvatar = data?.avatar_url || null;
        const nextUsername = data?.username || data?.name || null;
        const nextPosition = data?.position || null;

        if (nextAvatar) {
          localStorage.setItem('avatar_url', nextAvatar);
        }
        if (nextUsername) {
          localStorage.setItem('username', nextUsername);
        }
        if (nextPosition) {
          localStorage.setItem('position', nextPosition);
        }

        if (nextAvatar || nextUsername || nextPosition) {
          setUser(readHeaderUser());
          window.dispatchEvent(new Event('user-updated'));
        }
      } catch {
        // silent: keep header usable even if profile fetch fails
      }
    };

    run();
  }, [user?.avatarUrl]);

  return user;
}
