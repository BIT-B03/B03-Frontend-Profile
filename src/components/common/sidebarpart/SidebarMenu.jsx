import React, { useEffect, useMemo, useState } from 'react';
import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { sidebarIconMap } from '../../../utils/icon';

export default function SidebarMenu({ isCollapsed, activePath, menuItems, onGo }) {
  const storageKey = 'sidebar-submenu-state';
  const [manualSubmenuState, setManualSubmenuState] = useState(() => {
    try {
      const savedState = sessionStorage.getItem(storageKey);
      return savedState ? JSON.parse(savedState) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(manualSubmenuState));
  }, [manualSubmenuState]);

  // Determine which submenu should be open based on active path
  const autoOpenSubmenu = useMemo(() => {
    for (const item of menuItems) {
      if (item.children && item.children.length > 0) {
        const hasActiveChild = item.children.some((child) => activePath.startsWith(child.path));
        if (hasActiveChild) {
          return item.label;
        }
      }
    }
    return null;
  }, [activePath, menuItems]);

  // Use auto-open submenu unless the user manually toggled it
  const isSubmenuOpen = (label) => {
    if (Object.prototype.hasOwnProperty.call(manualSubmenuState, label)) {
      return manualSubmenuState[label];
    }
    return autoOpenSubmenu === label;
  };

  const menuItemStyles = {
    button: ({ active, level }) => {
      const collapsedRoot = isCollapsed && level === 0;
      return {
        backgroundColor: active ? 'rgba(36,225,201,0.12)' : 'transparent',
        color: active ? '#24e1c9' : '#9ca3af',
        fontWeight: active ? 600 : 400,
        fontSize: level > 0 ? '0.8rem' : '0.875rem',
        borderRadius: collapsedRoot ? '14px' : '10px',
        margin: collapsedRoot ? '5px auto' : level > 0 ? '2px 10px' : '3px 10px',
        padding: collapsedRoot ? '0' : undefined,
        width: collapsedRoot ? '52px' : undefined,
        height: collapsedRoot ? '52px' : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsedRoot ? 'center' : 'flex-start',
        paddingLeft: !collapsedRoot && level > 0 ? '16px' : undefined,
        '&:hover': {
          backgroundColor: 'rgba(36,225,201,0.08)',
          color: '#24e1c9',
        },
      };
    },
    icon: ({ level }) => ({
      color: 'inherit',
      minWidth: isCollapsed && level === 0 ? 'unset' : '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: isCollapsed && level === 0 ? '0' : '10px',
      flexShrink: 0,
    }),
    label: ({ level }) => ({
      display: isCollapsed && level === 0 ? 'none' : undefined,
    }),
    SubMenuExpandIcon: () => ({
      color: 'rgba(36,225,201,0.5)',
    }),
    subMenuContent: () => ({
      background: 'rgba(10,16,28,0.99)',
      borderRadius: '12px',
    }),
  };

  const renderIcon = (iconKey, sizeClass) => {
    if (!iconKey) return null;
    const Icon = sidebarIconMap[iconKey];
    return Icon ? <Icon className={sizeClass} /> : null;
  };

  return (
    <Menu menuItemStyles={menuItemStyles}>
      {menuItems.map((item) => {
        if (item.children && item.children.length > 0) {
          return (
            <SubMenu
              key={item.label}
              icon={renderIcon(item.iconKey, 'w-5 h-5')}
              label={item.label}
              title={isCollapsed ? item.label : undefined}
              open={isSubmenuOpen(item.label)}
              onOpenChange={(open) => {
                const nextState = {
                  ...manualSubmenuState,
                  [item.label]: open,
                };
                sessionStorage.setItem(storageKey, JSON.stringify(nextState));
                setManualSubmenuState(nextState);
              }}
            >
              {item.children.map((child) => (
                <MenuItem
                  key={child.path}
                  icon={renderIcon(child.iconKey, 'w-4 h-4')}
                  active={activePath === child.path}
                  onClick={() => {
                    const nextState = {
                      ...manualSubmenuState,
                      [item.label]: true,
                    };
                    sessionStorage.setItem(storageKey, JSON.stringify(nextState));
                    setManualSubmenuState(nextState);
                    onGo(child.path);
                  }}
                >
                  {child.label}
                </MenuItem>
              ))}
            </SubMenu>
          );
        }

        return (
          <MenuItem
            key={item.path}
            icon={renderIcon(item.iconKey, 'w-5 h-5')}
            active={activePath === item.path}
            onClick={() => onGo(item.path)}
            title={isCollapsed ? item.label : undefined}
          >
            {item.label}
          </MenuItem>
        );
      })}
    </Menu>
  );
}
