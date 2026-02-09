import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutAndRedirect } from './logout';

export default function useSidebarNavigation({ onClose } = {}) {
  const navigate = useNavigate();
  const location = useLocation();

  const activePath = location.pathname;

  const menuItems = useMemo(
    () => [
      { label: 'Dashboard', path: '/dashboard', iconKey: 'dashboard' },
      { label: 'Members', path: '/people', iconKey: 'members' },
      { label: 'Profile', path: '/profile', iconKey: 'profile' },
      { label: 'Settings', path: '/settings', iconKey: 'settings' },
    ],
    []
  );

  const goTo = useCallback(
    (path) => {
      onClose?.();
      navigate(path);
    },
    [navigate, onClose]
  );

  const logout = useCallback(() => {
    logoutAndRedirect({ navigate, onClose });
  }, [navigate, onClose]);

  return {
    activePath,
    menuItems,
    goTo,
    logout,
  };
}
