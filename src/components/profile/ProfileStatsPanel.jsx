import React from 'react';
import { FaFolderOpen, FaUsers } from 'react-icons/fa';
import { MdOutlineTimelapse, MdCheckCircle } from 'react-icons/md';
import { Card, SectionHead } from './ProfileUI';

const STAT_CONFIG = [
  {
    key: 'totalProjects',
    label: 'Total Projects',
    icon: FaFolderOpen,
    iconColor: '#60a5fa',
    accent: 'rgba(96,165,250,0.12)',
    border: 'rgba(96,165,250,0.25)',
    iconBg: 'rgba(96,165,250,0.15)',
  },
  {
    key: 'onProgress',
    label: 'On Progress',
    icon: MdOutlineTimelapse,
    iconColor: '#fbbf24',
    accent: 'rgba(251,191,36,0.12)',
    border: 'rgba(251,191,36,0.25)',
    iconBg: 'rgba(251,191,36,0.15)',
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: MdCheckCircle,
    iconColor: '#34d399',
    accent: 'rgba(52,211,153,0.12)',
    border: 'rgba(52,211,153,0.25)',
    iconBg: 'rgba(52,211,153,0.15)',
  },
  {
    key: 'totalContributors',
    label: 'Contributors',
    icon: FaUsers,
    iconColor: '#a78bfa',
    accent: 'rgba(167,139,250,0.12)',
    border: 'rgba(167,139,250,0.25)',
    iconBg: 'rgba(167,139,250,0.15)',
  },
];

const StatItem = ({ label, value, icon: Icon, iconColor, accent, border, iconBg }) => (
  <div
    className="rounded-xl px-4 py-3.5 flex flex-col gap-2 transition-all duration-200 hover:brightness-110"
    style={{ background: accent, border: `1px solid ${border}` }}
  >
    <div className="flex items-center justify-between">
      <span className="text-[11px] uppercase tracking-[0.18em] font-medium" style={{ color: iconColor, opacity: 0.85 }}>
        {label}
      </span>
      <span className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: iconBg }}>
        <Icon size={15} style={{ color: iconColor }} />
      </span>
    </div>
    <div className="text-2xl font-bold text-pure-white leading-none">{value}</div>
  </div>
);

const StatSkeleton = () => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-[76px] rounded-xl skeleton-base skeleton-shimmer" />
    ))}
  </div>
);

const ProfileStatsPanel = ({ stats, loading }) => {
  const projects = stats?.projects || {};
  const contributors = stats?.contributors || {};

  const values = {
    totalProjects: projects.total ?? 0,
    onProgress: projects.on_progress ?? 0,
    completed: projects.completed ?? 0,
    totalContributors:
      contributors.total ??
      contributors.total_members ??
      contributors.count ??
      0,
  };

  return (
    <Card>
      <SectionHead title="Statistics" />
      {loading ? (
        <StatSkeleton />
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {STAT_CONFIG.map((cfg) => (
            <StatItem
              key={cfg.key}
              label={cfg.label}
              value={values[cfg.key]}
              icon={cfg.icon}
              iconColor={cfg.iconColor}
              accent={cfg.accent}
              border={cfg.border}
              iconBg={cfg.iconBg}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default ProfileStatsPanel;
