import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import useRecorder from '../hooks/useRecorder';
import { useNotesContext } from '../contexts/NotesContext.jsx';
import toast from 'react-hot-toast';

export default function Recorder() {
    const { recording, supported, start, stop } = useRecorder();
    const { createNote } = useNotesContext();
    const [title, setTitle] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleRecord = async () => {
        if (!recording) {
            try {
                await start();
            } catch (e) {
                toast.error('Failed to start recording. Please check microphone permissions.');
            }
        } else {
            setUploading(true);
            try {
                const blob = await stop();
                await createNote({ blob, title });
                setTitle('');
            } catch (e) {
                // Error handling is done in the hook
            } finally {
                setUploading(false);
            }
        }
    };

    if (!supported) return <div className="card">Your browser does not support audio recording.</div>;

    return (
        <div className={`card ${recording ? 'recording-card' : ''}`}>
            <div className="row">
                <input placeholder="Optional title..." disabled={recording} value={title} onChange={(e) => setTitle(e.target.value)} />
                <button onClick={handleRecord} style={{ background: recording ? '#ef4444' : undefined }}>
                    {recording ? 'Stop & Save' : 'Start Recording'}
                </button>
            </div>
            {recording ? (
                <div className="recording-row">
                    <span className="pulse-dot" />
                    <div className="waveform" aria-hidden>
                        <span className="wave-bar" />
                        <span className="wave-bar" />
                        <span className="wave-bar" />
                        <span className="wave-bar" />
                        <span className="wave-bar" />
                    </div>
                    <small className="mono">Recording...</small>
                </div>
            ) : uploading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <ClipLoader size={16} color="#3b82f6" />
                    <small className="mono">Uploading & transcribing...</small>
                </div>
            ) : null}
            <small className="mono">Recording format: webm • Transcription runs on server</small>
        </div>
    );
}



