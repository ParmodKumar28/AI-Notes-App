import { Toaster } from 'react-hot-toast';
import Recorder from './components/Recorder.jsx';
import NoteList from './components/NoteList.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import { NotesProvider, useNotesContext } from './contexts/NotesContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';

function AppContent() {
    const { notes, loading, error } = useNotesContext();

    return (
        <div className="container">
            <ThemeToggle />
            <h2>Voice Notes with AI Summaries</h2>
            <p className="card">Record a note, it will be auto-transcribed. Edit transcript as needed. Generate a summary when ready.</p>
            <Recorder />
            {loading ? <div className="card">Loading notes...</div> : null}
            {error ? <div className="card" style={{ borderColor: 'var(--error-color)', color: 'var(--error-color)' }}>{error}</div> : null}
            <NoteList notes={Array.isArray(notes) ? notes : []} />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                    },
                    success: {
                        iconTheme: {
                            primary: 'var(--success-color)',
                            secondary: 'var(--text-primary)',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: 'var(--error-color)',
                            secondary: 'var(--text-primary)',
                        },
                    },
                }}
            />
        </div>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <NotesProvider>
                <AppContent />
            </NotesProvider>
        </ThemeProvider>
    );
}



