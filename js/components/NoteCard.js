export const NoteCard = (note, isActive) => {
  // Format date as "DD MMM YYYY" for last edited
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return `
<section class="note-card ${isActive ? "active" : ""}" data-id="${note.id}">
  <h4>${note.title || "Untitled Note"}</h4>

  <div class="tags">
    ${note.tags.map((tag) => `<span>${tag}</span>`).join("")}
  </div>

  <small>
    ${formatDate(note.lastEdited)}
  </small>
</section>
`;
};
