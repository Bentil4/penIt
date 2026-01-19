import { store, saveState } from "../state/store.js";
import { showToast } from "../components/Toast.js";

/** ------- EXPORT ------- */
export function exportNotesToJSON() {
  const notes = Array.isArray(store.notes) ? store.notes : [];
  const pretty = JSON.stringify(notes, null, 2);
  const blob = new Blob([pretty], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `notes-export-${date}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 0);
  showToast(`Exported ${notes.length} note(s) to JSON.`);
}

/** ------- IMPORT ------- */
export async function importNotesFromFile(file) {
  if (!file) return;
  try {
    const text = await file.text();
    const raw = JSON.parse(text);
    const imported = validateAndNormalize(raw);
    const { mergedNotes, added, skipped } = mergeNotes(imported, store.notes);

    store.notes = mergedNotes;
    saveState();

    showToast(`Import complete: ${added} added, ${skipped} skipped.`);
    return { added, skipped };
  } catch (err) {
    console.error(err);
    showToast("Import failed: Invalid or corrupted JSON.");
    return { added: 0, skipped: 0, error: true };
  }
}

/** Validate array and normalize each note into canonical shape */
function validateAndNormalize(raw) {
  if (!Array.isArray(raw)) {
    throw new Error("Invalid JSON: expected an array of notes.");
  }
  return raw.map((n) => toNoteShape(n)).filter(Boolean);
}

/** Return a safe, normalized note object or null if irrecoverably bad */
function toNoteShape(n) {
  if (!n || typeof n !== "object") return null;

  const safe = {
    id: typeof n.id === "string" && n.id ? n.id : crypto.randomUUID(),
    title: typeof n.title === "string" ? n.title : "",
    content: typeof n.content === "string" ? n.content : "",
    tags: Array.isArray(n.tags)
      ? n.tags.map((t) => String(t).trim()).filter(Boolean)
      : [],
    lastEdited:
      typeof n.lastEdited === "string" &&
      !Number.isNaN(Date.parse(n.lastEdited))
        ? n.lastEdited
        : new Date().toISOString(),
    isArchived: Boolean(n.isArchived),
  };

  // drop obviously empty objects if both title and content are blank
  if (!safe.title && !safe.content && safe.tags.length === 0) {
    return null;
  }
  return safe;
}

/** Merge with dedupe. Prefers `id`. Fallback: (title, content, lastEdited) tuple. */
function mergeNotes(imported, existing) {
  const byId = new Map(existing.map((n) => [n.id, n]));
  const tupleKey = (n) => `${n.title}::${n.content}::${n.lastEdited}`;
  const existingTuples = new Set(existing.map(tupleKey));

  let added = 0;
  let skipped = 0;
  const out = [...existing];

  for (const n of imported) {
    if (byId.has(n.id) || existingTuples.has(tupleKey(n))) {
      skipped++;
      continue;
    }
    out.push(n);
    byId.set(n.id, n);
    existingTuples.add(tupleKey(n));
    added++;
  }

  // Keep sort consistent with render() (newest edited first)
  out.sort((a, b) => new Date(b.lastEdited) - new Date(a.lastEdited));

  return { mergedNotes: out, added, skipped };
}

/** Utility to trigger a one‑off hidden <input type="file"> flow */
export function openImportFilePicker() {
  let input = document.getElementById("import-notes-hidden-input");
  if (!input) {
    input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.id = "import-notes-hidden-input";
    input.style.display = "none";
    document.body.appendChild(input);

    input.addEventListener("change", () => {
      const file = input.files?.[0];
      importNotesFromFile(file).finally(() => {
        input.value = ""; // allow importing the same file again if desired
      });
    });
  }
  input.click();
}
