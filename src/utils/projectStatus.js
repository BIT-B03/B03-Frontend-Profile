const PROGRESS_KEYWORDS = ['on_progress', 'in_progress', 'progress', 'ongoing', 'running']
const COMPLETE_KEYWORDS = ['complete', 'completed', 'done', 'finish']

const createMeta = ({ label, tone, badgeClass }) => ({
  label,
  tone,
  badgeClass,
  isProgress: tone === 'progress'
})

function extractStatusString(status) {
  if (!status && status !== 0) return ''
  if (typeof status === 'string') return status
  if (typeof status === 'object') {
    // common variations returned by different APIs
    const candidates = ['status', 'state', 'project_status', 'value', 'name']
    for (const k of candidates) {
      if (status[k] && typeof status[k] === 'string') return status[k]
    }
    // some enums/objects implement toString
    try {
      const s = String(status)
      if (s && s !== '[object Object]') return s
    } catch (e) {
      // ignore
    }
  }
  return ''
}

/**
 * Normalize project status labels coming from the backend so UI pieces stay consistent.
 */
export const getProjectStatusMeta = (status) => {
  const raw = extractStatusString(status)
  const normalized = typeof raw === 'string' ? raw.trim().toLowerCase() : ''

  if (normalized && PROGRESS_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return createMeta({ label: 'In Progress', tone: 'progress', badgeClass: 'bg-red-500 text-pure-white' })
  }

  if (normalized && COMPLETE_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return createMeta({ label: 'Complete', tone: 'complete', badgeClass: 'bg-green-500 text-pure-white' })
  }

  return createMeta({ label: raw || 'Unknown', tone: 'unknown', badgeClass: 'bg-gray-500 text-pure-white' })
}

export const getProjectStatusLabel = (status) => getProjectStatusMeta(status).label
