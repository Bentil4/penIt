import { Sidebar } from "./components/Siderbar.js";
import { NotesList } from "./components/NoteList.js";
import { NoteView, NoteActionsSidebar } from "./components/NoteView.js";
import { SearchBar } from "./components/SearchBar.js";
import { BottomNav } from "./components/BottomNav.js";
import { Settings } from "./components/Settings.js";
import { showModal } from "./components/Modal.js";
import { showToast } from "./components/Toast.js";
import notesData from "./data/notes.js";
import { store, saveState, loadState, saveSettings } from "./state/store.js";
import { generateId } from "./utils/helpers.js";

loadState(notesData);

// Function to apply font theme
const applyFontTheme = (fontName) => {
  // Set data-font attribute on html element for CSS targeting
  document.documentElement.setAttribute("data-font", fontName);
  
  // Apply font family directly to all elements
  // Using exact font names that match @font-face declarations
  const fontMap = {
    "Inter": '"Inter", sans-serif',
    "Noto Serif": '"Noto Serif", serif',
    "Source Code Pro": '"Source Code Pro", monospace'
  };
  const fontFamily = fontMap[fontName] || fontMap["Inter"];
  
  // Apply to html element (will cascade to all children)
  document.documentElement.style.setProperty("font-family", fontFamily, "important");
  
  // Also apply to body for extra specificity
  document.body.style.setProperty("font-family", fontFamily, "important");
  
  // Apply to all elements using a style tag for maximum coverage
  let styleElement = document.getElementById("dynamic-font-style");
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = "dynamic-font-style";
    document.head.appendChild(styleElement);
  }
  styleElement.textContent = `
    html[data-font="${fontName}"] *,
    html[data-font="${fontName}"] {
      font-family: ${fontFamily} !important;
    }
  `;
  
  // Force a reflow to ensure styles are applied
  void document.body.offsetHeight;
};

// Helper function to determine if we're in dark mode
const isDarkMode = (themeName) => {
  if (themeName === "dark") return true;
  if (themeName === "light") return false;
  if (themeName === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
};

// Function to update logo based on theme
const updateLogo = (isDark) => {
  const logos = document.querySelectorAll('.logo, .login__logo, .forgot__logo, .reset__logo, .notes-list__logo, .note-view__logo');
  logos.forEach(logo => {
    if (logo) {
      const currentSrc = logo.getAttribute('src');
      if (isDark) {
        // Change to logo-light.svg for dark mode
        if (currentSrc && currentSrc.includes('logo.svg')) {
          logo.setAttribute('src', currentSrc.replace('logo.svg', 'logo-light.svg'));
        }
      } else {
        // Change to logo.svg for light mode
        if (currentSrc && currentSrc.includes('logo-light.svg')) {
          logo.setAttribute('src', currentSrc.replace('logo-light.svg', 'logo.svg'));
        }
      }
    }
  });
};

// Function to apply color theme
const applyColorTheme = (themeName) => {
  // Validate theme name
  const validThemes = ["light", "dark", "system"];
  if (!validThemes.includes(themeName)) {
    themeName = "system"; // Default to system if invalid
  }
  
  // Set data-theme attribute on html element
  document.documentElement.setAttribute("data-theme", themeName);
  
  // Update logo based on theme
  const darkMode = isDarkMode(themeName);
  updateLogo(darkMode);
  
  // For system theme, listen to prefers-color-scheme changes
  if (themeName === "system") {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e) => {
      // The CSS will handle the change automatically via media query
      // Update logo when system preference changes
      updateLogo(e.matches);
      // Force a reflow to ensure styles update immediately
      void document.body.offsetHeight;
    };
    
    // Remove old listener if exists
    if (window.systemThemeListener) {
      mediaQuery.removeEventListener("change", window.systemThemeListener);
    }
    
    // Add new listener
    window.systemThemeListener = handleSystemThemeChange;
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    
    // Trigger initial check
    handleSystemThemeChange(mediaQuery);
  } else {
    // Remove system theme listener if switching away from system
    if (window.systemThemeListener) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.removeEventListener("change", window.systemThemeListener);
      window.systemThemeListener = null;
    }
  }
  
  // Force a reflow to ensure styles are applied
  void document.body.offsetHeight;
};

// Initialize theme on page load
// This runs after loadState which calls loadSettings
const initializeTheme = () => {
  // Get theme from store, default to "system" if not set
  const theme = store.settings.colorTheme || "system";
  applyColorTheme(theme);
  
  // Apply font theme if set
  if (store.settings.fontTheme) {
    applyFontTheme(store.settings.fontTheme);
  }
};

// Apply theme initialization after DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeTheme);
} else {
  // DOM is already ready
  initializeTheme();
}

const app = document.getElementById("app");

// Global event delegation for settings buttons (attached once)
document.addEventListener("click", (e) => {
  // Settings button in search bar
  if (e.target.closest(".section-settings img[src*='icon-settings']")) {
    if (store.currentPage === "settings") {
      // If already on settings page, show only menu
      store.showOnlySettingsMenu = true;
      store.showSettingsMenu = true;
    } else {
      store.currentPage = "settings";
      store.activeSetting = "color-theme";
      store.showSettingsMenu = true;
      store.showOnlySettingsMenu = true;
    }
    render();
    return;
  }

  // Settings button in bottom nav
  if (e.target.closest("#settings-toggle")) {
    if (store.currentPage === "settings") {
      // If already on settings page, show only menu
      store.showOnlySettingsMenu = true;
      store.showSettingsMenu = true;
    } else {
      store.currentPage = "settings";
      store.activeSetting = "color-theme";
      store.showSettingsMenu = true;
      store.showOnlySettingsMenu = true;
    }
    render();
    return;
  }
});

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
    const isTagsActive = store.showSidebarOnTablet || store.tagFilter !== null;
    app.innerHTML = `
      ${Sidebar(allTags, store.view)}
      <main>
        ${SearchBar()}
        <div class="layout">
          ${Settings(store.activeSetting, store.showSettingsMenu, store.showOnlySettingsMenu)}
        </div>
      </main>
      ${BottomNav(allTags, store.view, isTagsActive)}
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
  const isTagsActive = store.showSidebarOnTablet || store.tagFilter !== null;
  app.innerHTML = `
    ${Sidebar(allTags, store.view)}
    <main>
      ${!isMobileOrTablet ? SearchBar() : ""}
      <div class="layout">
        ${isMobileOrTablet && store.showSearchBar ? SearchBar(true) : ""}
        ${
          !isMobileOrTablet || !activeNote
            ? NotesList(notes, store.activeNoteId, store.view)
            : ""
        }
        ${NoteView(activeNote)}
        ${!isMobileOrTablet ? NoteActionsSidebar(activeNote) : ""}
      </div>
    </main>
    ${BottomNav(allTags, store.view, isTagsActive)}
  `;

  app.className = store.showSidebarOnTablet ? "show-sidebar-tablet" : "";

  attachEvents();
  
  // Update logo after render to ensure it matches current theme
  const currentTheme = store.settings.colorTheme || "system";
  const darkMode = isDarkMode(currentTheme);
  updateLogo(darkMode);
};

const attachEvents = () => {
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

  document.getElementById("create-note")?.addEventListener("click", createNoteHandler);
  document.getElementById("create-note-fab")?.addEventListener("click", createNoteHandler);

  document.querySelectorAll(".note-card").forEach((card) => {
    card.onclick = () => {
      store.activeNoteId = card.dataset.id;
      render();
    };
  });

  // Note view back button (mobile/tablet)
  document.getElementById("note-view-back")?.addEventListener("click", () => {
    store.activeNoteId = null;
    render();
  });

  // Header action buttons (mobile/tablet)
  document.getElementById("delete-note-header")?.addEventListener("click", () => {
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
          store.notes = store.notes.filter((n) => n.id !== store.activeNoteId);
          store.activeNoteId = null;
          saveState();
          render();
          showToast("Note permanently deleted.");
        }
      );
    }
  });

  document.getElementById("archive-note-header")?.addEventListener("click", () => {
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
            showToast(
              "Note archived.",
              true,
              "Archived Notes",
              () => {
                store.view = "ARCHIVED";
                render();
              }
            );
          }
        );
      }
    }
  });

  document.getElementById("cancel-note-header")?.addEventListener("click", () => {
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
        showToast(
          "Note archived.",
          true,
          "Archived Notes",
          () => {
            store.view = "ARCHIVED";
            render();
          }
        );
      }
    );
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
        store.showSettingsMenu = false;
        store.showOnlySettingsMenu = false;
        render();
      });
    });

    // Back button to return to settings menu
    document.getElementById("settings-back-btn")?.addEventListener("click", () => {
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
        applyColorTheme(selectedTheme);
        // Update selected state visually
        document.querySelectorAll(".settings-view__option").forEach((opt) => {
          opt.classList.remove("settings-view__option--selected");
        });
        document.querySelector('input[name="color-theme"]:checked')
          ?.closest(".settings-view__option")
          ?.classList.add("settings-view__option--selected");
        showToast("Settings updated successfully!");
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
        applyFontTheme(selectedFont);
        // Update selected state visually
        document.querySelectorAll(".settings-view__option").forEach((opt) => {
          opt.classList.remove("settings-view__option--selected");
        });
        document.querySelector('input[name="font-theme"]:checked')
          ?.closest(".settings-view__option")
          ?.classList.add("settings-view__option--selected");
        showToast("Settings updated successfully!");
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

render();
