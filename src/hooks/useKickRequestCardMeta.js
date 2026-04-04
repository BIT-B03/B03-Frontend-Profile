import { useMemo } from 'react';
import { getAvatarImageUrl } from '../api/api';

const parseApprovedBy = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) return parsed;
        } catch {
            // ignore JSON errors
        }
        return value ? [value] : [];
    }
    return [];
};

const getRoleStatus = (approved, rejected) => {
    if (approved) return 'approved';
    if (rejected) return 'rejected';
    return 'neutral';
};

const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'Unknown date';
    return date.toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

const getInitials = (name) => {
    if (!name) return '?';
    return String(name).trim().charAt(0).toUpperCase();
};

const summarizeReason = (reason) => {
    if (!reason) return 'No reason provided';
    return reason.length > 120 ? `${reason.slice(0, 117)}...` : reason;
};

export default function useKickRequestCardMeta(request) {
    const approvedBy = useMemo(() => parseApprovedBy(request?.approved_by), [request?.approved_by]);
    const rejectedBy = useMemo(() => parseApprovedBy(request?.rejected_by), [request?.rejected_by]);

    const normalizedCurrentUser = useMemo(() => {
        if (typeof window === 'undefined') return '';
        return String(localStorage.getItem('username') || '').trim().toLowerCase();
    }, []);
    const approversLower = useMemo(
        () => approvedBy.map((name) => String(name || '').trim().toLowerCase()),
        [approvedBy]
    );
    const hasApproved = useMemo(
        () => Boolean(normalizedCurrentUser && approversLower.includes(normalizedCurrentUser)),
        [approversLower, normalizedCurrentUser]
    );

    const createdAt = useMemo(() => formatDate(request?.created_at), [request?.created_at]);

    const avatarSrc = useMemo(() => {
        const avatarUrl = request?.avatar_url;
        if (avatarUrl) return getAvatarImageUrl(avatarUrl);
        return null;
    }, [request?.avatar_url]);

    const initials = useMemo(() => getInitials(request?.user_name), [request?.user_name]);

    const reasonSummary = useMemo(() => summarizeReason(request?.reason), [request?.reason]);

    const roleStatuses = useMemo(
        () => ({
            coordinator: getRoleStatus(request?.koordinator_approved, request?.koordinator_rejected),
            coCoordinator: getRoleStatus(request?.co_coordinator_approved, request?.co_coordinator_rejected),
            mentor: getRoleStatus(request?.mentor_approved, request?.mentor_rejected),
        }),
        [
            request?.koordinator_approved,
            request?.koordinator_rejected,
            request?.co_coordinator_approved,
            request?.co_coordinator_rejected,
            request?.mentor_approved,
            request?.mentor_rejected,
        ]
    );

    const othersCount = useMemo(() => {
        const base = approvedBy.length;
        const known = 2;
        return Math.max(base - known, 0);
    }, [approvedBy]);

    return {
        approvedBy,
        rejectedBy,
        createdAt,
        avatarSrc,
        initials,
        reasonSummary,
        othersCount,
        roleStatuses,
        hasApproved,
    };
}
