export const Sidebar = (
  tags,
  activeView,
  categories = [],
  activeCategory = null,
) => `
<aside class="sidebar">
  <section role="heading" aria-level="1" class="mobile-view__header">
        <img src="./assets/images/logo-light.svg" alt="Logo" class="search-view__logo" />
    </section>

    <section role="heading" aria-level="1" class="desktop-view__header">
        <img src="./assets/images/logo-light.svg" alt="Logo" class="search-view__logo" />
    </section>

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

<h4>Categories</h4>
 <div class="tags">
   ${
     categories.length === 0
       ? `<span style="opacity:.6;">No categories yet</span>`
       : categories
           .map(
             (cat) => `
            <section class="tag category">
              <img class="tag-icon" src=".././assets/images/icon-tag.svg">
              <span data-category="${cat}" class="${activeCategory === cat ? "active" : ""}">${cat}</span>
            </section>`,
           )
           .join("")
   }
  </div>
  <div style="margin: .5rem 0 1rem;">
    <button id="add-category-btn" class="btn btn--secondary" style="width:100%;">+ New Category</button>
  </div>


  <h4>Tags</h4>
  <div class="tags">
    ${tags
      .map(
        (tag) =>
          `<section class="tag">
            <img class="tag-icon" src=".././assets/images/icon-tag.svg">
            <span data-tag="${tag}">${tag}</span>
          </section>`,
      )
      .join("")}
  </div>
</aside>
`;
