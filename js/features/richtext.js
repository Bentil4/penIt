
/** Basic allowlist sanitization for note HTML content */
const ALLOWED_TAGS = new Set(["B","STRONG","I","EM","U","UL","OL","LI","P","BR"]);
const ALLOWED_ATTRS = new Set([]); // no attributes allowed for now

export function sanitizeHtml(html) {
  if (typeof html !== "string") return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT, null);

  const toRemove = [];
  let node = walker.currentNode;
  while (node) {
    // Strip disallowed tags
    if (!ALLOWED_TAGS.has(node.tagName)) {
      // Replace disallowed element with its textContent or child nodes
      const frag = doc.createDocumentFragment();
      while (node.firstChild) frag.appendChild(node.firstChild);
      node.parentNode?.replaceChild(frag, node);
    } else {
      // Remove all attributes (we don't keep style/class/etc.)
      [...node.attributes].forEach((attr) => {
        if (!ALLOWED_ATTRS.has(attr.name.toLowerCase())) node.removeAttribute(attr.name);
      });
    }
    node = walker.nextNode();
  }
  return doc.body.innerHTML;
}

export function setupRichTextEditor() {
  const editor = document.getElementById("note-editor");
  if (!editor) return;

  // --- Toolbar buttons ---
  const cmd = (command) => document.execCommand(command, false, null);

  const map = [
    ["rt-bold", "bold"],
    ["rt-italic", "italic"],
    ["rt-underline", "underline"],
    ["rt-ul", "insertUnorderedList"],
    ["rt-ol", "insertOrderedList"],
  ];
  map.forEach(([id, command]) => {
    document.getElementById(id)?.addEventListener("click", (e) => {
      e.preventDefault();
      editor.focus();
      cmd(command);
    });
  });

  // --- Paste handling: keep only allowed tags or plain text ---
  editor.addEventListener("paste", (e) => {
    e.preventDefault();
    const html = e.clipboardData?.getData("text/html");
    const text = e.clipboardData?.getData("text/plain") || "";
    const content = html ? sanitizeHtml(html) : toHtmlParagraphs(text);
    document.execCommand("insertHTML", false, content);
  });

  // --- Keyboard shortcuts fallback (b/i/u) ---
  editor.addEventListener("keydown", (e) => {
    const isMeta = e.ctrlKey || e.metaKey;
    if (!isMeta) return;
    if (e.key.toLowerCase() === "b") { e.preventDefault(); cmd("bold"); }
    if (e.key.toLowerCase() === "i") { e.preventDefault(); cmd("italic"); }
    if (e.key.toLowerCase() === "u") { e.preventDefault(); cmd("underline"); }
  });
}

export function getEditorHtml() {
  const editor = document.getElementById("note-editor");
  if (!editor) return "";
  return sanitizeHtml(editor.innerHTML);
}

export function setEditorHtml(html) {
  const editor = document.getElementById("note-editor");
  if (!editor) return;
  const safe = sanitizeHtml(html || "");
  editor.innerHTML = safe || "<p><br></p>";
}

function toHtmlParagraphs(text) {
  if (!text) return "<p><br></p>";
  const lines = text.split(/\r?\n/);
  const blocks = lines.map((ln) => `<p>${escapeHtml(ln) || "<br>"}</p>`);
  return blocks.join("");
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[ch])
  );
}
