import React from 'react';

export default function NoteToolbar({ note, busy, onEdit, onDelete, onSummarize }) {
    return (
        <div className="row">
            <button disabled={busy} onClick={onEdit}>Edit</button>
            <button disabled={busy} onClick={onDelete}>Delete</button>
            <button disabled={busy || note.hasSummary} onClick={onSummarize}>
                {note.hasSummary ? 'Summary Generated' : 'Generate Summary'}
            </button>
        </div>
    );
}


