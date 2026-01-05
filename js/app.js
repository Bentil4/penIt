import notesData from "./data/notes.js";
import { store, loadState } from "./state/store.js";
import { initializeTheme } from "./themes.js";
import { render } from "./render.js";

loadState(notesData);

// Applying theme initialization
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeTheme);
} else {
  initializeTheme();
}

// Global event delegation for settings buttons
document.addEventListener("click", (e) => {
  // Settings button in search bar
  if (e.target.closest(".section-settings img[src*='icon-settings']")) {
    const isDesktop = window.innerWidth >= 1024;
    if (store.currentPage === "settings") {
      // show menu and view on desktop on settings page,
      if (isDesktop) {
        store.showSettingsMenu = true;
        store.showOnlySettingsMenu = false;
      } else {
        store.showOnlySettingsMenu = false;
        store.showSettingsMenu = true;
      }
    } else {
      store.currentPage = "settings";
      store.activeSetting = "color-theme";
      if (isDesktop) {
        store.showSettingsMenu = true;
        store.showOnlySettingsMenu = false;
      } else {
        store.showSettingsMenu = true;
        store.showOnlySettingsMenu = false;
      }
    }
    render();
    return;
  }

  // Settings button in bottom nav
  if (e.target.closest("#settings-toggle")) {
    const isDesktop = window.innerWidth >= 1024;
    if (store.currentPage === "settings") {
      // show menu and view on desktop on settings page,
      if (isDesktop) {
        store.showSettingsMenu = true;
        store.showOnlySettingsMenu = false;
      } else {
        store.showOnlySettingsMenu = true;
        store.showSettingsMenu = true;
      }
    } else {
      store.currentPage = "settings";
      store.activeSetting = "color-theme";
      if (isDesktop) {
        store.showSettingsMenu = true;
        store.showOnlySettingsMenu = false;
      } else {
        store.showSettingsMenu = true;
        store.showOnlySettingsMenu = true;
      }
    }
    render();
    return;
  }
});

render();
