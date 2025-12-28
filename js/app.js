import { Sidebar } from "./components/Siderbar.js";
import { NotesList } from "./components/NoteList.js";
import { NoteView } from "./components/NoteView.js";
import { SearchBar } from "./components/SearchBar.js";
import { BottomNav } from "./components/BottomNav.js";
import { Settings } from "./components/Settings.js";
import notesData from "./data/notes.js";
import { store, saveState, loadState, saveSettings } from "./state/store.js";
import { generateId } from "./utils/helpers.js";

loadState(notesData);

// Apply saved settings on load
if (store.settings.colorTheme) {
  document.documentElement.setAttribute("data-theme", store.settings.colorTheme);
}
if (store.settings.fontTheme) {
  document.documentElement.setAttribute("data-font", store.settings.fontTheme);
}

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
  // Render settings page
  if (store.currentPage === "settings") {
    const allTags = [...new Set(store.notes.flatMap((note) => note.tags))];
    app.innerHTML = `
      ${Sidebar(allTags, store.view)}
      <main>
        ${SearchBar()}
        <div class="layout">
          ${Settings(store.activeSetting)}
        </div>
      </main>
      ${BottomNav(allTags, store.view)}
    `;
    app.className = store.showSidebarOnTablet ? "show-sidebar-tablet" : "";
    attachEvents();
    return;
  }

  // Render notes page
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
        ${
          !isMobileOrTablet || !activeNote
            ? NotesList(notes, store.activeNoteId)
            : ""
        }
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

  // Settings page events
  if (store.currentPage === "settings") {
    // Settings menu item clicks
    document.querySelectorAll(".settings__item").forEach((item) => {
      item.addEventListener("click", () => {
        store.activeSetting = item.dataset.setting;
        render();
      });
    });

    // Color theme radio buttons
    document.querySelectorAll('input[name="color-theme"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        const selectedOption = document.querySelector(
          'input[name="color-theme"]:checked'
        );
        if (selectedOption) {
          document
            .querySelectorAll(".settings-view__option")
            .forEach((opt) => opt.classList.remove("settings-view__option--selected"));
          selectedOption.closest(".settings-view__option").classList.add(
            "settings-view__option--selected"
          );
        }
      });
    });

    // Font theme radio buttons
    document.querySelectorAll('input[name="font-theme"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        const selectedOption = document.querySelector(
          'input[name="font-theme"]:checked'
        );
        if (selectedOption) {
          document
            .querySelectorAll(".settings-view__option")
            .forEach((opt) => opt.classList.remove("settings-view__option--selected"));
          selectedOption.closest(".settings-view__option").classList.add(
            "settings-view__option--selected"
          );
        }
      });
    });

    // Apply color theme button
    document.getElementById("apply-color-theme")?.addEventListener("click", () => {
      const selectedTheme = document.querySelector(
        'input[name="color-theme"]:checked'
      )?.value;
      if (selectedTheme) {
        store.settings.colorTheme = selectedTheme;
        saveSettings();
        // Apply theme to document
        document.documentElement.setAttribute("data-theme", selectedTheme);
        // Update selected state visually
        document.querySelectorAll(".settings-view__option").forEach((opt) => {
          opt.classList.remove("settings-view__option--selected");
        });
        document.querySelector('input[name="color-theme"]:checked')
          ?.closest(".settings-view__option")
          ?.classList.add("settings-view__option--selected");
        alert("Color theme updated successfully!");
      }
    });

    // Apply font theme button
    document.getElementById("apply-font-theme")?.addEventListener("click", () => {
      const selectedFont = document.querySelector(
        'input[name="font-theme"]:checked'
      )?.value;
      if (selectedFont) {
        store.settings.fontTheme = selectedFont;
        saveSettings();
        // Apply font to document
        document.documentElement.setAttribute("data-font", selectedFont);
        // Update selected state visually
        document.querySelectorAll(".settings-view__option").forEach((opt) => {
          opt.classList.remove("settings-view__option--selected");
        });
        document.querySelector('input[name="font-theme"]:checked')
          ?.closest(".settings-view__option")
          ?.classList.add("settings-view__option--selected");
        alert("Font theme updated successfully!");
      }
    });

    // Change password form
    document.getElementById("change-password-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const currentPassword = document.getElementById("current-password").value;
      const newPassword = document.getElementById("new-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (newPassword !== confirmPassword) {
        alert("New passwords do not match!");
        return;
      }

      if (newPassword.length < 6) {
        alert("Password must be at least 6 characters long!");
        return;
      }

      // Here you would typically send this to a backend API
      alert("Password updated successfully!");
      e.target.reset();
    });

    // Logout button
    document.getElementById("confirm-logout")?.addEventListener("click", () => {
      if (confirm("Are you sure you want to logout?")) {
        // Here you would typically clear auth tokens and redirect
        alert("Logged out successfully!");
        // For now, just go back to notes
        store.currentPage = "notes";
        render();
      }
    });
  }

  // Settings button in search bar
  const settingsBtn = document.querySelector(
    ".section-settings img[src*='icon-settings']"
  );
  settingsBtn?.addEventListener("click", () => {
    store.currentPage = "settings";
    store.activeSetting = "color-theme";
    render();
  });

  // Logo click to go back to notes
  document.querySelector(".logo")?.addEventListener("click", () => {
    if (store.currentPage === "settings") {
      store.currentPage = "notes";
      render();
    }
  });
};

render();
