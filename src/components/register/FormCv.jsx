import React from 'react';
import useCvUpload from '../../hooks/useCvUpload';

const FormCv = ({ value, onChange, onError }) => {
  const {
    cvFile,
    dragActive,
    fileInputRef,
    HandleFileChange,
    HandleDrop,
    HandleDragOver,
    HandleDragLeave,
    OpenFileDialog,
    RemoveFile,
  } = useCvUpload({ value, onChange, onError });

  return (
    <div>
      <label className="block text-sm text-muted-gray mb-2">CV File (PDF)</label>
      <div
        onDrop={HandleDrop}
        onDragOver={HandleDragOver}
        onDragLeave={HandleDragLeave}
        onClick={OpenFileDialog}
        className={`rounded-xl border-2 border-dashed transition-colors cursor-pointer px-3 py-4 sm:px-4 sm:py-6 mx-auto
          ${dragActive
            ? 'border-brand-24e1c9 bg-brand-fill/40'
            : (cvFile
                ? 'border-brand-24e1c9 bg-brand-fill/30'
                : 'border-brand-stroke/70 bg-brand-fill/30 hover:border-brand-24e1c9/80')
          }
        `}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && OpenFileDialog()}
      >
        <div className="flex sm:flex-row flex-col items-center justify-center gap-3 sm:gap-4 text-center sm:text-left">
          <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg border ${cvFile ? 'bg-brand-24e1c9/20 border-brand-24e1c9/50' : 'bg-filter-all-bg/40 border-brand-stroke/50'}`}>
            {/* PDF icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`h-6 w-6 ${cvFile ? 'text-brand-24e1c9' : 'text-pure-white/90'}`}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" opacity=".2"/>
              <path d="M14 2v6h6"/>
              <path d="M16 13h-3v6"/>
              <path d="M9 19v-6h2a2 2 0 0 1 0 4H9"/>
              <path d="M20 19h-3v-6h3"/>
            </svg>
          </div>
          <div className="flex-1 w-full">
            <p className="text-pure-white font-medium text-sm sm:text-base">Drop PDF here or <span className="text-brand-24e1c9">browse</span></p>
            <p className="text-muted-gray text-xs sm:text-sm">Only .pdf files are allowed</p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); OpenFileDialog(); }}
            className="btn-flash rounded-lg bg-brand-getstarted px-4 py-2 text-sm text-pure-white shadow mt-3 sm:mt-0 self-center sm:self-auto"
          >
            Choose PDF
          </button>
        </div>

        {cvFile && (
          <div className="mt-4 flex sm:flex-row flex-col items-center sm:items-center justify-between rounded-lg border border-brand-24e1c9/60 bg-brand-fill/30 px-4 py-3 gap-2 text-center sm:text-left">
            <div className="min-w-0 w-full sm:w-auto">
              <p className="text-pure-white text-sm font-medium break-words sm:truncate">{cvFile.name}</p>
              <p className="text-muted-gray text-xs">{(cvFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); RemoveFile(); }}
              className="text-sm text-muted-gray hover:text-pure-white self-center sm:self-auto"
              aria-label="Remove file"
            >
              Remove
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={HandleFileChange}
        />
      </div>
    </div>
  );
};

export default FormCv;
