export const Sidebar = (tags, activeView) => `
<aside class="sidebar">
  <div role="heading" aria-level="1" class="mobile-view__header">
        <img src="./assets/images/logo-light.svg" alt="Logo" class="search-view__logo" />
    </div>

  <ul class="menu">
    <li data-view="ALL" class="${activeView === "ALL" ? "active" : ""}">
      All Notes
    </li>
    <li data-view="ARCHIVED" class="${
      activeView === "ARCHIVED" ? "active" : ""
    }">
      Archived Notes
    </li>
  </ul>

  <h4>Tags</h4>
  <div class="tags">
    ${tags
      .map(
        (tag) =>
          `<section class="tag">
            <img class="tag-icon" src=".././assets/images/icon-tag.svg">
            <span data-tag="${tag}">${tag}</span>
          </section>`
      )
      .join("")}
  </div>
</aside>
`;
