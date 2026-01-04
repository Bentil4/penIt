import { Button } from "./Button.js";

export const BottomNav = (
  tags,
  activeView,
  isTagsActive,
  isSearchActive = false,
  isSettingsActive
) => `
  <nav class="bottom-nav">
    <div class="nav-buttons">
      <button class="nav-btn ${
        activeView === "ALL" ? "active" : ""
      }" data-view="ALL">
        <img src="./assets/images/icon-home.svg" alt="All Notes" />
        <span>All Notes</span>
      </button>
      <button class="nav-btn search-btn ${
        activeView === "SEARCH" ? "active" : ""
      }" id="search-toggle" data-view="SEARCH">
        <img src="./assets/images/icon-search.svg" alt="Search" />
        <span>Search</span>
      </button>
      <button class="nav-btn ${
        activeView === "ARCHIVED" ? "active" : ""
      }" data-view="ARCHIVED">
        <img src="./assets/images/icon-archive.svg" alt="Archived" />
        <span>Archived</span>
      </button>
      <button class="nav-btn tags-btn ${
        activeView === "TAGS" ? "active" : ""
      }" data-view="TAGS" id="tags-toggle">
        <img src="./assets/images/icon-tag.svg" alt="Tags" />
        <span>Tags</span>
      </button>
      <button class="nav-btn settings-btn  ${
        isSettingsActive === "SETTINGS" ? "active" : ""
      }" data-view="SETTINGS" id="settings-toggle">
        <img src="./assets/images/icon-settings.svg" alt="Settings" />
        <span>Settings</span>
      </button>
    </div>
  </nav>
`;
