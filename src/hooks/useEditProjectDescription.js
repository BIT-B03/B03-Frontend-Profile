import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import DOMPurify from 'dompurify';
import { getToolbarItems } from '../utils/icon';
import { editProject, getProjectDetail, SetAuthToken } from '../api/api';

const normalizeStatusValue = (raw = '') => {
    const s = raw.toLowerCase();
    if (s === 'on_progress' || s === 'progress' || s === 'on progress') return 'on_progress';
    if (s === 'completed' || s === 'complete') return 'completed';
    return 'on_progress';
};

const extractContributorIds = (project) => {
    const contribs = Array.isArray(project?.contributors) ? project.contributors : [];
    return contribs
        .map((c) =>
            c.user?.hashed_id ||
            c.user?.id_hash ||
            c.hashed_id ||
            c.id_hash ||
            null
        )
        .filter(Boolean);
};

export default function useEditProjectDescription({ projectHashedId }) {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [title, setTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [status, setStatus] = useState('on_progress');
    const [contributors, setContributors] = useState([]);
    const [descriptionHtml, setDescriptionHtml] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'min-h-[320px] w-full p-4 text-sm text-white focus:outline-none',
            },
        },
        onUpdate: ({ editor: ed }) => {
            setDescriptionHtml(ed.getHTML());
        },
    });

    const fetchProject = useCallback(async () => {
        if (!projectHashedId) return;
        try {
            setLoading(true);
            setError(null);
            const res = await getProjectDetail(projectHashedId);
            let project = res;
            if (res && res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
                project = res.data;
            }

            setTitle(project?.title || '');
            setShortDescription(project?.short_description || '');
            setStatus(normalizeStatusValue(project?.status || ''));
            setContributors(extractContributorIds(project));

            const nextDescription = project?.description || '';
            setDescriptionHtml(nextDescription);
            if (editor && !editor.isDestroyed) {
                editor.commands.setContent(nextDescription || '', false);
            }
        } catch (err) {
            const statusCode = err?.response?.status;
            if (statusCode === 401) {
                navigate('/login', { replace: true });
                return;
            }
            setError('Gagal memuat data proyek');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [projectHashedId, navigate, editor]);

    useEffect(() => {
        const token = localStorage.getItem('auth_access_token');
        if (!token) { navigate('/login', { replace: true }); return; }
        SetAuthToken(token);
        fetchProject();
    }, [fetchProject, navigate]);

    const handleSave = useCallback(async () => {
        if (!projectHashedId) return;
        if (!editor) return;

        setSaving(true);
        setError(null);

        try {
            const sanitized = DOMPurify.sanitize(descriptionHtml || '', {
                USE_PROFILES: { html: true },
            });

            const fd = new FormData();
            fd.append('title', title.trim() || 'Untitled');
            fd.append('description', sanitized);
            fd.append('short_description', shortDescription || '');
            fd.append('status', status || 'on_progress');
            if (contributors.length > 0) {
                fd.append('contributors', JSON.stringify(contributors));
            }

            await editProject(projectHashedId, fd);
            navigate(`/create-project/${projectHashedId}`);
        } catch (err) {
            const msg = err?.response?.data?.message;
            setError(typeof msg === 'string' ? msg : 'Gagal menyimpan perubahan');
        } finally {
            setSaving(false);
        }
    }, [
        contributors,
        descriptionHtml,
        editor,
        navigate,
        projectHashedId,
        shortDescription,
        status,
        title,
    ]);

    const toolbarItems = useMemo(() => getToolbarItems(editor), [editor]);

    const handleBack = useCallback(() => {
        navigate('/create-project');
    }, [navigate]);

    return {
        loading,
        saving,
        error,
        title,
        editor,
        toolbarItems,
        handleSave,
        handleBack,
    };
}
