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

    const createdAt = useMemo(() => formatDate(request?.created_at), [request?.created_at]);

    const avatarSrc = useMemo(() => {
        const avatarUrl = request?.avatar_url;
        if (avatarUrl) return getAvatarImageUrl(avatarUrl);
        return null;
    }, [request?.avatar_url]);

    const initials = useMemo(() => getInitials(request?.user_name), [request?.user_name]);

    const reasonSummary = useMemo(() => summarizeReason(request?.reason), [request?.reason]);

    const othersCount = useMemo(() => {
        const base = approvedBy.length;
        const known = 2;
        return Math.max(base - known, 0);
    }, [approvedBy]);

    return {
        approvedBy,
        createdAt,
        avatarSrc,
        initials,
        reasonSummary,
        othersCount,
    };
}
