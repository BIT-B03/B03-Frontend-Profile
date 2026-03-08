import React from 'react';
import onProgressIcon from '../../../assets/onprogres.svg';

const STATUS_STYLES = {
    pending: {
        label: 'Pending',
        className: 'border-stat-yellow/60 bg-stat-yellow/10 text-stat-yellow',
        icon: onProgressIcon,
    },
    approved: {
        label: 'Approved',
        className: 'border-emerald-400/60 bg-emerald-500/15 text-emerald-100',
    },
};

const fallbackStyle = {
    label: 'Unknown',
    className: 'border-white/15 bg-white/5 text-muted-gray',
};

const normalizeStatus = (status) => (status ? String(status).toLowerCase() : '');

export default function KickRequestStatusBadge({ status }) {
    const key = normalizeStatus(status);
    const { label, className, icon } = STATUS_STYLES[key] || fallbackStyle;

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-[8px] border px-3 py-1 text-xs font-semibold tracking-wide ${className}`}>
            {icon ? (
                <img
                    src={icon}
                    alt=""
                    aria-hidden="true"
                    className="w-[12px] h-[12px] mt-0.5"
                    style={{
                        filter: 'invert(70%) sepia(85%) saturate(461%) hue-rotate(357deg) brightness(175%) contrast(98%)',
                    }}
                />
            ) : (
                <span className="w-2 h-2 rounded-full bg-current" aria-hidden />
            )}
            {label}
        </span>
    );
}
