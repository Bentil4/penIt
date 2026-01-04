import { store, saveState, saveSettings } from "./state/store.js";
import { showModal } from "./components/Modal.js";
import { showToast } from "./components/Toast.js";
import { render } from "./render.js";
import { applyColorTheme, applyFontTheme } from "./themes.js";

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

    // Focus on title input after creating new note
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
      // If in search view, close it
      if (store.showSearchBar && window.innerWidth < 1024) {
        store.showSearchBar = false;
        store.searchQuery = "";
      }
      render();
    };
  });

  // Note view back button (mobile/tablet)
  document.getElementById("note-view-back")?.addEventListener("click", () => {
    store.activeNoteId = null;
    render();
  });

  // Header action buttons (mobile/tablet)
  document
    .getElementById("delete-note-header")
    ?.addEventListener("click", () => {
      // Trigger the same delete flow as the regular delete button
      const deleteBtn = document.getElementById("delete-note");
      if (deleteBtn) {
        deleteBtn.click();
      } else {
        // If delete button doesn't exist (mobile), trigger delete modal directly
        showModal(
          "delete",
          "Delete Note",
          "Are you sure you want to permanently delete this note? This action cannot be undone.",
          "../assets/images/icon-delete.svg",
          "Delete Note",
          () => {
            store.notes = store.notes.filter(
              (n) => n.id !== store.activeNoteId
            );
            store.activeNoteId = null;
            saveState();
            render();
            showToast("Note permanently deleted.");
          }
        );
      }
    });

  document
    .getElementById("archive-note-header")
    ?.addEventListener("click", () => {
      // Trigger the same archive flow as the regular archive button
      const archiveBtn = document.getElementById("archive-note");
      if (archiveBtn) {
        archiveBtn.click();
      } else {
        // If archive button doesn't exist (mobile), trigger archive modal directly
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
            }
          );
        }
      }
    });

  document
    .getElementById("cancel-note-header")
    ?.addEventListener("click", () => {
      // Cancel editing - deselect the note to discard changes
      store.activeNoteId = null;
      render();
    });

  document.getElementById("save-note-header")?.addEventListener("click", () => {
    // Trigger save note - try to click the button first, otherwise call saveNote directly
    const saveBtn = document.getElementById("save-note");
    if (saveBtn) {
      saveBtn.click();
    } else {
      // Call saveNote function directly if button doesn't exist (mobile/tablet)
      // Note: saveNote is defined later in this function, so we'll duplicate the logic here
      const note = store.notes.find((n) => n.id === store.activeNoteId);
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

  // Go back button in notes list (mobile/tablet)
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

    // Get current values from inputs
    const title = document.getElementById("note-title")?.value || "";
    const content = document.getElementById("note-content")?.value || "";
    const tagsInput = document.getElementById("note-tags")?.value || "";

    // Update note
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

  document.getElementById("cancel-note")?.addEventListener("click", () => {
    // Cancel editing - just deselect the note to discard changes
    // The note will revert to its saved state when re-selected
    store.activeNoteId = null;
    render();
  });

  // Keyboard shortcuts for note editing
  document.addEventListener("keydown", (e) => {
    // Only handle shortcuts when a note is active
    if (!store.activeNoteId) return;

    const target = e.target;
    const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

    // Ctrl+S or Cmd+S to save (when in input fields)
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      if (isInput) {
        e.preventDefault();
        saveNote();
      }
    }

    // Escape to cancel (when in input fields)
    if (e.key === "Escape" && isInput) {
      e.preventDefault();
      store.activeNoteId = null;
      render();
    }
  });

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
      }
    );
  });

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
      }
    );
  });

  // Handle search input - works for both desktop search bar and mobile search view
  const handleSearchInput = (e) => {
    const q = e.target.value;
    store.searchQuery = q;
    store.activeNoteId = null;

    const isMobileOrTablet = window.innerWidth < 1024;

    // If on mobile/tablet and search bar is active, re-render to show SearchView
    if (isMobileOrTablet && store.showSearchBar) {
      render();
      return;
    }

    // Desktop search - update notes list inline
    const qLower = q.toLowerCase();
    const source =
      store.view === "ARCHIVED"
        ? store.notes.filter((n) => n.isArchived)
        : store.notes.filter((n) => !n.isArchived);

    const filtered = source.filter(
      (n) =>
        n.title.toLowerCase().includes(qLower) ||
        n.content.toLowerCase().includes(qLower) ||
        n.tags.some((t) => t.toLowerCase().includes(qLower))
    );

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
        `
        )
        .join("");

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
      // Only clear tagFilter on mobile/tablet to keep search/tags independent
      if (isMobileOrTablet) {
        // Don't clear tagFilter - let search/tags maintain their state
      } else {
        store.tagFilter = null;
      }
      render();
    });
  });

  document.getElementById("search-toggle")?.addEventListener("click", () => {
    const isMobileOrTablet = window.innerWidth < 1024;
    if (isMobileOrTablet) {
      // On mobile/tablet, toggle search view
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

  document.getElementById("tags-toggle")?.addEventListener("click", () => {
    if (window.innerWidth < 1024) {
      store.showSidebarOnTablet = !store.showSidebarOnTablet;
      render();
    }
  });

  // Settings page events
  if (store.currentPage === "settings") {
    // Settings menu item clicks
    document.querySelectorAll(".settings__item").forEach((item) => {
      item.addEventListener("click", () => {
        store.activeSetting = item.dataset.setting;
        // On desktop (>= 1024px), show both menu and view side by side
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
          'input[name="color-theme"]:checked'
        );
        if (selectedOption) {
          document
            .querySelectorAll(".settings-view__option")
            .forEach((opt) =>
              opt.classList.remove("settings-view__option--selected")
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
          'input[name="font-theme"]:checked'
        );
        if (selectedOption) {
          document
            .querySelectorAll(".settings-view__option")
            .forEach((opt) =>
              opt.classList.remove("settings-view__option--selected")
            );
          selectedOption
            .closest(".settings-view__option")
            .classList.add("settings-view__option--selected");
        }
      });
    });

    // Apply color theme button
    document
      .getElementById("apply-color-theme")
      ?.addEventListener("click", () => {
        const selectedTheme = document.querySelector(
          'input[name="color-theme"]:checked'
        )?.value;
        if (selectedTheme) {
          store.settings.colorTheme = selectedTheme;
          saveSettings();
          // Apply theme to document
          applyColorTheme(selectedTheme);
          // Update selected state visually
          document.querySelectorAll(".settings-view__option").forEach((opt) => {
            opt.classList.remove("settings-view__option--selected");
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
          'input[name="font-theme"]:checked'
        )?.value;
        if (selectedFont) {
          store.settings.fontTheme = selectedFont;
          saveSettings();
          // Apply font to document
          applyFontTheme(selectedFont);
          // Update selected state visually
          document.querySelectorAll(".settings-view__option").forEach((opt) => {
            opt.classList.remove("settings-view__option--selected");
          });
          document
            .querySelector('input[name="font-theme"]:checked')
            ?.closest(".settings-view__option")
            ?.classList.add("settings-view__option--selected");
          showToast("Settings updated successfully!");
        }
      });

    // Change password form
    document
      .getElementById("change-password-form")
      ?.addEventListener("submit", (e) => {
        e.preventDefault();
        const currentPassword =
          document.getElementById("current-password").value;
        const newPassword = document.getElementById("new-password").value;
        const confirmPassword =
          document.getElementById("confirm-password").value;

        if (newPassword !== confirmPassword) {
          alert("New passwords do not match!");
          return;
        }

        if (newPassword.length < 8) {
          alert("Password must be at least 8 characters long!");
          return;
        }

        // Here you would typically send this to a backend API
        showToast("Password changed successfully!");
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

  // Logo click to go back to notes
  document.querySelector(".logo")?.addEventListener("click", () => {
    if (store.currentPage === "settings") {
      store.currentPage = "notes";
      render();
    }
  });
};
