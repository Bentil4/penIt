import { NoteCard } from "./NoteCard.js";
import { Button } from "./Button.js";

export const NotesList = (notes, activeId, view = "ALL", tagFilter = null) => {
  const isMobileOrTablet = window.innerWidth < 1024;
  const viewTitle =
    view === "ARCHIVED"
      ? "Archived Notes"
      : tagFilter
      ? `Notes Tagged: ${tagFilter}`
      : "All Notes";
  const showGoBack =
    isMobileOrTablet && (view === "ARCHIVED" || tagFilter !== null);

  return `
<section class="notes-list">
  ${
    !isMobileOrTablet
      ? Button({ label: "+ Create New Note", id: "create-note" })
      : ""
  }
  ${
    isMobileOrTablet
      ? `
    <div role="heading" aria-level="1" class="mobile-view__header">
        <img src="./assets/images/logo-light.svg" alt="Logo" class="search-view__logo" />
    </div>
    ${
      showGoBack
        ? `
      <button class="notes-list__back" id="notes-list-go-back">
        <img src="../assets/images/icon-arrow-left.svg" alt="Go back" />
        <span>Go Back</span>
      </button>
    `
        : ""
    }
    <h2 class="notes-list__title">${viewTitle}</h2>
    ${
      tagFilter
        ? `<p class="notes-list__subtitle">All notes with the "${tagFilter}" tag are shown here.</p>`
        : ""
    }
  `
      : ""
  }
  ${notes.map((n) => NoteCard(n, n.id === activeId)).join("")}
  ${
    isMobileOrTablet
      ? `<button class="fab" id="create-note-fab" aria-label="Create new note">
    <img src="../assets/images/icon-plus.svg" alt="Create new note" />
  </button>`
      : ""
  }
</section>
`;
};
