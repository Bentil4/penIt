import { store } from "./state/store.js";

// Function to apply font theme
export const applyFontTheme = (fontName) => {
  // Set data-font attribute on html element for CSS targeting
  document.documentElement.setAttribute("data-font", fontName);

  // Apply font family directly to all elements
  // Using exact font names that match @font-face declarations
  const fontMap = {
    Inter: '"Inter", sans-serif',
    "Noto Serif": '"Noto Serif", serif',
    "Source Code Pro": '"Source Code Pro", monospace',
  };
  const fontFamily = fontMap[fontName] || fontMap["Inter"];

  // Apply to html element (will cascade to all children)
  document.documentElement.style.setProperty(
    "font-family",
    fontFamily,
    "important"
  );

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
export const isDarkMode = (themeName) => {
  if (themeName === "dark") return true;
  if (themeName === "light") return false;
  if (themeName === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
};

// Function to update logo based on theme
export const updateLogo = (isDark) => {
  const logos = document.querySelectorAll(
    ".logo, .login__logo, .forgot__logo, .reset__logo, .notes-list__logo, .note-view__logo, .search-view__logo"
  );
  logos.forEach((logo) => {
    if (logo) {
      const currentSrc = logo.getAttribute("src");
      if (isDark) {
        // Change to logo-light.svg for dark mode
        if (currentSrc && currentSrc.includes("logo.svg")) {
          logo.setAttribute(
            "src",
            currentSrc.replace("logo.svg", "logo-light.svg")
          );
        }
      } else {
        // Change to logo.svg for light mode
        if (currentSrc && currentSrc.includes("logo-light.svg")) {
          logo.setAttribute(
            "src",
            currentSrc.replace("logo-light.svg", "logo.svg")
          );
        }
      }
    }
  });
};

// Function to apply color theme
export const applyColorTheme = (themeName) => {
  // Validate theme name
  const validThemes = ["light", "dark", "system"];
  if (!validThemes.includes(themeName)) {
    console.warn(
      `Invalid theme name: ${themeName}. Using 'system' as fallback.`
    );
    themeName = "system";
  }

  // Remove existing theme classes
  document.documentElement.classList.remove(
    "theme-light",
    "theme-dark",
    "theme-system"
  );

  // Set data-theme attribute for CSS targeting
  document.documentElement.setAttribute("data-theme", themeName);

  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    const colors = {
      light: "#ffffff",
      dark: "#1a1a1a",
      system: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "#1a1a1a"
        : "#ffffff",
    };
    metaThemeColor.setAttribute("content", colors[themeName] || colors.system);
  }

  // Update logo
  const darkMode = isDarkMode(themeName);
  updateLogo(darkMode);
};

// Function to initialize theme
export const initializeTheme = () => {
  // Get theme from store, default to "system" if not set
  const theme = store.settings.colorTheme || "system";
  applyColorTheme(theme);

  // Apply font theme if set
  if (store.settings.fontTheme) {
    applyFontTheme(store.settings.fontTheme);
  }
};
