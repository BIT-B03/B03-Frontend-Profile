import React from 'react';

const EmptyState = () => (
    <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-fill border border-brand-stroke mb-6">
            <svg className="w-10 h-10 text-muted-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
        </div>

        <h3 className="text-pure-white text-xl font-semibold mb-2">No members found</h3>
        <p className="text-muted-gray text-base max-w-sm mx-auto mb-6">
            We couldn't find any members matching your current filters. Try adjusting your search or filter criteria.
        </p>
    </div>
);

export default EmptyState;
