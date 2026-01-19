import { Sidebar } from "./components/Siderbar.js";
import { NotesList } from "./components/NoteList.js";
import { NoteView, NoteActionsSidebar } from "./components/NoteView.js";
import { SearchBar } from "./components/SearchBar.js";
import { SearchView } from "./components/SearchView.js";
import { BottomNav } from "./components/BottomNav.js";
import { Settings } from "./components/Settings.js";
import { store } from "./state/store.js";
import { isDarkMode, updateLogo } from "./themes.js";
import { attachEvents } from "./events.js";
import { ShareView } from "./components/ShareView.js";
import { stripHtml } from "./utils/text.js";

const app = document.getElementById("app");

// Getting visible notes
const getVisibleNotes = () => {
  let notes = store.notes;

  // Filter by archived status
  if (store.view === "ARCHIVED") {
    notes = notes.filter((n) => n.isArchived);
  } else {
    notes = notes.filter((n) => !n.isArchived);
  }

  // Filter by tag
  if (store.tagFilter) {
    notes = notes.filter((n) => n.tags.includes(store.tagFilter));
  }

  // Filter by category
  if (store.categoryFilter) {
    notes = notes.filter((n) => n.category === store.categoryFilter);
  }

  // Sort by last edited
  notes.sort(
    (first, last) => new Date(last.lastEdited) - new Date(first.lastEdited),
  );

  return notes;
};

export const render = () => {
  // Share route: #/share/:id -> read-only note view 
  const hash = window.location.hash || "";
  if (hash.startsWith("#/share/")) {
    const id = hash.replace("#/share/", "").trim();
    const note = (store.notes || []).find((n) => n.shareId === id);
    app.innerHTML = `${ShareView(note)}`;
    app.className = "";
    attachEvents();

    const currentTheme = store.settings.colorTheme || "system";
    const darkMode = isDarkMode(currentTheme);
    updateLogo(darkMode);
    return;
  }

  // Render settings page
  if (store.currentPage === "settings") {
    const allTags = [...new Set(store.notes.flatMap((note) => note.tags))];
    const isTagsActive = store.showSidebarOnTablet || store.tagFilter !== null;
    const allCategories = store.categories || [];
    app.innerHTML = `
      ${Sidebar(allTags, store.view, allCategories, store.categoryFilter)}
      <main>
        ${SearchBar()}
        <div class="layout">
          ${Settings(
            store.activeSetting,
            store.showSettingsMenu,
            store.showOnlySettingsMenu,
          )}
        </div>
      </main>
      ${BottomNav(allTags, store.view, isTagsActive, false)}
    `;
    app.className = store.showSidebarOnTablet ? "show-sidebar-tablet" : "";
    attachEvents();
    return;
  }

  // Render notes page
  const notes = getVisibleNotes();
  const activeNote = notes.find((n) => n.id === store.activeNoteId);

  const allTags = [...new Set(store.notes.flatMap((note) => note.tags))];
  const isMobileOrTablet = window.innerWidth < 1024;
  const isTagsActive = store.showSidebarOnTablet || store.tagFilter !== null;
  const allCategories = store.categories || [];

  // Get filtered notes for search
  const getFilteredNotes = () => {
    if (!store.searchQuery) return [];
    const q = store.searchQuery.toLowerCase();
    const source =
      store.view === "ARCHIVED"
        ? store.notes.filter((n) => n.isArchived)
        : store.notes.filter((n) => !n.isArchived);

    return source.filter((n) => {
      const body = stripHtml(n.content || "").toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q)),
    );
  };

  // show SearchView if search bar is active on mobile/tablet,
  if (isMobileOrTablet && store.showSearchBar) {
    const filteredNotes = getFilteredNotes();
    app.innerHTML = `
      <main>
        ${SearchView(store.searchQuery, filteredNotes)}
      </main>
      ${BottomNav(allTags, store.view, isTagsActive, true)}
    `;
    app.className = "";
    attachEvents();
    return;
  }

  app.innerHTML = `
    ${Sidebar(allTags, store.view, allCategories, store.categoryFilter)}
    <main>
      ${!isMobileOrTablet ? SearchBar() : ""}
      <section class="layout">
        ${
          !isMobileOrTablet || !activeNote
            ? NotesList(notes, store.activeNoteId, store.view, store.tagFilter)
            : ""
        }
        ${isMobileOrTablet && !activeNote ? "" : NoteView(activeNote)}
        ${!isMobileOrTablet ? NoteActionsSidebar(activeNote) : ""}
      </section>
    </main>
    ${BottomNav(allTags, store.view, isTagsActive, store.showSearchBar)}
  `;

  app.className = store.showSidebarOnTablet ? "show-sidebar-tablet" : "";

  attachEvents();

  // Updating logo icon to matches current theme
  const currentTheme = store.settings.colorTheme || "system";
  const darkMode = isDarkMode(currentTheme);
  updateLogo(darkMode);
};
