import React, { useState } from 'react';

export default function NoteSummary({ note }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (!note.hasSummary || !note.summary) return null;

    return (
        <div className="summary-container">
            <div className="summary-header" onClick={() => setIsCollapsed(!isCollapsed)}>
                <strong>Summary:</strong>
                <button className="collapse-btn" type="button">
                    {isCollapsed ? '▼' : '▲'}
                </button>
            </div>
            {!isCollapsed && (
                <div className="summary-content">
                    <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{note.summary}</p>
                </div>
            )}
        </div>
    );
}


