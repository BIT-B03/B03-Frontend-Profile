import React from 'react';
import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import SidebarIcons from '../sidebarIcons';

export default function SidebarMenu({ isCollapsed, activePath, menuItems, onGo }) {
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

  return (
    <Menu menuItemStyles={menuItemStyles}>
      {menuItems.map((item) => {
        if (item.children && item.children.length > 0) {
          return (
            <SubMenu
              key={item.label}
              icon={SidebarIcons[item.iconKey] || null}
              label={item.label}
              title={isCollapsed ? item.label : undefined}
            >
              {item.children.map((child) => (
                <MenuItem
                  key={child.path}
                  icon={child.iconKey ? SidebarIcons[child.iconKey] : null}
                  active={activePath === child.path}
                  onClick={() => onGo(child.path)}
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
            icon={SidebarIcons[item.iconKey] || null}
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
