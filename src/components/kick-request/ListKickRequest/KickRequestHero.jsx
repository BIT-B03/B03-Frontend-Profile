import React from 'react';
import { Link } from 'react-router-dom';

export default function KickRequestHero({
    subtitle = 'Admin Review Queue',
    description = 'Displays pending member removal requests retrieved securely.',
    actionLabel = 'Create Kick Request',
    actionTo = '/member-management/kick-request/create',
}) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-pure-white text-xl font-semibold">{subtitle}</p>
                <p className="text-muted-gray text-sm">{description}</p>
            </div>
            <div className="flex gap-3 flex-wrap">
                <Link
                    to={actionTo}
                    className="inline-flex items-center gap-2 rounded-2xl bg-brand-24e1c9 px-4 py-3 text-sm font-semibold text-dark-bg shadow-[0_12px_35px_rgba(36,225,201,0.2)] hover:opacity-90"
                >
                    {actionLabel}
                </Link>
            </div>
        </div>
    );
}
