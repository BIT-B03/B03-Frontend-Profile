import { useState, useEffect, useCallback } from 'react';
import { getPublicProjects } from '../api/api';
import { getProjectStatusMeta } from '../utils/projectStatus';

/**
 * Fetches all public projects and filters those where the given
 * userHashedId appears in the contributors list (by hashed_id or id).
 */
export default function useUserContributedProjects(userHashedId) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProjects = useCallback(async () => {
        if (!userHashedId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await getPublicProjects();
            const rawItems = (response && response.data) ? response.data : response;
            const items = Array.isArray(rawItems) ? rawItems : [];

            // Filter projects where user is a contributor
            const contributed = items.filter((p) => {
                const contributors = Array.isArray(p.contributors) ? p.contributors : [];
                return contributors.some((c) => {
                    const cId = c.hashed_id || c.hashedId || c.id || null;
                    return cId === userHashedId;
                });
            });

            // Normalize to a shape consistent with the ProjectCard component
            const mapped = contributed.map((p) => {
                const statusMeta = getProjectStatusMeta(p.status);
                return {
                    id: p.id,
                    id_hash: p.hashed_id || p.id_hash || '',
                    title: p.title || p.name || 'Untitled',
                    description: p.short_description || p.description || '',
                    status: statusMeta.label,
                    statusTone: statusMeta.tone,
                    thumbnail_url: p.thumbnail || p.thumbnail_url || '',
                    creator: p.creator || null,
                    contributors: Array.isArray(p.contributors) ? p.contributors : [],
                    team_members:
                        (Array.isArray(p.contributors) ? p.contributors.length : 0) +
                        (p.creator ? 1 : 0),
                    apiBase: '/api/projectPublic',
                };
            });

            setProjects(mapped);
        } catch (err) {
            console.error('Error fetching contributed projects:', err);
            setError('Failed to load projects');
        } finally {
            setLoading(false);
        }
    }, [userHashedId]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return { projects, loading, error };
}
