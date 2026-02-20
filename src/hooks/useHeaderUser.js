import { useEffect, useState } from 'react';

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
});

export default function useHeaderUser() {
  const [user, setUser] = useState(readHeaderUser);

  useEffect(() => {
    const handleStorage = (event) => {
      if (!event || (event.key !== 'username' && event.key !== 'position')) return;
      setUser(readHeaderUser());
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return user;
}
