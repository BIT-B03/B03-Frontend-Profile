import React, { useEffect, useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import useSidebarCollapsed from '../hooks/useSidebarCollapsed';
import useProfilePage from '../hooks/useProfilePage';
import AvatarCropModal from '../components/profile/AvatarCropModal';
import ProfileSkeleton from '../components/profile/ProfileSkeleton';
import ProfileAvatarCard from '../components/profile/ProfileAvatarCard';
import ProfileHeaderCard from '../components/profile/ProfileHeaderCard';
import ProfileAboutCard from '../components/profile/ProfileAboutCard';
import ProfileAccountCard from '../components/profile/ProfileAccountCard';
import ProfileSocialCard from '../components/profile/ProfileSocialCard';
import ProfileStatsPanel from '../components/profile/ProfileStatsPanel';
import { Card, Toast } from '../components/profile/ProfileUI';

export default function Profile() {
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const {
    profile,
    loading,
    error,
    refetch,
    toast,
    setToast,
    editSection,
    setEditSection,
    savingSection,
    form,
    updateField,
    socialLinks,
    updateSocial,
    socials,
    displayAvatar,
    stats,
    statsLoading,
    fileInputRef,
    rawImage,
    cropOpen,
    setCropOpen,
    setRawImage,
    openFilePicker,
    onFileChange,
    onCropSave,
    save,
    cancelSection,
    isEditing,
    isOtherEditing,
    positionStyle,
    SOCIAL_META,
  } = useProfilePage();

  /* sidebar lock */
  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileSidebarOpen]);


  return (
    <div className="flex min-h-screen bg-brand-vignette overflow-x-hidden">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className={`flex-1 min-w-0 transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        <div className="p-6 sm:p-8">
            <Header
              title="Profile"
              onMobileMenuClick={() => setMobileSidebarOpen(true)}
              onDesktopMenuClick={() => setCollapsed((v) => !v)}
            />

            {/* Global toast */}
            <Toast
              type={toast.type}
              message={toast.text}
              onDismiss={() => setToast({ type: null, text: '' })}
            />

            {loading ? <ProfileSkeleton /> : error ? (
              <Card className="text-center py-12">
                <p className="text-stat-red/80 text-sm mb-4">{error}</p>
                <button type="button" onClick={() => refetch()}
                  className="px-5 py-2 rounded-xl bg-white/8 text-pure-white text-sm hover:bg-white/12 transition">
                  Retry
                </button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.7fr] gap-4 items-start">
                <div className="space-y-4">
                  <div className="flex justify-center lg:justify-start">
                    <ProfileAvatarCard
                      profile={profile}
                      displayAvatar={displayAvatar}
                      openFilePicker={openFilePicker}
                      editSection={editSection}
                      save={save}
                      cancelSection={cancelSection}
                      savingSection={savingSection}
                    />
                  </div>

                  <ProfileHeaderCard
                    profile={profile}
                    editSection={editSection}
                    isEditing={isEditing}
                    isOtherEditing={isOtherEditing}
                    setEditSection={setEditSection}
                    positionStyle={positionStyle}
                    form={form}
                    updateField={updateField}
                    save={save}
                    cancelSection={cancelSection}
                    savingSection={savingSection}
                  />
                </div>

                <div className="space-y-4 xl:space-y-0 xl:grid xl:grid-cols-[1fr_1.45fr] xl:gap-4 xl:items-start xl:auto-rows-auto">
                  <div className="xl:col-start-1 xl:row-start-1">
                    <ProfileAccountCard
                      profile={profile}
                      isEditing={isEditing}
                      isOtherEditing={isOtherEditing}
                      setEditSection={setEditSection}
                      form={form}
                      updateField={updateField}
                      save={save}
                      cancelSection={cancelSection}
                      savingSection={savingSection}
                    />
                  </div>

                  <div className="xl:col-span-2 xl:row-start-2">
                    <ProfileStatsPanel stats={stats} loading={statsLoading} />
                  </div>

                  <div className="xl:col-span-2 xl:row-start-3">
                    <ProfileAboutCard
                      profile={profile}
                      isEditing={isEditing}
                      isOtherEditing={isOtherEditing}
                      setEditSection={setEditSection}
                      form={form}
                      updateField={updateField}
                      save={save}
                      cancelSection={cancelSection}
                      savingSection={savingSection}
                    />
                  </div>

                  <div className="xl:col-start-2 xl:row-start-1">
                    <ProfileSocialCard
                      socials={socials}
                      socialLinks={socialLinks}
                      isEditing={isEditing}
                      isOtherEditing={isOtherEditing}
                      setEditSection={setEditSection}
                      updateSocial={updateSocial}
                      save={save}
                      cancelSection={cancelSection}
                      savingSection={savingSection}
                      SOCIAL_META={SOCIAL_META}
                    />
                  </div>
                </div>
              </div>
            )}
        </div>
      </main>

      <AvatarCropModal
        open={cropOpen}
        imageSrc={rawImage}
        onClose={() => { setCropOpen(false); setRawImage(null); }}
        onSave={onCropSave}
      />

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
    </div>
  );
}
