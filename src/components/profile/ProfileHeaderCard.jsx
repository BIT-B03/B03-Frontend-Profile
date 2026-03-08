import React from 'react';
import BlurFrame, { CloseButton } from '../common/BlurFrame';
import { Card, EditTrigger, Field, SectionActions, SectionHead, inputCls } from './ProfileUI';

const ProfileHeaderCard = ({
  profile,
  editSection,
  isEditing,
  isOtherEditing,
  setEditSection,
  positionStyle,
  form,
  updateField,
  save,
  cancelSection,
  savingSection,
}) => (
  <>
  <Card>
    <SectionHead
      title="Basic Information"
      action={
        !isEditing('header') && editSection !== 'avatar-pending' && (
          <EditTrigger
            onClick={() => setEditSection('header')}
            disabled={isOtherEditing('header')}
            label="Edit profile header"
          />
        )
      }
    />

    <div className="flex flex-col gap-4">
      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-pure-white/60 mb-1.5">Fullname</p>
          <p className="text-sm text-pure-white/90">{profile?.name || '—'}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-pure-white/60 mb-1.5">Role</p>
          {profile?.position ? (
            <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase"
              style={positionStyle}>
              {profile.position}
            </span>
          ) : (
            <p className="text-sm text-pure-white/70">—</p>
          )}
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-pure-white/60 mb-1.5">Bio</p>
          <p className="text-sm text-pure-white/80 leading-relaxed">
            {profile?.bio || <span className="italic text-pure-white/50">No bio yet.</span>}
          </p>
        </div>
      </div>
    </div>
  </Card>

  <BlurFrame isOpen={isEditing('header')} onClose={() => cancelSection('header')}>
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-pure-white font-semibold text-lg">Edit Basic Information</p>
          <p className="text-xs text-muted-gray">Update your name and bio.</p>
        </div>
        <CloseButton onClick={() => cancelSection('header')} />
      </div>

      <div className="w-full max-w-sm space-y-4">
        <Field label="Fullname">
          <input type="text" value={form.name} onChange={updateField('name')}
            className={inputCls} placeholder="Your full name" />
        </Field>
        <Field label="Bio">
          <input type="text" value={form.bio} onChange={updateField('bio')}
            className={inputCls} placeholder="Short bio…" maxLength={120} />
        </Field>
        <div className="flex justify-center">
          <SectionActions saving={savingSection === 'header'} saveLabel="Save"
            onSave={() => save('header')}
            onCancel={() => cancelSection('header')} />
        </div>
      </div>
    </div>
  </BlurFrame>
  </>
);

export default ProfileHeaderCard;
