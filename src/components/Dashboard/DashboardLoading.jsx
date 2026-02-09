import React from 'react';
import { DASHBOARD_LOADING_CONFIG } from '../../hooks/loading';

export default function DashboardLoading({
  config = DASHBOARD_LOADING_CONFIG,
  className = '',
}) {
  return (
    <div className={`space-y-4 ${className}`.trim()}>
      {config.sections.map((section) => (
        <div key={section.key} className={section.wrapperClassName}>
          {section.items.map((item, idx) => (
            <div
              key={item.key || `${section.key}-${idx}`}
              className={`${config.cardBaseClassName} ${item.className}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
