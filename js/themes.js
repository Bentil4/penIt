import { store } from "./state/store.js";

// applying font theme
export const applyFontTheme = (fontName) => {
  document.documentElement.setAttribute("data-font", fontName);

  // Applying font family to all elements
  const fontMap = {
    Inter: '"Inter", sans-serif',
    "Noto Serif": '"Noto Serif", serif',
    "Source Code Pro": '"Source Code Pro", monospace',
  };
  const fontFamily = fontMap[fontName] || fontMap["Inter"];

  document.documentElement.style.setProperty("font-family", fontFamily);

  document.body.style.setProperty("font-family", fontFamily);

  // Applying to all elements using a style tag for maximum coverage
  let styleElement = document.getElementById("dynamic-font-style");
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = "dynamic-font-style";
    document.head.appendChild(styleElement);
  }
  styleElement.textContent = `
    html[data-font="${fontName}"] *,
    html[data-font="${fontName}"] {
      font-family: ${fontFamily};
    }
  `;

  void document.body.offsetHeight;
};

// checking if page is in dark mode
export const isDarkMode = (themeName) => {
  if (themeName === "dark") return true;
  if (themeName === "light") return false;
  if (themeName === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
};

// updating logo to match theme
export const updateLogo = (isDark) => {
  const logos = document.querySelectorAll(
    ".logo, .login__logo, .forgot__logo, .reset__logo, .notes-list__logo, .note-view__logo, .search-view__logo"
  );
  logos.forEach((logo) => {
    if (logo) {
      const currentSrc = logo.getAttribute("src");
      if (isDark) {
        if (currentSrc && currentSrc.includes("logo.svg")) {
          logo.setAttribute(
            "src",
            currentSrc.replace("logo.svg", "logo-light.svg")
          );
        }
      } else {
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

//applying color theme
export const applyColorTheme = (themeName) => {
  const validThemes = ["light", "dark", "system"];
  if (!validThemes.includes(themeName)) {
    console.warn(
      `Invalid theme name: ${themeName}. Using 'system' as fallback.`
    );
    themeName = "system";
  }

  // Removing existing theme classes
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

//initialize theme
export const initializeTheme = () => {
  const theme = store.settings.colorTheme || "system";
  applyColorTheme(theme);

  if (store.settings.fontTheme) {
    applyFontTheme(store.settings.fontTheme);
  }
};
