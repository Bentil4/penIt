import { NoteCard } from "./NoteCard.js";
import { Button } from "./Button.js";

export const NotesList = (notes, activeId, view = "ALL") => {
  const isMobileOrTablet = window.innerWidth < 1024;
  const viewTitle = view === "ARCHIVED" ? "Archived Notes" : "All Notes";
  
  return `
<section class="notes-list">
  ${!isMobileOrTablet ? Button({ label: "+ Create New Note", id: "create-note" }) : ""}
  ${isMobileOrTablet ? `
    <div class="notes-list__header">
      <img src="../assets/images/logo.svg" alt="Logo" class="notes-list__logo" />
    </div>
    <h2 class="notes-list__title">${viewTitle}</h2>
  ` : ""}
  ${notes.map((n) => NoteCard(n, n.id === activeId)).join("")}
  ${isMobileOrTablet ? `<button class="fab" id="create-note-fab" aria-label="Create new note">
    <img src="../assets/images/icon-plus.svg" alt="Create new note" />
  </button>` : ""}
</section>
`;
};
