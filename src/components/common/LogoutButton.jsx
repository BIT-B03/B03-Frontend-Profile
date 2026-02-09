import React from 'react';

export default function LogoutButton({ collapsed, onClick }) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? 'Logout' : undefined}
      className={`w-full flex items-center rounded-lg text-muted-gray hover:text-red-400 hover:bg-red-500/10 transition group ${
        collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'
      }`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      {!collapsed && <span className="text-sm font-medium">Logout</span>}
    </button>
  );
}
