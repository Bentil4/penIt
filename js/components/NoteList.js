import { NoteCard } from "./NoteCard.js";
import { Button } from "./Button.js";

export const NotesList = (notes, activeId) => `
<section class="notes-list">
  ${Button({ label: "+ Create New Note", id: "create-note" })}
  ${notes.map((n) => NoteCard(n, n.id === activeId)).join("")}
</section>
`;
