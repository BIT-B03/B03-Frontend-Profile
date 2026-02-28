import React from 'react'
import { getAvatarImageUrl } from '../../api/api'
import { getProjectStatusMeta } from '../../utils/projectStatus'

export default function ProjectCardCreate({ project, onViewDetail, onEdit, onDelete, maxDescriptionWords = 50 }) {
  const membersList = []
  if (project.creator) membersList.push({ ...project.creator, isCreator: true })
  if (project.contributors && project.contributors.length > 0) {
    const contribs = project.contributors.filter((c) => {
      if (!project.creator) return true
      const contribId = c.id || c.hashed_id || c.hashedId || null
      const creatorId = project.creator.id || project.creator.hashed_id || project.creator.hashedId || null
      return contribId !== creatorId
    })
    membersList.push(...contribs)
  }

  const statusMeta = getProjectStatusMeta(project.status)
  const maxAvatars = 2
  const contributors = project.contributors || []
  const avatarSource = contributors.length > 0 ? contributors : membersList

  const truncateDescription = (raw) => {
    const plain = (raw || '').replace(/<\/?[^>]+(>|$)/g, '').trim()
    if (!plain) return ''
    const sentences = plain.match(/[^.!?]+[.!?]*/g) || [plain]
    let result = ''
    let total = 0
    for (const s of sentences) {
      const w = s.trim().split(/\s+/).filter(Boolean).length
      if (total + w <= maxDescriptionWords) {
        result += (result ? ' ' : '') + s.trim()
        total += w
      } else {
        if (total === 0) {
          const words = s.trim().split(/\s+/).slice(0, maxDescriptionWords).join(' ')
          return words + '...'
        }
        break
      }
    }
    return total < plain.split(/\s+/).filter(Boolean).length ? result.trim() + '...' : result.trim()
  }

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition group h-full flex flex-col w-full max-w-sm">
      {/* ── Thumbnail ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden h-40 bg-gradient-to-br from-gray-800 to-gray-900">
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              const next = e.currentTarget.nextElementSibling
              if (next) next.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/30 to-purple-900/30"
          style={{ display: project.thumbnail_url ? 'none' : 'flex' }}
        >
          <svg className="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
          </svg>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusMeta.badgeClass}`}>
            {statusMeta.label}
          </span>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-bold mb-2 line-clamp-1 text-white">
          {project.title}
        </h3>

        <p className="text-gray-400 text-xs mb-3 line-clamp-1">
          {truncateDescription(project.description)}
        </p>

        <div className="w-full h-px bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 mb-3" />

        {/* ── Bottom: avatars + buttons ──────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3">
          {/* Avatar stack + member count */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {avatarSource.slice(0, maxAvatars).map((member, idx) => (
                <div
                  key={idx}
                  className="relative w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold hover:z-10 transition"
                  title={member.name || (member.isCreator ? 'Creator' : `Member ${idx + 1}`)}
                >
                  {member.avatar_url ? (
                    <img
                      src={getAvatarImageUrl(member.avatar_url)}
                      alt={member.name || 'avatar'}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  ) : (
                    <span>{(member.name || member.username || member.email)?.[0]?.toUpperCase() || '?'}</span>
                  )}
                </div>
              ))}

              {avatarSource.length > maxAvatars ? (
                <div className="w-7 h-7 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-gray-300 text-xs font-bold">
                  +{avatarSource.length - maxAvatars}
                </div>
              ) : null}
            </div>

            <span className="text-gray-400 text-xs font-medium whitespace-nowrap">
              {contributors.length > 0 ? contributors.length : (project.team_members || membersList.length || 0)} Members
            </span>
          </div>

          {/* Detail + Edit + Delete buttons */}
          <div className="flex items-center gap-1.5">
            {/* Detail */}
            <button
              onClick={() => onViewDetail?.(project.id_hash)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border bg-filter-sage-bg border-filter-sage-border hover:bg-[rgba(34,165,167,0.65)] text-white transition duration-200"
              title="View detail"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>

            {/* Edit */}
            <button
              onClick={() => onEdit?.(project.id_hash)}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition duration-200"
              title="Edit project"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            {/* Delete */}
            <button
              onClick={() => onDelete?.(project.id_hash)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border bg-filter-red-bg border-filter-red-border hover:bg-[rgba(222,0,0,0.6)] text-white transition duration-200"
              title="Delete project"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-10 0h14"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
