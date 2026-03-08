import { useCallback, useMemo, useState } from 'react';
import { createKickRequest } from '../api/api';

const extractTargetMemberId = (request) => {
    if (!request || typeof request !== 'object') return null;
    return null;
};

const getMemberDisplayName = (member) => member?.name || member?.user_name || member?.username || 'This member';

const formatDuplicateErrorMessage = (members) => {
    if (!members || members.length === 0) {
        return 'Selected member is already in the kick request list.';
    }

    const names = members.map(getMemberDisplayName);
    if (names.length === 1) return `${names[0]} is already in the kick request list.`;
    if (names.length === 2) return `${names[0]} and ${names[1]} are already in the kick request list.`;

    const [first, second, ...rest] = names;
    return `${first}, ${second}, and ${rest.length} other member${rest.length === 1 ? '' : 's'} are already in the kick request list.`;
};

const isDuplicateServerError = (error) => {
    const status = error?.response?.status;
    if (status === 409) return true;
    const message = error?.response?.data?.message || error?.message;
    if (!message) return false;
    const normalized = String(message).toLowerCase();
    return normalized.includes('already') && normalized.includes('kick request');
};

export function useKickRequestModal({ onSuccess, existingRequests = [] } = {}) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [targetMembers, setTargetMembers] = useState([]);

    const existingTargetIds = useMemo(() => {
        const ids = new Set();
        (existingRequests || []).forEach((request) => {
            const targetId = extractTargetMemberId(request);
            if (targetId) ids.add(targetId);
        });
        return ids;
    }, [existingRequests]);

    const findDuplicatesInSelection = useCallback((members) => {
        if (!members || members.length === 0 || existingTargetIds.size === 0) return [];
        return members.filter((member) => {
            if (!member?.hashed_id) return false;
            return existingTargetIds.has(String(member.hashed_id));
        });
    }, [existingTargetIds]);

    const openModal = useCallback((members) => {
        setTargetMembers(Array.isArray(members) ? members : []);
        setIsOpen(true);
        setError(null);
    }, []);

    const closeModal = useCallback(() => {
        if (isSubmitting) return;
        setIsOpen(false);
    }, [isSubmitting]);

    const submitKickRequest = useCallback(async () => {
        if (!reason.trim()) {
            setError('Reason for kick is required.');
            return;
        }

        if (!targetMembers.length) {
            setError('No members selected for removal.');
            return;
        }

        const duplicatesInSelection = findDuplicatesInSelection(targetMembers);
        if (duplicatesInSelection.length) {
            setError(formatDuplicateErrorMessage(duplicatesInSelection));
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const trimmedReason = reason.trim();
            const duplicateMembersDuringSubmit = [];

            for (const member of targetMembers) {
                try {
                    await createKickRequest(member.hashed_id, trimmedReason);
                } catch (err) {
                    if (isDuplicateServerError(err)) {
                        duplicateMembersDuringSubmit.push(member);
                        continue;
                    }
                    throw err;
                }
            }

            if (duplicateMembersDuringSubmit.length) {
                setError(formatDuplicateErrorMessage(duplicateMembersDuringSubmit));
                return;
            }

            setIsOpen(false);
            setReason('');
            setTargetMembers([]);

            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error('Failed to submit kick request', err);
            if (isDuplicateServerError(err)) {
                setError(formatDuplicateErrorMessage(targetMembers));
            } else {
                setError('Failed to submit kick request. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [reason, targetMembers, onSuccess, findDuplicatesInSelection]);

    return {
        isOpen,
        reason,
        setReason,
        isSubmitting,
        error,
        targetMembers,
        openModal,
        closeModal,
        submitKickRequest,
    };
}
