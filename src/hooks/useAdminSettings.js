import { useCallback, useEffect, useRef, useState } from 'react';
import {
    SetAuthToken,
    getApplicantRetention,
    updateApplicantRetention,
    getDefaultGeneration,
    updateDefaultGeneration,
} from '../api/api';

const getRetentionValue = (payload) => {
    if (payload?.days !== undefined) return payload.days;
    if (payload?.data?.days !== undefined) return payload.data.days;
    if (payload?.result?.days !== undefined) return payload.result.days;
    return null;
};

const getGenerationValue = (payload) => {
    if (payload?.generation !== undefined) return payload.generation;
    if (payload?.data?.generation !== undefined) return payload.data.generation;
    if (payload?.result?.generation !== undefined) return payload.result.generation;
    return null;
};

export default function useAdminSettings() {
    const [retentionDays, setRetentionDays] = useState('');
    const [retentionStatus, setRetentionStatus] = useState(null);
    const [retentionLoading, setRetentionLoading] = useState(false);
    const [retentionSaving, setRetentionSaving] = useState(false);

    const [generationValue, setGenerationValue] = useState('');
    const [generationStatus, setGenerationStatus] = useState(null);
    const [generationLoading, setGenerationLoading] = useState(false);
    const [generationSaving, setGenerationSaving] = useState(false);
    const hasFetchedRef = useRef(false);

    // Ensure axios auth token is set when the hook is used
    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;
        if (token) SetAuthToken(token);
    }, []);

    const fetchRetention = useCallback(async (showMessage = false) => {
        try {
            setRetentionLoading(true);
            const res = await getApplicantRetention();
            const value = getRetentionValue(res);
            if (value !== null && value !== undefined) {
                setRetentionDays(String(value));
            }
            if (showMessage) {
                setRetentionStatus({ type: 'success', message: 'Value loaded successfully.' });
            } else {
                setRetentionStatus(null);
            }
        } catch {
            if (showMessage) {
                setRetentionStatus({ type: 'error', message: 'Failed to load value.' });
            } else {
                setRetentionStatus(null);
            }
        } finally {
            setRetentionLoading(false);
        }
    }, []);

    const fetchGeneration = useCallback(async (showMessage = false) => {
        try {
            setGenerationLoading(true);
            const res = await getDefaultGeneration();
            const value = getGenerationValue(res);
            if (value !== null && value !== undefined) {
                setGenerationValue(String(value));
            }
            if (showMessage) {
                setGenerationStatus({ type: 'success', message: 'Value loaded successfully.' });
            } else {
                setGenerationStatus(null);
            }
        } catch {
            if (showMessage) {
                setGenerationStatus({ type: 'error', message: 'Failed to load value.' });
            } else {
                setGenerationStatus(null);
            }
        } finally {
            setGenerationLoading(false);
        }
    }, []);

    useEffect(() => {
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;
        fetchRetention();
        fetchGeneration();
    }, [fetchRetention, fetchGeneration]);

    const handleSaveRetention = useCallback(async () => {
        const parsed = Number(retentionDays);
        if (!Number.isFinite(parsed) || parsed <= 0) {
            setRetentionStatus({ type: 'error', message: 'Please enter a valid number of days.' });
            return;
        }

        try {
            setRetentionSaving(true);
            await updateApplicantRetention(parsed);
            setRetentionStatus({ type: 'success', message: 'Value saved successfully.' });
        } catch {
            setRetentionStatus({ type: 'error', message: 'Failed to save value.' });
        } finally {
            setRetentionSaving(false);
        }
    }, [retentionDays]);

    const handleSaveGeneration = useCallback(async () => {
        const trimmed = generationValue.trim();
        if (!trimmed) {
            setGenerationStatus({ type: 'error', message: 'Please enter a generation value.' });
            return;
        }

        try {
            setGenerationSaving(true);
            await updateDefaultGeneration(trimmed);
            setGenerationStatus({ type: 'success', message: 'Value saved successfully.' });
        } catch {
            setGenerationStatus({ type: 'error', message: 'Failed to save value.' });
        } finally {
            setGenerationSaving(false);
        }
    }, [generationValue]);

    const retentionProps = {
        value: retentionDays,
        onChange: setRetentionDays,
        onGet: () => fetchRetention(true),
        onSet: handleSaveRetention,
        isFetching: retentionLoading,
        isSaving: retentionSaving,
        status: retentionStatus,
    };

    const generationProps = {
        value: generationValue,
        onChange: setGenerationValue,
        onGet: () => fetchGeneration(true),
        onSet: handleSaveGeneration,
        isFetching: generationLoading,
        isSaving: generationSaving,
        status: generationStatus,
    };

    return {
        retentionProps,
        generationProps,
    };
}

export function useBodyScrollLock(locked) {
    useEffect(() => {
        const original = document.body.style.overflow;
        if (locked) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = original || '';
        }

        return () => {
            document.body.style.overflow = original || '';
        };
    }, [locked]);
}
