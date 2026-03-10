import { useCallback, useState } from 'react';
import { confirmPelamar, rejectPelamar } from '../api/api';

export function useConfirmPelamarModal({ onSuccess } = {}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [targetPelamar, setTargetPelamar] = useState(null);
    const [actionType, setActionType] = useState(null); // 'confirm' | 'reject'

    const openModal = useCallback((pelamar, type) => {
        setTargetPelamar(pelamar);
        setActionType(type);
        setIsOpen(true);
        setError(null);
    }, []);

    const closeModal = useCallback(() => {
        if (isSubmitting) return;
        setIsOpen(false);
        setTargetPelamar(null);
        setActionType(null);
        setError(null);
    }, [isSubmitting]);

    const submitAction = useCallback(async () => {
        if (!targetPelamar) {
            setError('No applicant selected.');
            return;
        }
        if (!actionType) {
            setError('No action specified.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            if (actionType === 'confirm') {
                await confirmPelamar(targetPelamar.hashed_id);
            } else {
                await rejectPelamar(targetPelamar.hashed_id);
            }
            setIsOpen(false);
            setTargetPelamar(null);
            setActionType(null);

            if (onSuccess) {
                onSuccess({ id: targetPelamar.hashed_id, action: actionType });
            }
        } catch (err) {
            console.error('Failed to process applicant', err);
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                (actionType === 'confirm'
                    ? 'Failed to confirm applicant. Please try again.'
                    : 'Failed to reject applicant. Please try again.');
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    }, [targetPelamar, actionType, onSuccess]);

    return {
        isOpen,
        isSubmitting,
        error,
        targetPelamar,
        actionType,
        openModal,
        closeModal,
        submitAction,
    };
}
