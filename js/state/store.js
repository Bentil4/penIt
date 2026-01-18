const STORAGE_KEY = "notes_app_state";
const SETTINGS_STORAGE_KEY = "notes_app_settings";
const CATEGORIES_STORAGE_KEY = "notes_app_categories";

export const store = {
  notes: [],
  activeNote: [],
  activeNoteId: null,
  view: "ALL",
  tagFilter: null,
  showSidebarOnTablet: false,
  showSearchBar: false,
  searchQuery: "",
  showTagsPopup: false,
  currentPage: "notes",
  activeSetting: "color-theme",
  showSettingsMenu: true,
  showOnlySettingsMenu: false,
  settings: {
    colorTheme: "light",
    fontTheme: "Inter",
  },
  categories: [],
  categoryFilter: null,
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

  // GUARANTEE ARRAY
  if (Array.isArray(parsed)) {
    store.notes = parsed;
  } else {
    store.notes = initialNotes.map((note) => ({
      ...note,
      id: crypto.randomUUID(),
      category: note.category ?? null,
    }));
    saveState(); // reset corrupted storage
  }

  // Load settings
  loadSettings();

  // Load Categories
  loadCategories();
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

export const saveCategories = () => {
  localStorage.setItem(
    CATEGORIES_STORAGE_KEY,
    JSON.stringify(store.categories),
  );
};

export const loadCategories = () => {
  const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      const unique = [
        ...new Set(parsed.map((c) => String(c).trim()).filter(Boolean)),
      ];
      store.categories = unique;
    }
  } catch {
    store.categories = [];
  }
};
