import { Toaster } from 'react-hot-toast';
import Recorder from './components/Recorder.jsx';
import NoteList from './components/NoteList.jsx';
import { NotesProvider, useNotesContext } from './contexts/NotesContext.jsx';

function AppContent() {
    const { notes, loading, error } = useNotesContext();

    return (
        <div className="container">
            <h2>Voice Notes with AI Summaries</h2>
            <p className="card">Record a note, it will be auto-transcribed. Edit transcript as needed. Generate a summary when ready.</p>
            <Recorder />
            {loading ? <div className="card">Loading notes...</div> : null}
            {error ? <div className="card" style={{ borderColor: '#ef4444', color: '#fecaca' }}>{error}</div> : null}
            <NoteList notes={Array.isArray(notes) ? notes : []} />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#131a2e',
                        color: '#e9eef6',
                        border: '1px solid #223056',
                        borderRadius: '12px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#e9eef6',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#e9eef6',
                        },
                    },
                }}
            />
        </div>
    );
}

export default function App() {
    return (
        <NotesProvider>
            <AppContent />
        </NotesProvider>
    );
}



