import React from 'react';
import BlurFrame from '../../common/BlurFrame';

export function KickRequestApprovalModal({
    open,
    onCancel,
    onConfirm,
    memberName,
    loading = false,
    error,
}) {
    return (
        <BlurFrame isOpen={open} onClose={onCancel}>
            <div className="p-6 space-y-4">
                <div>
                    <p className="text-lg font-semibold text-pure-white">Approve Kick Request</p>
                    <p className="text-sm text-muted-gray mt-1">
                        {memberName ? (
                            <>
                                Are you sure you want to approve the request for{' '}
                                <span className="font-semibold text-pure-white">{memberName}</span>? The member will be removed from the lab.
                            </>
                        ) : (
                            'Are you sure you want to approve this request? The member will be removed from the lab.'
                        )}
                    </p>
                </div>

                {error && (
                    <div className="rounded-md border border-filter-red-border/40 bg-[rgba(220,38,38,0.1)] px-3 py-2 text-sm text-pure-white">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 rounded-[10px] border border-white/10 bg-white/5 text-sm font-semibold text-muted-gray hover:bg-white/10 transition disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        aria-busy={loading}
                        className="px-4 py-2 rounded-[10px] bg-brand-24e1c9 text-sm font-semibold text-dark-bg shadow-[0_12px_35px_rgba(36,225,201,0.2)] hover:opacity-90 transition disabled:opacity-60"
                    >
                        {loading ? 'Approving…' : 'Approve'}
                    </button>
                </div>
            </div>
        </BlurFrame>
    );
}

export function KickRequestRejectModal({
    open,
    onCancel,
    onConfirm,
    memberName,
    loading = false,
    error,
}) {
    return (
        <BlurFrame isOpen={open} onClose={onCancel}>
            <div className="p-6 space-y-4">
                <div>
                    <p className="text-lg font-semibold text-pure-white">Reject Kick Request</p>
                    <p className="text-sm text-muted-gray mt-1">
                        {memberName ? (
                            <>
                                Are you sure you want to reject the request for{' '}
                                <span className="font-semibold text-pure-white">{memberName}</span>? The request will be closed and no action will be taken on the member.
                            </>
                        ) : (
                            'Are you sure you want to reject this request? The request will be closed and no action will be taken on the member.'
                        )}
                    </p>
                </div>

                {error && (
                    <div className="rounded-md border border-filter-red-border/40 bg-[rgba(220,38,38,0.1)] px-3 py-2 text-sm text-pure-white">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 rounded-[10px] border border-white/10 bg-white/5 text-sm font-semibold text-muted-gray hover:bg-white/10 transition disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        aria-busy={loading}
                        className="px-4 py-2 rounded-[10px] border border-filter-red-border/40 bg-[rgba(220,38,38,0.1)] text-sm font-semibold text-pure-white shadow-[0_12px_35px_rgba(220,38,38,0.18)] hover:bg-[rgba(220,38,38,0.2)] transition disabled:opacity-60"
                    >
                        {loading ? 'Rejecting…' : 'Reject'}
                    </button>
                </div>
            </div>
        </BlurFrame>
    );
}
