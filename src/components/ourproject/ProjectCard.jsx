import React from 'react'
import { getAvatarImageUrl } from '../../api/api'

export default function ProjectCard({ project, onViewDetail, maxDescriptionWords = 50 }) {
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
  const getStatusStyles = (status) => {
    if (status === 'In Progress') {
      return 'bg-red-500'
    }
    return 'bg-green-500'
  }

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
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition group h-full flex flex-col">
      {/* Project Image */}
      <div className="relative overflow-hidden h-40 bg-gradient-to-br from-gray-800 to-gray-900">
        {project.thumbnail_url ? (
          <img
            src={`${project.apiBase || '/api/projectPublic'}/thumbnails/${project.thumbnail_url}`}
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
          style={{
            display: project.thumbnail_url ? 'none' : 'flex'
          }}
        >
          <svg className="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
          </svg>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusStyles(project.status)}`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-base font-bold mb-2 line-clamp-1 text-white">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-xs mb-3 line-clamp-1">
          {truncateDescription(project.description)}
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 mb-3"></div>

        {/* Bottom Section: Team Members + Button (Horizontal Layout) */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: Avatar Stack + Member Count */}
          <div className="flex items-center gap-2">
            {/* Avatar Stack */}
            <div className="flex -space-x-2">
              {avatarSource.length > 0 ? (
                avatarSource.slice(0, maxAvatars).map((member, idx) => (
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
                ))
              ) : null}

              {avatarSource.length > maxAvatars ? (
                <div className="w-7 h-7 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-gray-300 text-xs font-bold">
                  +{avatarSource.length - maxAvatars}
                </div>
              ) : null}
            </div>

            {/* Member Count Text */}
            <span className="text-gray-400 text-xs font-medium whitespace-nowrap">
              {contributors.length > 0 ? contributors.length : (project.team_members || membersList.length || 0)} Members
            </span>
          </div>

          {/* Right: View Detail Button */}
          <button
            onClick={() => onViewDetail(project.id_hash)}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition duration-200 whitespace-nowrap"
          >
            View Detail
          </button>
        </div>
      </div>
    </div>
  )
}
