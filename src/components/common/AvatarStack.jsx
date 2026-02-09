import React from 'react';
import { createPortal } from 'react-dom';
import { useAvatarCircleModel, useMoreBadgeStyle } from '../../hooks/useAvatarStack';

function AvatarCircle({ name, avatarUrl, hashedId, size = 28 }) {
  const {
    src,
    imgOk,
    onImgError,
    initial,
    circleStyle,
    anchorRef,
    tooltipOpen,
    tooltipPos,
    tooltipHandlers,
    ariaLabel,
    title,
    tabIndex,
  } = useAvatarCircleModel({ name, avatarUrl, hashedId, size });

  return (
    <div
      ref={anchorRef}
      className="relative"
      style={{ width: size, height: size }}
      aria-label={ariaLabel}
      title={title}
      tabIndex={tabIndex}
      {...tooltipHandlers}
    >
      <div
        className="grid place-items-center rounded-full border border-white/15 ring-2 ring-dark-bg text-[11px] font-semibold text-pure-white overflow-hidden"
        style={circleStyle}
      >
        {src && imgOk ? (
          <img
            src={src}
            alt={name || 'Contributor'}
            className="h-full w-full object-cover"
            onError={onImgError}
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      {/* Tooltip (portal to body to avoid clipping by overflow containers) */}
      {tooltipOpen && name && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="pointer-events-none fixed z-[9999]"
              style={{ top: tooltipPos.top - 8, left: tooltipPos.left, transform: 'translate(-50%, -100%)' }}
              role="tooltip"
            >
              <div className="max-w-[220px] rounded-md border border-white/10 bg-dark-bg/95 px-2 py-1 text-[11px] leading-tight text-pure-white shadow-lg text-center whitespace-normal">
                {name}
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

export default function AvatarStack({
  users,
  max = 5,
  size = 28,
  className = '',
}) {
  const list = Array.isArray(users) ? users.filter(Boolean) : [];
  const shown = list.slice(0, max);
  const rest = Math.max(0, list.length - shown.length);

  const moreStyle = useMoreBadgeStyle({ size });

  return (
    <div className={`flex items-center -space-x-2 ${className}`.trim()}>
      {shown.map((u) => (
        <div key={u?.hashed_id || u?.name} className="relative">
          <AvatarCircle
            name={u?.name}
            avatarUrl={u?.avatar_url}
            hashedId={u?.hashed_id}
            size={size}
          />
        </div>
      ))}

      {rest > 0 ? (
        <div
          className="grid place-items-center rounded-full border border-white/15 ring-2 ring-dark-bg bg-dark-bg text-[11px] font-semibold text-pure-white"
          style={moreStyle}
          aria-label={`${rest} more contributors`}
          title={`${rest} more contributors`}
        >
          +{rest}
        </div>
      ) : null}
    </div>
  );
}
