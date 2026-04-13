import { useCallback, useState } from 'react';
import { updateAdminMember } from '../api/api';

// Hook to handle updating member's role/position/generation for the Member Settings page
export function useMemberSettingsUpdate({ onSuccess } = {}) {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const saveMemberChanges = useCallback(
        async ({ member, formState }) => {
            if (!member?.hashed_id) return;

            const payload = {};

            if (formState.role && formState.role !== member.role && formState.role !== member.division) {
                payload.new_role = formState.role;
            }

            if (formState.position && formState.position !== member.position) {
                payload.position = formState.position;
            }

            if (
                formState.generation !== '' &&
                formState.generation !== null &&
                formState.generation !== undefined
            ) {
                const genNumber = Number(formState.generation);
                if (!Number.isNaN(genNumber) && genNumber !== member.generation) {
                    payload.generation = genNumber;
                }
            }

            // If nothing changed, just call success callback and exit
            if (Object.keys(payload).length === 0) {
                if (onSuccess) {
                    onSuccess({ member, payload: null, result: null });
                }
                return;
            }

            setIsSaving(true);
            setError(null);

            try {
                const result = await updateAdminMember(member.hashed_id, payload);
                if (onSuccess) {
                    onSuccess({ member, payload, result });
                }
            } catch (err) {
                console.error('Failed to update member settings', err);
                setError('Failed to save changes. Please try again.');
                throw err;
            } finally {
                setIsSaving(false);
            }
        },
        [onSuccess]
    );

    return {
        isSaving,
        error,
        saveMemberChanges,
    };
}
