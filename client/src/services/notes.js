import api from "../api";

export const listNotes = async () => {
  try {
    const res = await api.get("/notes");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    throw error;
  }
};

export const createNote = async ({ blob, title }) => {
  try {
    const form = new FormData();
    form.append("audio", blob, `note-${Date.now()}.webm`);
    if (title && title.trim()) form.append("title", title.trim());
    const res = await api.post("/notes", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to create note:", error);
    throw error;
  }
};

export const updateNote = async (id, payload) => {
  try {
    const res = await api.patch(`/notes/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error("Failed to update note:", error);
    throw error;
  }
};

export const deleteNote = async (id) => {
  try {
    await api.delete(`/notes/${id}`);
    return true;
  } catch (error) {
    console.error("Failed to delete note:", error);
    throw error;
  }
};

export const summarizeNote = async (id) => {
  try {
    const res = await api.post(`/notes/${id}/summarize`);
    return res.data;
  } catch (error) {
    console.error("Failed to summarize note:", error);
    throw error;
  }
};
