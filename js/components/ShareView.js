// Minimal read-only view for shared notes.
// Assumes note.content contains sanitized HTML (from rich text feature).
export const ShareView = (note) => {
  if (!note) {
    return `
      <main class="share-view">
        <div class="share-view__container">
          <h2 class="share-view__title">Shared note not found</h2>
          <p class="share-view__desc">This link may be invalid or the note no longer exists on this device.</p>
          <button id="share-back" class="btn btn--primary">Back to app</button>
        </div>
      </main>
    `;
  }

  const tags = (note.tags || [])
    .map((t) => `<span class="share-view__tag">${t}</span>`)
    .join("");
  const category = note.category
    ? `<span class="share-view__category">${note.category}</span>`
    : "";

  return `
    <main class="share-view">
      <div class="share-view__container">
        <div class="share-view__banner">Read‑only shared note</div>
        <h1 class="share-view__note-title">${note.title || "Untitled Note"}</h1>
        <div class="share-view__meta">
          ${category}
          ${tags}
          <small class="share-view__date">Last edited: ${new Date(note.lastEdited).toLocaleString()}</small>
        </div>
        <article class="share-view__content">
          ${note.content || "<p><br></p>"}
        </article>
        <div class="share-view__footer">
          <button id="share-back" class="btn btn--secondary">Back to app</button>
        </div>
      </div>
    </main>
  `;
};
