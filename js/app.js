import { Sidebar } from "./components/Siderbar.js";
import { NotesList } from "./components/NoteList.js";
import { NoteView } from "./components/NoteView.js";
import { SearchBar } from "./components/SearchBar.js";
import { BottomNav } from "./components/BottomNav.js";
import notesData from "./data/notes.js";
import { store, saveState, loadState } from "./state/store.js";
import { generateId } from "./utils/helpers.js";

loadState(notesData);

const app = document.getElementById("app");

const getVisibleNotes = () => {
  let notes = store.notes.filter((note) =>
    store.view === "ARCHIVED" ? note.isArchived : !note.isArchived
  );
  if (store.tagFilter) {
    notes = notes.filter((note) => note.tags.includes(store.tagFilter));
  }
  return notes;
};

const render = () => {
  const notes = getVisibleNotes();
  const activeNote = notes.find((n) => n.id === store.activeNoteId);

  const allTags = [...new Set(store.notes.flatMap((note) => note.tags))];
  const isMobileOrTablet = window.innerWidth < 1024;
  app.innerHTML = `
    ${Sidebar(allTags, store.view)}
    <main>
      ${!isMobileOrTablet ? SearchBar() : ""}
      <div class="layout">
        ${isMobileOrTablet && store.showSearchBar ? SearchBar(true) : ""}
        ${NotesList(notes, store.activeNoteId)}
        ${NoteView(activeNote, store.view === "ARCHIVED")}
      </div>
    </main>
    ${BottomNav(allTags, store.view)}
  `;

  app.className = store.showSidebarOnTablet ? "show-sidebar-tablet" : "";

  attachEvents();
};

const attachEvents = () => {
  document.getElementById("create-note")?.addEventListener("click", () => {
    const newNote = {
      id: crypto.randomUUID(),
      title: "",
      tags: [],
      content: "",
      lastEdited: new Date().toISOString(),
      isArchived: false,
    };

    store.notes.unshift(newNote);
    store.activeNoteId = newNote.id;

    saveState();
    render();
  });

  document.querySelectorAll(".note-card").forEach((card) => {
    card.onclick = () => {
      store.activeNoteId = card.dataset.id;
      render();
    };
  });

  document.querySelectorAll(".menu li").forEach((item) => {
    item.onclick = () => {
      store.view = item.dataset.view;
      store.activeNoteId = null;
      store.tagFilter = null;
      render();
    };
  });

  // Sidebar tags
  document.querySelectorAll(".sidebar .tag span").forEach((span) => {
    span.addEventListener("click", () => {
      store.tagFilter = span.dataset.tag;
      store.activeNoteId = null;
      store.showSidebarOnTablet = false;
      render();
    });
  });

  document.getElementById("save-note")?.addEventListener("click", () => {
    const note = store.notes.find((n) => n.id === store.activeNoteId);

    note.title = document.getElementById("note-title").value;
    note.content = document.getElementById("note-content").value;
    note.tags = document
      .getElementById("note-tags")
      .value.split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    note.lastEdited = new Date().toISOString();

    saveState();
    render();
  });

  document.getElementById("delete-note")?.addEventListener("click", () => {
    store.notes = store.notes.filter((n) => n.id !== store.activeNoteId);
    store.activeNoteId = null;

    saveState();
    render();
  });

  document.getElementById("archive-note")?.addEventListener("click", () => {
    const note = store.notes.find((n) => n.id === store.activeNoteId);
    note.isArchived = true;

    store.activeNoteId = null;
    saveState();
    render();
  });

  document.getElementById("search-input")?.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    store.activeNoteId = null;

    const source =
      store.view === "ARCHIVED" ? store.archivedNotes : store.notes;

    const filtered = source.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
    );

    document.querySelector(".notes-list").innerHTML = filtered
      .map(
        (n) => `
        <div class="note-card" data-id="${n.id}">
          <h4>${n.title || "Untitled"}</h4>
          <small>
            ${
              n.tags.length > 0
                ? `<div class="tags">${n.tags
                    .map((tag) => `<span>${tag}</span>`)
                    .join("")}</div>`
                : ""
            }
            ${new Date(n.lastEdited).toLocaleDateString()}
          </small>
        </div>
      `
      )
      .join("");

    document.querySelectorAll(".notes-list .note-card").forEach((card) => {
      card.onclick = () => {
        store.activeNoteId = card.dataset.id;
        store.showSearchBar = false;
        render();
      };
    });
  });

  // Bottom Nav Events
  document.querySelectorAll(".nav-btn[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      store.view = btn.dataset.view;
      store.activeNoteId = null;
      store.tagFilter = null;
      render();
    });
  });

  document.getElementById("search-toggle")?.addEventListener("click", () => {
    store.showSearchBar = !store.showSearchBar;
    render();
    if (store.showSearchBar) {
      setTimeout(() => document.getElementById("search-input")?.focus(), 0);
    }
  });

  document.getElementById("tags-toggle")?.addEventListener("click", () => {
    if (window.innerWidth >= 768 && window.innerWidth <= 1023) {
      store.showSidebarOnTablet = !store.showSidebarOnTablet;
      render();
    } else {
      const popup = document.getElementById("tags-popup");
      popup.style.display = popup.style.display === "none" ? "flex" : "none";
    }
  });

  document.querySelectorAll(".tag-item").forEach((item) => {
    item.addEventListener("click", () => {
      store.tagFilter = item.dataset.tag;
      store.activeNoteId = null;
      document.getElementById("tags-popup").style.display = "none";
      render();
    });
  });
};

render();
