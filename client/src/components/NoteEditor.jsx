import React, { useState } from 'react';

export default function NoteEditor({ note, onCancel, onSave, busy }) {
    const [title, setTitle] = useState(note.title || '');
    const [transcript, setTranscript] = useState(note.transcript || '');

    return (
        <>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea rows="5" value={transcript} onChange={(e) => setTranscript(e.target.value)} />
            <div className="row">
                <button disabled={busy} onClick={() => onSave({ title, transcript })}>Save</button>
                <button disabled={busy} onClick={onCancel}>Cancel</button>
            </div>
        </>
    );
}


