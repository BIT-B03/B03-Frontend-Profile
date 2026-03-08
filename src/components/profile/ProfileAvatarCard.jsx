import React from 'react';
const ProfileAvatarCard = ({
  profile,
  displayAvatar,
  openFilePicker,
  editSection,
  save,
  cancelSection,
  savingSection,
}) => (
  <div className="flex flex-col items-center gap-5 py-2">
      <div className="relative">
        <button
          type="button"
          onClick={openFilePicker}
          aria-label="Change avatar"
          className="block w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] lg:w-[340px] lg:h-[340px] rounded-full overflow-hidden cursor-pointer flex-shrink-0
            ring-[2.5px] ring-brand-24e1c9/25 transition-all duration-200
            hover:ring-brand-24e1c9/55 hover:shadow-[0_0_36px_rgba(36,225,201,0.25)]"
          style={{ boxShadow: '0 0 32px rgba(36,225,201,0.18)' }}
        >
          {displayAvatar ? (
            <img src={displayAvatar} alt={profile?.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1F4C74 0%, #0b0f19 100%)' }}>
              <span className="text-3xl font-bold select-none" style={{ color: 'rgba(36,225,201,0.75)' }}>
                {profile?.name?.[0]?.toUpperCase() || '?'}
              </span>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={openFilePicker}
          aria-label="Upload photo"
          className="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center
            border-2 border-brand-24e1c9/50 text-brand-24e1c9
            hover:border-brand-24e1c9 hover:bg-brand-24e1c9/10 transition-all duration-150 shadow-lg"
          style={{ background: '#0d1320' }}
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {editSection === 'avatar-pending' && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-brand-24e1c9/90">New photo ready.</span>
          <button type="button" onClick={() => save('avatar')} disabled={savingSection === 'avatar'}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-brand-getstarted text-pure-white hover:opacity-90 transition disabled:opacity-50">
            {savingSection === 'avatar' ? 'Saving…' : 'Save Photo'}
          </button>
          <button type="button" onClick={() => cancelSection('avatar')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/20 text-pure-white/70 hover:text-pure-white transition">
            Cancel
          </button>
        </div>
      )}
  </div>
);

export default ProfileAvatarCard;
