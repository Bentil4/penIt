export const SearchBar = (isMobile = false) => {
  const searchImg = "./assets/images/icon-search.svg";
  const settingsImg = "./assets/images/icon-settings.svg";
  if (isMobile) {
    return `
    <section class="search-bar mobile">
    <div role="heading" aria-level="1" class="mobile-view__header">
        <img src="./assets/images/logo-light.svg" alt="Logo" class="search-view__logo" />
    </div>
    </section>
    `;
  } else {
    return `
<section class="search-bar">
<p>All Note</p>
<section class="section-settings">
<button id="export-notes-top" class="btn btn--secondary" style="margin-left:.5rem;">Export</button>
 <button id="import-notes-top" class="btn btn--secondary" style="margin-left:.25rem;">Import</button>
  <label for="search-input">
    <img src="${searchImg}" class="search-icon"/>
    <input
      id="search-input"
      class="search-input"
      placeholder="Search by title, content, or tags..."
    />
  </label>
  <img src="${settingsImg}"class="settings-icon" />



</section>
</section>
    `;
  }
};
