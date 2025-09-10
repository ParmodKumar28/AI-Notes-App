import React from 'react';
import NoteItem from './NoteItem.jsx';

export default function NoteList({ notes }) {
    const list = Array.isArray(notes) ? notes : [];
    if (list.length === 0) return <div className="card">No notes yet. Record your first one!</div>;
    return (
        <div>
            {list.map(n => (
                <NoteItem key={n._id} note={n} />
            ))}
        </div>
    );
}



