import React from 'react';

export default function NoteSummary({ note }) {
    if (!note.hasSummary || !note.summary) return null;
    return (
        <div style={{ background: '#0f162b', padding: 12, borderRadius: 8, border: '1px solid #223056' }}>
            <strong>Summary:</strong>
            <p style={{ whiteSpace: 'pre-wrap', marginTop: 6 }}>{note.summary}</p>
        </div>
    );
}


