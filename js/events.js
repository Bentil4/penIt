import { store, saveState, saveSettings } from "./state/store.js";
import { showModal } from "./components/Modal.js";
import { showToast } from "./components/Toast.js";
import { render } from "./render.js";
import { applyColorTheme, applyFontTheme } from "./themes.js";
import {
  exportNotesToJSON,
  openImportFilePicker,
} from "./features/exportImport.js";
export const attachEvents = () => {
  // Create note handlers (both desktop button and mobile FAB)
  const createNoteHandler = () => {
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

    // Focus on title input
    setTimeout(() => {
      document.getElementById("note-title")?.focus();
    }, 0);
  };

  document
    .getElementById("create-note")
    ?.addEventListener("click", createNoteHandler);
  document
    .getElementById("create-note-fab")
    ?.addEventListener("click", createNoteHandler);

  document.querySelectorAll(".note-card").forEach((card) => {
    card.onclick = () => {
      store.activeNoteId = card.dataset.id;

      if (store.showSearchBar && window.innerWidth < 1024) {
        store.showSearchBar = false;
        store.searchQuery = "";
      }
      render();
    };
  });

  // Note view back button for mobile/tablet viww
  document.getElementById("note-view-back")?.addEventListener("click", () => {
    store.activeNoteId = null;
    render();
  });

  // Header action buttons mobile/tablet
  // Delete button
  document
    .getElementById("delete-note-header")
    ?.addEventListener("click", () => {
      const deleteBtn = document.getElementById("delete-note");
      if (deleteBtn) {
        deleteBtn.click();
      } else {
        // triggering delete modal directly If delete button doesn't exist (mobile)
        showModal(
          "delete",
          "Delete Note",
          "Are you sure you want to permanently delete this note? This action cannot be undone.",
          "../assets/images/icon-delete.svg",
          "Delete Note",
          () => {
            store.notes = store.notes.filter(
              (n) => n.id !== store.activeNoteId,
            );
            store.activeNoteId = null;
            saveState();
            render();
            showToast("Note permanently deleted.");
          },
        );
      }
    });

  //archive button
  document
    .getElementById("archive-note-header")
    ?.addEventListener("click", () => {
      const archiveBtn = document.getElementById("archive-note");
      if (archiveBtn) {
        archiveBtn.click();
      } else {
        const note = store.notes.find((n) => n.id === store.activeNoteId);
        if (note && !note.isArchived) {
          showModal(
            "archive",
            "Archive Note",
            "Are you sure you want to archive this note? You can find it in the Archived Notes section and restore it anytime.",
            "../assets/images/icon-archive.svg",
            "Archive Note",
            () => {
              note.isArchived = true;
              store.activeNoteId = null;
              saveState();
              render();
              showToast("Note archived.", true, "Archived Notes", () => {
                store.view = "ARCHIVED";
                render();
              });
            },
          );
        }
      }
    });

  // Cancel button
  document
    .getElementById("cancel-note-header")
    ?.addEventListener("click", () => {
      store.activeNoteId = null;
      render();
    });

  // Save button
  document.getElementById("save-note-header")?.addEventListener("click", () => {
    const saveBtn = document.getElementById("save-note");
    if (saveBtn) {
      saveBtn.click();
    } else {
      // Calling saveNote function directly if button doesn't exist for mobile/tablet
      const note = store.notes.find((note) => note.id === store.activeNoteId);
      if (!note) return;

      const title = document.getElementById("note-title")?.value || "";
      const content = document.getElementById("note-content")?.value || "";
      const tagsInput = document.getElementById("note-tags")?.value || "";

      note.title = title;
      note.content = content;
      note.tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      note.lastEdited = new Date().toISOString();

      saveState();
      render();
      showToast("Note saved successfully!");
    }
  });

  document.querySelectorAll(".menu li").forEach((item) => {
    item.onclick = () => {
      store.view = item.dataset.view;
      store.activeNoteId = null;
      store.tagFilter = null;
      render();
    };
  });

  // Go back button in notes list for mobile/tablet
  document
    .getElementById("notes-list-go-back")
    ?.addEventListener("click", () => {
      store.tagFilter = null;
      store.view = "ALL";
      store.activeNoteId = null;
      render();
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

  // Save note function
  const saveNote = () => {
    const note = store.notes.find((n) => n.id === store.activeNoteId);

    if (!note) return;

    // Getting current values from inputs
    const title = document.getElementById("note-title")?.value || "";
    const content = document.getElementById("note-content")?.value || "";
    const tagsInput = document.getElementById("note-tags")?.value || "";

    // Updating note
    note.title = title;
    note.content = content;
    note.tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    note.lastEdited = new Date().toISOString();

    saveState();
    render();
    showToast("Note saved successfully!");
  };

  document.getElementById("save-note")?.addEventListener("click", saveNote);

  // Cancel note
  document.getElementById("cancel-note")?.addEventListener("click", () => {
    store.activeNoteId = null;
    render();
  });

  // Keyboard shortcuts for note editing
  document.addEventListener("keydown", (e) => {
    if (!store.activeNoteId) return;

    const target = e.target;
    const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

    // Ctrl+S or Cmd+S to save note
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      if (isInput) {
        e.preventDefault();
        saveNote();
      }
    }

    // Escape to cancel note
    if (e.key === "Escape" && isInput) {
      e.preventDefault();
      store.activeNoteId = null;
      render();
    }
  });

  //Actions for desktop note view
  // Delete note for desktop
  document.getElementById("delete-note")?.addEventListener("click", () => {
    showModal(
      "delete",
      "Delete Note",
      "Are you sure you want to permanently delete this note? This action cannot be undone.",
      "../assets/images/icon-delete.svg",
      "Delete Note",
      () => {
        store.notes = store.notes.filter((n) => n.id !== store.activeNoteId);
        store.activeNoteId = null;
        saveState();
        render();
        showToast("Note permanently deleted.");
      },
    );
  });

  // Archive note for desktop
  document.getElementById("archive-note")?.addEventListener("click", () => {
    showModal(
      "archive",
      "Archive Note",
      "Are you sure you want to archive this note? You can find it in the Archived Notes section and restore it anytime.",
      "../assets/images/icon-archive.svg",
      "Archive Note",
      () => {
        const note = store.notes.find((n) => n.id === store.activeNoteId);
        note.isArchived = true;
        store.activeNoteId = null;
        saveState();
        render();
        showToast("Note archived.", true, "Archived Notes", () => {
          store.view = "ARCHIVED";
          render();
        });
      },
    );
  });

  // Handling search input -
  const handleSearchInput = (e) => {
    const query = e.target.value;
    store.searchQuery = query;
    store.activeNoteId = null;

    const isMobileOrTablet = window.innerWidth < 1024;

    // If on mobile/tablet and search bar is active, re-render to show SearchView
    if (isMobileOrTablet && store.showSearchBar) {
      render();
      return;
    }

    // Desktop search - update notes list inline
    const queryLower = query.toLowerCase();
    const source =
      store.view === "ARCHIVED"
        ? store.notes.filter((n) => n.isArchived)
        : store.notes.filter((n) => !n.isArchived);

    const filtered = source.filter(
      (note) =>
        note.title.toLowerCase().includes(queryLower) ||
        note.content.toLowerCase().includes(queryLower) ||
        note.tags.some((t) => t.toLowerCase().includes(queryLower)),
    );

    // Update notes list
    const notesList = document.querySelector(".notes-list");
    if (notesList) {
      notesList.innerHTML = filtered
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
        `,
        )
        .join("");

      // Adding click event to each note card
      document.querySelectorAll(".notes-list .note-card").forEach((card) => {
        card.onclick = () => {
          store.activeNoteId = card.dataset.id;
          store.showSearchBar = false;
          store.searchQuery = "";
          render();
        };
      });
    }
  };

  // search inputs events listener
  document
    .getElementById("search-input")
    ?.addEventListener("input", handleSearchInput);
  document
    .getElementById("search-view-input")
    ?.addEventListener("input", handleSearchInput);

  // Bottom Nav Events
  document.querySelectorAll(".nav-btn[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const isMobileOrTablet = window.innerWidth < 1024;
      store.view = btn.dataset.view;
      store.activeNoteId = null;

      if (isMobileOrTablet) return;
      else {
        store.tagFilter = null;
      }
      render();
    });
  });

  // Search toggle
  document.getElementById("search-toggle")?.addEventListener("click", () => {
    const isMobileOrTablet = window.innerWidth < 1024;
    if (isMobileOrTablet) {
      store.showSearchBar = !store.showSearchBar;
      if (!store.showSearchBar) {
        store.searchQuery = "";
      }
      render();
      if (store.showSearchBar) {
        setTimeout(() => {
          const searchInput =
            document.getElementById("search-view-input") ||
            document.getElementById("search-input");
          searchInput?.focus();
        }, 0);
      }
    } else {
      // On desktop, toggle search bar
      store.showSearchBar = !store.showSearchBar;
      render();
      if (store.showSearchBar) {
        setTimeout(() => document.getElementById("search-input")?.focus(), 0);
      }
    }
  });

  // Tags toggle
  document.getElementById("tags-toggle")?.addEventListener("click", () => {
    if (window.innerWidth < 1024) {
      store.showSidebarOnTablet = !store.showSidebarOnTablet;
      render();
    }
  });

  // Settings page events
  if (store.currentPage === "settings") {
    // On desktop show both menu and view side by side

    document.querySelectorAll(".settings__item").forEach((item) => {
      item.addEventListener("click", () => {
        store.activeSetting = item.dataset.setting;
        const isDesktop = window.innerWidth >= 1024;
        if (isDesktop) {
          store.showSettingsMenu = true;
          store.showOnlySettingsMenu = false;
        } else {
          store.showSettingsMenu = false;
          store.showOnlySettingsMenu = false;
        }
        render();
      });
    });

    // Back button to return to settings menu
    document
      .getElementById("settings-back-btn")
      ?.addEventListener("click", () => {
        store.showSettingsMenu = true;
        store.showOnlySettingsMenu = true;
        render();
      });

    // Color theme radio buttons
    document.querySelectorAll('input[name="color-theme"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        const selectedOption = document.querySelector(
          'input[name="color-theme"]:checked',
        );
        if (selectedOption) {
          document
            .querySelectorAll(".settings-view__option")
            .forEach((opt) =>
              opt.classList.remove("settings-view__option--selected"),
            );
          selectedOption
            .closest(".settings-view__option")
            .classList.add("settings-view__option--selected");
        }
      });
    });

    // Font theme radio buttons
    document.querySelectorAll('input[name="font-theme"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        const selectedOption = document.querySelector(
          'input[name="font-theme"]:checked',
        );
        if (selectedOption) {
          document
            .querySelectorAll(".settings-view__option")
            .forEach((opt) =>
              opt.classList.remove("settings-view__option--selected"),
            );
          selectedOption
            .closest(".settings-view__option")
            .classList.add("settings-view__option--selected");
        }
      });
    });

    // Applying color theme button
    document
      .getElementById("apply-color-theme")
      ?.addEventListener("click", () => {
        const selectedTheme = document.querySelector(
          'input[name="color-theme"]:checked',
        )?.value;
        if (selectedTheme) {
          store.settings.colorTheme = selectedTheme;
          saveSettings();
          applyColorTheme(selectedTheme);

          document
            .querySelectorAll(".settings-view__option")
            .forEach((option) => {
              option.classList.remove("settings-view__option--selected");
            });
          document
            .querySelector('input[name="color-theme"]:checked')
            ?.closest(".settings-view__option")
            ?.classList.add("settings-view__option--selected");
          showToast("Settings updated successfully!");
        }
      });

    // Apply font theme button
    document
      .getElementById("apply-font-theme")
      ?.addEventListener("click", () => {
        const selectedFont = document.querySelector(
          'input[name="font-theme"]:checked',
        )?.value;
        if (selectedFont) {
          store.settings.fontTheme = selectedFont;
          saveSettings();
          applyFontTheme(selectedFont);
          document
            .querySelectorAll(".settings-view__option")
            .forEach((option) => {
              option.classList.remove("settings-view__option--selected");
            });
          document
            .querySelector('input[name="font-theme"]:checked')
            ?.closest(".settings-view__option")
            ?.classList.add("settings-view__option--selected");
          showToast("Settings updated successfully!");
        }
      });
  }

  // Logo click to go back to notes
  document.querySelector(".logo")?.addEventListener("click", () => {
    if (store.currentPage === "settings") {
      store.currentPage = "notes";
      render();
    }
  });

  // Export / Import – Feature 1
  // Desktop right sidebar buttons
  document.getElementById("export-notes")?.addEventListener("click", () => {
    exportNotesToJSON();
  });
  document.getElementById("import-notes")?.addEventListener("click", () => {
    openImportFilePicker();
  });

  // SearchBar quick actions (desktop)
  document.getElementById("export-notes-top")?.addEventListener("click", () => {
    exportNotesToJSON();
  });
  document.getElementById("import-notes-top")?.addEventListener("click", () => {
    openImportFilePicker();
  });
};
