import { Button } from "./Button.js";

export const NoteView = (note) => {
  if (!note) {
    return `<section class="note-view empty">Select a note</section>`;
  }

  return `
  <section class="note-view-container">
    <section class="note-view">
      <section class="top-note">
      <input id="note-title" placeholder="Enter a title..." value="${
        note.title
      }" />

      <span class="note-tags" >
          <span class="label-with-icon">
          <img src=".././assets/images/icon-tag.svg" alt="Tags" /> 
          <label for="note-tags" >Tags</label></span>
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

        <textarea id="note-content">${note.content}</textarea>
      </section>
        <span class=spacer></span>

        <div class="actions">
          ${
            !note.isArchived
              ? Button({
                  label: "Save Note",
                  id: "archive-note",
                  variant: "primary",
                })
              : ""
          }
          ${Button({
            label: "Cancel",
            id: "delete-note",
            variant: "$color-blue-700",
          })}
        </div>
  </section>
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
        // variant: "danger",
      })}
      
    </div>
  </section>
</section>
`;
};
