import { useCallback, useState } from 'react';
import { createKickRequest } from '../api/api';

export function useKickRequestModal({ onSuccess } = {}) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [targetMembers, setTargetMembers] = useState([]);

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

        setIsSubmitting(true);
        setError(null);

        try {
            const trimmedReason = reason.trim();
            await Promise.all(
                targetMembers.map((member) =>
                    createKickRequest(member.hashed_id, trimmedReason)
                )
            );

            setIsOpen(false);
            setReason('');
            setTargetMembers([]);

            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error('Failed to submit kick request', err);
            setError('Failed to submit kick request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, [reason, targetMembers, onSuccess]);

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
