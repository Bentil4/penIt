const STORAGE_KEY = "notes_app_state";

export const store = {
  notes: [],
  activeNote: [],
  activeNoteId: null,
  view: "ALL",
};

export const saveState = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store.notes));
};

export const loadState = (initialNotes = []) => {
  const raw = localStorage.getItem(STORAGE_KEY);

  let parsed = null;

  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }

  // ✅ GUARANTEE ARRAY
  if (Array.isArray(parsed)) {
    store.notes = parsed;
  } else {
    store.notes = initialNotes.map((note) => ({
      ...note,
      id: crypto.randomUUID(),
    }));
    saveState(); // reset corrupted storage
  }
};
