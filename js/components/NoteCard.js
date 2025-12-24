export const NoteCard = (note, isActive) => `
<div class="note-card ${isActive ? "active" : ""}" data-id="${note.id}">
  <h4>${note.title || "Untitled Note"}</h4>

  <div class="tags">
    ${note.tags.map((tag) => `<span>${tag}</span>`).join("")}
  </div>

  <small>
    ${new Date(note.lastEdited).toLocaleDateString()}
  </small>
</div>
`;
