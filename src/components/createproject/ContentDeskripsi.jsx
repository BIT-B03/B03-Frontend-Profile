import React from 'react';
import { EditorContent } from '@tiptap/react';

export default function ContentDeskripsi({ editor }) {
    return (
        <div className="mx-auto max-w-5xl bg-gray-900/50 border border-gray-800 rounded-3xl p-6">
            <div className="tiptap-content rounded-2xl border border-gray-700 bg-gray-900/60">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
