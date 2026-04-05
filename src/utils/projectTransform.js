import { getProjectThumbnailImageUrl } from '../api/api';

export const normalizeStatus = (raw = '') => {
  const s = raw.toLowerCase();
  if (s === 'on_progress' || s === 'progress') {
    return { label: 'On Progress', filterKey: 'progress' };
  }
  if (s === 'completed' || s === 'complete') {
    return { label: 'Complete', filterKey: 'complete' };
  }
  return { label: raw, filterKey: 'all' };
};

export const normalizeProject = (project, idx) => {
  const { label, filterKey } = normalizeStatus(project.status);
  return {
    id: project.hashed_id || idx,
    id_hash: project.hashed_id || '',
    title: project.title || 'Untitled',
    description: project.short_description || project.description || '',
    status: label,
    _filterKey: filterKey,
    thumbnail_url: project.thumbnail || project.thumbnail_url || null,
    _thumbnailUrl: getProjectThumbnailImageUrl(project.thumbnail || project.thumbnail_url),
    creator: project.creator || null,
    contributors: Array.isArray(project.contributors) ? project.contributors : [],
  };
};
