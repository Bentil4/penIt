import { Button } from "./Button.js";
import { store } from "../state/store.js";
export const NoteView = (note) => {
  if (!note) {
    return `<section class="note-view empty">Select a note</section>`;
  }

  const isMobileOrTablet = window.innerWidth < 1024;

  return `
    ${
      isMobileOrTablet
        ? `
      <div role="heading" aria-level="1" class="mobile-view__header">
        <img src="./assets/images/logo-light.svg" alt="Logo" class="search-view__logo" />
      </div>
    `
        : ""
    }
    <section class="note-view">
      ${
        isMobileOrTablet
          ? `
        <header class="note-view__header">
          <div class="note-view__header-left">
            <div class="note-view__logo-container">
              <img src="../assets/images/logo.svg" alt="Logo" class="note-view__logo" />
            </div>
          </div>
          <div class="note-view__header-actions">
           <button class="note-view__back" id="note-view-back">
              <img src="../assets/images/icon-arrow-left.svg" alt="Go back" />
              <span>Go Back</span>
            </button>
            <div class="note-view__action-buttons">
              <button class="note-view__action-icon" id="delete-note-header" aria-label="Delete note">
                <img src="../assets/images/icon-delete.svg" alt="Delete" />
              </button>
              <button class="note-view__action-icon" id="delete-note-header" aria-label="Import note">
                <img src="../assets/images/icon-upload.svg" alt="Upload" />
              </button>
              ${
                !note.isArchived
                  ? `
                <button class="note-view__action-icon" id="archive-note-header" aria-label="Archive note">
                  <img src="../assets/images/icon-archive.svg" alt="Archive" />
                </button>
              `
                  : ""
              }
              <button class="note-view__action-text" id="cancel-note-header">Cancel</button>
              <button class="note-view__action-text note-view__action-text--primary" id="save-note-header">Save Note</button></div>
            </div>
        </header>
      `
          : ""
      }
      <section class="top-note">
        <input id="note-title" placeholder="Enter a title..." value="${
          note.title
        }" />

        <span class="note-tags">
          <span class="label-with-icon">
            <img src=".././assets/images/icon-tag.svg" alt="Tags" /> 
            <label for="note-tags">Tags</label>
          </span>
          <input
            id="note-tags"
            value="${note.tags.join(", ")}"
            placeholder="Add tags separated by commas (e.g. Work, Planning)"
          />
        </span>


<span class="note-category">
     <span class="label-with-icon">
       <img src=".././assets/images/icon-tag.svg" alt="Category" />
       <label for="note-category">Category</label>
     </span>
     ${(() => {
       const list = Array.isArray(store.categories)
         ? [...store.categories]
         : [];
       if (note.category && !list.includes(note.category)) {
         list.unshift(note.category);
       }
       const options = ['<option value="">Uncategorized</option>']
         .concat(list.map((c) => `<option value="${c}">${c}</option>`))
         .join("");
       return `<select id="note-category">${options}</select>`;
     })()}
    </span>


        <small>
          <img src=".././assets/images/icon-clock.svg" alt="Last edited" />
          Last edited <span>${new Date(note.lastEdited).toLocaleString()}</span>
        </small>

        <textarea id="note-content">${note.content}</textarea>
      </section>
      ${
        !isMobileOrTablet
          ? `
        <div class="actions">
          ${Button({
            label: "Save Note",
            id: "save-note",
            variant: "primary",
          })}
          ${Button({
            label: "Cancel",
            id: "cancel-note",
            variant: "secondary",
          })}
        </div>
      `
          : ""
      }
    </section>
  `;
};

export const NoteActionsSidebar = (note) => {
  if (!note) {
    return `<section class="right-side-bar"></section>`;
  }

  return `
    <section class="right-side-bar">
      <div class="side-actions">
        ${
          !note.isArchived
            ? Button({
                label: `<img src=".././assets/images/icon-archive.svg" alt="Archive" /> <p>Archive Note</p>`,
                id: "archive-note",
                variant: "secondary",
              })
            : ""
        }
        ${Button({
          label: `<img src=".././assets/images/icon-delete.svg" alt="Delete" /> <p>Delete Note</p>`,
          id: "delete-note",
          variant: "secondary",
        })}
        
        ${Button({
          label: `<img src=".././assets/images/icon-upload.svg" alt="Import" /><p>Import from JSON</p>`,
          id: "import-notes",
          variant: "secondary",
        })}

      </div>
    </section>
  `;
};
