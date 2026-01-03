import { NoteCard } from "./NoteCard.js";

export const SearchView = (searchQuery = "", filteredNotes = []) => {
  const isMobileOrTablet = window.innerWidth < 1024;

  return `
    
    <section class="search-view">
      <div role="heading" aria-level="1" class="mobile-view__header">
        <img src="./assets/images/logo-light.svg" alt="Logo" class="search-view__logo" />
    </div>
      <h2 role="heading" aria-level="2" class="search-view__title">Search</h2>
      
      <div class="search-view__input-wrapper">
        <img src="./assets/images/icon-search.svg" alt="Search" class="search-view__search-icon" />
        <input
          id="search-view-input"
          class="search-view__input"
          type="text"
          placeholder="Search by title, content, or tags..."
          value="${searchQuery}"
        />
      </div>
      
      ${
        searchQuery
          ? `
        <p class="search-view__description">
          All notes matching "${searchQuery}" are displayed below.
        </p>
      `
          : ""
      }
      
      <div class="search-view__notes-list">
        ${
          filteredNotes.length > 0
            ? filteredNotes.map((note) => NoteCard(note, false)).join("")
            : searchQuery
            ? '<p class="search-view__no-results">No notes found matching your search.</p>'
            : '<p class="search-view__no-results">Start typing to search for notes.</p>'
        }
      </div>
      
      ${
        isMobileOrTablet
          ? `
        <button class="fab" id="create-note-fab" aria-label="Create new note">
          <img src="./assets/images/icon-plus.svg" alt="Create new note" />
        </button>
      `
          : ""
      }
    </section>
  `;
};
