import React from 'react';
import BlurFrame, { CloseButton } from '../common/BlurFrame';
import { Card, EditTrigger, Field, SectionActions, SectionHead, inputCls } from './ProfileUI';

const ProfileAccountCard = ({
  profile,
  isEditing,
  isOtherEditing,
  setEditSection,
  form,
  updateField,
  save,
  cancelSection,
  savingSection,
}) => (
  <>
    <Card className="h-fit">
    <SectionHead
      title="Account Info"
      action={
        !isEditing('account') && (
          <EditTrigger onClick={() => setEditSection('account')}
            disabled={isOtherEditing('account')} label="Edit account info" />
        )
      }
    />
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-pure-white/60 mb-1.5">Email</p>
        <p className="text-sm text-pure-white/90 break-all">{profile?.email || '—'}</p>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-pure-white/60 mb-1.5">Username</p>
        <p className="text-sm text-pure-white/90">@{profile?.username || '—'}</p>
      </div>
    </div>
  </Card>

  <BlurFrame isOpen={isEditing('account')} onClose={() => cancelSection('account')}>
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-pure-white font-semibold text-lg">Edit Account Info</p>
          <p className="text-xs text-muted-gray">Update your email and username.</p>
        </div>
        <CloseButton onClick={() => cancelSection('account')} />
      </div>

      <div className="space-y-4">
        <Field label="Email">
          <input type="email" value={form.email} onChange={updateField('email')}
            className={inputCls} placeholder="your@email.com" />
        </Field>
        <Field label="Username">
          <input type="text" value={form.username} onChange={updateField('username')}
            className={inputCls} placeholder="@username" />
        </Field>
        <SectionActions saving={savingSection === 'account'} saveLabel="Save"
          onSave={() => save('account')} onCancel={() => cancelSection('account')} />
      </div>
    </div>
  </BlurFrame>
  </>
);

export default ProfileAccountCard;
