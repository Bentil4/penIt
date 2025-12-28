const STORAGE_KEY = "notes_app_state";
const SETTINGS_STORAGE_KEY = "notes_app_settings";

export const store = {
  notes: [],
  activeNote: [],
  activeNoteId: null,
  view: "ALL",
  tagFilter: null,
  showSidebarOnTablet: false,
  showSearchBar: false,
  currentPage: "notes", 
  activeSetting: "color-theme",
  settings: {
    colorTheme: "light", // "light", "dark", "system"
    fontTheme: "Inter", // "Inter", "Noto-serif", "Source code pro "
  },
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

  // Load settings
  loadSettings();
};

export const saveSettings = () => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(store.settings));
};

export const loadSettings = () => {
  const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);

  let parsed = null;

  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }

  if (parsed && typeof parsed === "object") {
    store.settings = { ...store.settings, ...parsed };
  }
};
