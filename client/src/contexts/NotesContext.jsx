import React, { createContext, useContext } from 'react';
import useNotes from '../hooks/useNotes';

const NotesContext = createContext();

export const useNotesContext = () => {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error('useNotesContext must be used within a NotesProvider');
    }
    return context;
};

export const NotesProvider = ({ children }) => {
    const notesData = useNotes();

    return (
        <NotesContext.Provider value={notesData}>
            {children}
        </NotesContext.Provider>
    );
};
