import React from 'react';
import { useParams } from 'react-router-dom';
import HeaderTooltip from '../components/createproject/HeaderTooltip';
import ContentDeskripsi from '../components/createproject/ContentDeskripsi';
import useEditProjectDescription from '../hooks/useEditProjectDescription';

export default function EditProjectDescription() {
    const { projectHashedId } = useParams();
    const {
        loading,
        saving,
        error,
        title,
        editor,
        toolbarItems,
        handleSave,
        handleBack,
    } = useEditProjectDescription({ projectHashedId });

    return (
        <div className="min-h-screen bg-brand-vignette">
            <main className="px-4 sm:px-8 lg:px-12 xl:px-16 py-8 overflow-visible">
                {loading ? (
                    <div className="text-muted-gray text-sm">Memuat data proyek...</div>
                ) : (
                    <div className="space-y-6">
                        <HeaderTooltip
                            title={title}
                            saving={saving}
                            editorReady={!!editor}
                            onBack={handleBack}
                            onSave={handleSave}
                            toolbarItems={toolbarItems}
                        />

                        <ContentDeskripsi editor={editor} />

                        {error && (
                            <div className="mx-auto max-w-5xl rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                {error}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
