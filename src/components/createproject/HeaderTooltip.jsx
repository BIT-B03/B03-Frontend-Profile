import React from 'react';

export default function HeaderTooltip({
    title,
    saving,
    editorReady,
    onBack,
    onSave,
    toolbarItems,
}) {
    return (
        <div className="sticky top-0 z-30 pt-4">
            <div className="bg-gray-900/90 border border-gray-800 rounded-2xl px-5 py-4 sm:px-6 sm:py-5 shadow-lg backdrop-blur">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 pr-2">
                            <p className="text-xs text-gray-400">Project</p>
                            <h2 className="text-xl font-semibold text-white break-words">{title || 'Untitled Project'}</h2>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <button
                                type="button"
                                onClick={onBack}
                                className="h-10 px-4 inline-flex items-center justify-center rounded-xl border border-gray-700 text-white text-sm transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-24e1c9/70"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={onSave}
                                disabled={saving || !editorReady}
                                className="h-10 px-4 inline-flex items-center justify-center rounded-xl bg-brand-24e1c9 hover:bg-brand-24e1c9/80 text-gray-900 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-24e1c9/70"
                            >
                                {saving ? 'Saving...' : 'Save Description'}
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto scrollbar-hidden -mx-1 px-1">
                        <div className="flex items-center gap-2 min-w-max">
                            {toolbarItems.map((item) => (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={item.action}
                                    disabled={!editorReady}
                                    aria-label={item.label}
                                    aria-pressed={item.active}
                                    title={item.label}
                                    className={`h-9 min-w-9 px-3 inline-flex items-center justify-center rounded-lg text-xs font-medium border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-24e1c9/70 ${
                                        item.active
                                            ? 'bg-brand-24e1c9 text-gray-900 border-brand-24e1c9'
                                            : 'bg-gray-800/60 text-gray-200 border-gray-700 hover:bg-gray-700'
                                    } ${!editorReady ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {item.icon ? (
                                        <span className="text-base leading-none">
                                            <item.icon />
                                        </span>
                                    ) : (
                                        item.label
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
