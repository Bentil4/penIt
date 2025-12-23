export const Sidebar = (tags, activeView) => `
<aside class="sidebar">
  <img src=".././assets/images/logo.svg" alt="Logo" class="logo" />

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
