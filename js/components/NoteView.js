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
        <small>
          <img src=".././assets/images/icon-clock.svg" alt="Last edited" />
          Last edited <span>${new Date(note.lastEdited).toLocaleString()}</span>
        </small>

        
          <!-- Rich text toolbar -->
          <div class="rt-toolbar" role="toolbar" aria-label="Note formatting">
            <div class="rt-group">
              <button id="rt-bold" class="rt-btn" type="button" aria-label="Bold"><strong>B</strong></button>
              <button id="rt-italic" class="rt-btn" type="button" aria-label="Italic"><em>I</em></button>
              <button id="rt-underline" class="rt-btn" type="button" aria-label="Underline"><u>U</u></button>
            </div>
            <div class="rt-sep"></div>
            <div class="rt-group">
              <button id="rt-ul" class="rt-btn" type="button" aria-label="Bulleted list">• List</button>
              <button id="rt-ol" class="rt-btn" type="button" aria-label="Numbered list">1. List</button>
          </div>
        </div>
        <!-- Contenteditable editor -->
        <div id="note-editor"
              class="note-editor"
              contenteditable="true"
              aria-label="Note content (rich text)">
          ${note.content || "<p><br></p>"}
        </div>

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
      </div>
    </section>
  `;
};
