import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import NoteEditor from './NoteEditor.jsx';
import NoteSummary from './NoteSummary.jsx';
import NoteToolbar from './NoteToolbar.jsx';
import { useNotesContext } from '../contexts/NotesContext.jsx';

export default function NoteItem({ note }) {
    const { updateNote, deleteNote, summarize } = useNotesContext();
    const [editing, setEditing] = useState(false);
    const [busy, setBusy] = useState(false);
    const audioSrc = (import.meta.env.VITE_API_URL || '') + note.audioUrl;

    const save = async ({ title, transcript }) => {
        setBusy(true);
        try {
            await updateNote(note._id, { title, transcript });
            setEditing(false);
        } catch (e) {
            // Error handling is done in the hook
        } finally {
            setBusy(false);
        }
    };

    const remove = async () => {
        if (!confirm('Delete this note?')) return;
        setBusy(true);
        try {
            await deleteNote(note._id);
        } catch (e) {
            // Error handling is done in the hook
        } finally {
            setBusy(false);
        }
    };

    const handleSummarize = async () => {
        setBusy(true);
        try {
            await summarize(note._id);
        } catch (e) {
            // Error handling is done in the hook
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
                <div className="note-title">{note.title}</div>
                <small className="mono">{new Date(note.updatedAt).toLocaleString()}</small>
            </div>
            <audio src={audioSrc} controls style={{ width: '100%', margin: '8px 0' }} />

            {busy && !editing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <ClipLoader size={16} color="#3b82f6" />
                    <small className="mono">Processing...</small>
                </div>
            ) : editing ? (
                <NoteEditor note={note} busy={busy} onSave={save} onCancel={() => setEditing(false)} />
            ) : (
                <>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{note.transcript}</p>
                    <NoteSummary note={note} />
                    <NoteToolbar note={note} busy={busy} onEdit={() => setEditing(true)} onDelete={remove} onSummarize={handleSummarize} />
                </>
            )}
        </div>
    );
}



