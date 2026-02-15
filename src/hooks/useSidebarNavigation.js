import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutAndRedirect } from './logout';

export default function useSidebarNavigation({ onClose } = {}) {
  const navigate = useNavigate();
  const location = useLocation();

  const activePath = location.pathname;

  const role = useMemo(() => {
    try {
      const stored = localStorage.getItem('role');
      return (stored || 'user').toString().toLowerCase();
    } catch {
      return 'user';
    }
  }, []);

  const hasRoleAccess = useCallback((allowedRoles, currentRole) => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(currentRole);
  }, []);

  const filterMenuItems = useCallback(
    (items, currentRole) =>
      items.reduce((acc, item) => {
        if (item.children) {
          const children = filterMenuItems(item.children, currentRole);
          if (children.length > 0) {
            acc.push({ ...item, children });
          }
          return acc;
        }

        if (hasRoleAccess(item.roles, currentRole)) {
          acc.push(item);
        }
        return acc;
      }, []),
    [hasRoleAccess]
  );

  const menuItems = useMemo(() => {
    const items = [
      { label: 'Dashboard', path: '/dashboard', iconKey: 'dashboard', roles: ['superuser', 'admin', 'user'] },
      { label: 'Profile', path: '/profile', iconKey: 'profile', roles: ['superuser', 'admin', 'user'] },
      {
        label: 'Member Management',
        iconKey: 'members',
        roles: ['superuser', 'admin'],
        children: [
          { label: 'Kick Request', path: '/member-management/kick-request', iconKey: 'kickRequest', roles: ['superuser', 'admin'] },
          { label: 'Create Kick Request', path: '/member-management/kick-request/create', iconKey: 'createKickRequest', roles: ['superuser', 'admin'] },
          { label: 'Position Role', path: '/member-management/position-role', iconKey: 'positionRole', roles: ['superuser', 'admin'] },
        ],
      },
      {
        label: 'Project',
        iconKey: 'project',
        children: [
          { label: 'My Project', path: '/project/my', iconKey: 'myProject', roles: ['superuser', 'admin', 'user'] },
          { label: 'Create Project', path: '/project/create', iconKey: 'createProject', roles: ['superuser', 'admin', 'user'] },
          { label: 'Project', path: '/project', iconKey: 'allProject', roles: ['superuser', 'admin'] },
        ],
      },
      { label: 'Settings', path: '/settings', iconKey: 'settings', roles: ['superuser', 'admin'] },
    ];

    return filterMenuItems(items, role);
  }, [filterMenuItems, role]);

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
