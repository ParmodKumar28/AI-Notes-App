import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  listNotes,
  createNote as createNoteApi,
  updateNote as updateNoteApi,
  deleteNote as deleteNoteApi,
  summarizeNote as summarizeNoteApi,
} from "../services/notes";

export default function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listNotes();
      setNotes(data);
    } catch (e) {
      const errorMsg =
        e?.response?.data?.error || e?.message || "Failed to load notes";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = useCallback(async ({ blob, title }) => {
    try {
      const note = await createNoteApi({ blob, title });
      setNotes((prev) => [note, ...prev]);
      toast.success("Note created successfully!");
      return note;
    } catch (e) {
      const errorMsg =
        e?.response?.data?.error || e?.message || "Failed to create note";
      toast.error(errorMsg);
      throw e;
    }
  }, []);

  const updateNote = useCallback(async (id, payload) => {
    try {
      const updated = await updateNoteApi(id, payload);
      setNotes((prev) =>
        prev.map((n) => (n._id === updated._id ? updated : n))
      );
      toast.success("Note updated successfully!");
      return updated;
    } catch (e) {
      const errorMsg =
        e?.response?.data?.error || e?.message || "Failed to update note";
      toast.error(errorMsg);
      throw e;
    }
  }, []);

  const deleteNote = useCallback(async (id) => {
    try {
      await deleteNoteApi(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success("Note deleted successfully!");
    } catch (e) {
      const errorMsg =
        e?.response?.data?.error || e?.message || "Failed to delete note";
      toast.error(errorMsg);
      throw e;
    }
  }, []);

  const summarize = useCallback(async (id) => {
    try {
      const updated = await summarizeNoteApi(id);
      setNotes((prev) =>
        prev.map((n) => (n._id === updated._id ? updated : n))
      );
      toast.success("Summary generated successfully!");
      return updated;
    } catch (e) {
      const errorMsg =
        e?.response?.data?.error || e?.message || "Failed to generate summary";
      toast.error(errorMsg);
      throw e;
    }
  }, []);

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    summarize,
  };
}
