import React, { useState } from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';
import BlurFrame, { CloseButton } from '../common/BlurFrame';
import { Card, EditTrigger, Field, SectionActions, SectionHead, inputCls } from './ProfileUI';

const SOCIAL_BRAND_COLORS = {
  github: '#e6edf3',
  linkedin: '#0A66C2',
  instagram: '#E1306C',
  facebook: '#1877F2',
  youtube: '#FF0000',
};

// Slightly brighter shade used for hover label text
const SOCIAL_HOVER_COLORS = {
  github: '#e6edf3',
  linkedin: '#4D9FFF',
  instagram: '#FF6FA8',
  facebook: '#5B9EFF',
  youtube: '#FF5C5C',
};

const SOCIAL_ICONS = {
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  facebook: FaFacebook,
  youtube: FaYoutube,
};

const SocialItem = ({ platform, url, label, brandColor, hoverColor }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = SOCIAL_ICONS[platform];

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl transition-all duration-200"
      style={{
        background: hovered ? `${brandColor}14` : 'rgba(255,255,255,0.055)',
        border: `1px solid ${hovered ? `${brandColor}50` : 'rgba(255,255,255,0.12)'}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ color: brandColor }} className="flex-shrink-0 transition-transform duration-200" >
        {Icon ? <Icon size={16} /> : null}
      </span>
      <span
        className="flex-1 min-w-0 text-sm lg:text-[13px] font-medium truncate transition-colors duration-200"
        style={{ color: hovered ? hoverColor : 'rgba(255,255,255,0.85)' }}
      >
        {label}
      </span>
      <svg
        className="w-3.5 h-3.5 flex-shrink-0 transition-colors duration-200"
        style={{ color: hovered ? `${brandColor}cc` : 'rgba(255,255,255,0.35)' }}
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
};

const ProfileSocialCard = ({
  socials,
  socialLinks,
  isEditing,
  isOtherEditing,
  setEditSection,
  updateSocial,
  save,
  cancelSection,
  savingSection,
  SOCIAL_META,
}) => (
  <>
  <Card className="h-fit self-start">
    <SectionHead
      title="Social Links"
      action={
        !isEditing('social') && (
          <EditTrigger onClick={() => setEditSection('social')}
            disabled={isOtherEditing('social')} label="Edit social links" />
        )
      }
    />

    {socials.length === 0 ? (
      <p className="text-sm italic text-pure-white/50">No social links yet.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {socials.map(([platform, url]) => {
          const meta = SOCIAL_META[platform] || { label: platform };
          const brandColor = SOCIAL_BRAND_COLORS[platform] || '#c7c7c7';
          return (
            <SocialItem
              key={platform}
              platform={platform}
              url={url}
              label={meta.label}
              brandColor={brandColor}
              hoverColor={SOCIAL_HOVER_COLORS[platform] || brandColor}
            />
          );
        })}
      </div>
    )}
  </Card>

  <BlurFrame isOpen={isEditing('social')} onClose={() => cancelSection('social')}>
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-pure-white font-semibold text-lg">Edit Social Links</p>
          <p className="text-xs text-muted-gray">Update your social URLs.</p>
        </div>
        <CloseButton onClick={() => cancelSection('social')} />
      </div>

      <div className="space-y-3">
        {socialLinks.length === 0 && (
          <p className="text-sm italic text-pure-white/50">No social links yet.</p>
        )}
        {socialLinks.map((item) => (
          <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3 items-end">
            <Field label="Platform">
              <input value={item.platform} disabled
                className={`${inputCls} opacity-70 cursor-not-allowed`} />
            </Field>
            <Field label="URL">
              <input type="url" value={item.url}
                onChange={(e) => updateSocial(item.id, 'url', e.target.value)}
                className={inputCls} placeholder="https://..." />
            </Field>
          </div>
        ))}
      </div>

      <SectionActions saving={savingSection === 'social'} saveLabel="Save Social Links"
        onSave={() => save('social')} onCancel={() => cancelSection('social')} />
    </div>
  </BlurFrame>
  </>
);

export default ProfileSocialCard;
