import React from 'react';
import LogoutButton from '../LogoutButton';

export default function SidebarFooter({ collapsed, onLogout }) {
  return (
    <div
      className="mt-auto px-3 py-4"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.25)',
      }}
    >
      <LogoutButton collapsed={collapsed} onClick={onLogout} />
    </div>
  );
}
