import React from 'react';
import BlurFrame, { CloseButton } from '../common/BlurFrame';
import { Card, EditTrigger, SectionActions, SectionHead, inputCls } from './ProfileUI';

const ProfileAboutCard = ({
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
    <Card>
      <SectionHead
        title="Description"
        action={
          !isEditing('about') && (
            <EditTrigger onClick={() => setEditSection('about')}
              disabled={isOtherEditing('about')} label="Edit about" />
          )
        }
      />
      <p className="text-sm text-pure-white leading-relaxed whitespace-pre-line">
        {profile?.description ||
          <span className="italic text-pure-white/50">No description yet.</span>}
      </p>
    </Card>

    <BlurFrame isOpen={isEditing('about')} onClose={() => cancelSection('about')} panelClassName="max-w-6xl">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-pure-white font-semibold text-lg">Edit Description</p>
            <p className="text-xs text-muted-gray">Tell others about yourself.</p>
          </div>
          <CloseButton onClick={() => cancelSection('about')} />
        </div>

        <div className="space-y-4">
          <textarea value={form.description} onChange={updateField('description')} rows={8}
            className={`${inputCls} resize-none min-h-[320px]`}
            placeholder="Write something about yourself…" />
          <SectionActions saving={savingSection === 'about'} saveLabel="Save About"
            onSave={() => save('about')} onCancel={() => cancelSection('about')} />
        </div>
      </div>
    </BlurFrame>
  </>
);

export default ProfileAboutCard;
