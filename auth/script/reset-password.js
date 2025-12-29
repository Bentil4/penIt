// Theme management for reset password page
const SETTINGS_STORAGE_KEY = "notes_app_settings";

// Helper function to get saved theme or default to system
const getTheme = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.colorTheme || "system";
    }
  } catch (e) {
    // Ignore errors
  }
  return "system";
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
  const logos = document.querySelectorAll('.reset__logo');
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
  const validThemes = ["light", "dark", "system"];
  if (!validThemes.includes(themeName)) {
    themeName = "system";
  }
  
  document.documentElement.setAttribute("data-theme", themeName);
  
  // Update logo based on theme
  const darkMode = isDarkMode(themeName);
  updateLogo(darkMode);
  
  // For system theme, listen to prefers-color-scheme changes
  if (themeName === "system") {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e) => {
      updateLogo(e.matches);
      void document.body.offsetHeight;
    };
    
    if (window.systemThemeListener) {
      mediaQuery.removeEventListener("change", window.systemThemeListener);
    }
    
    window.systemThemeListener = handleSystemThemeChange;
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    handleSystemThemeChange(mediaQuery);
  } else {
    if (window.systemThemeListener) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.removeEventListener("change", window.systemThemeListener);
      window.systemThemeListener = null;
    }
  }
  
  void document.body.offsetHeight;
};

// Initialize theme on page load
const initializeTheme = () => {
  const theme = getTheme();
  applyColorTheme(theme);
};

// Apply theme initialization
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeTheme);
} else {
  initializeTheme();
}

const form = document.getElementById("resetForm");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const toggles = document.querySelectorAll(".reset__toggle");

toggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const input = toggle.previousElementSibling;
    input.type = input.type === "password" ? "text" : "password";
    toggle.querySelector("img").src =
      input.type === "password"
        ? "../assets/images/icon-hide-password.svg"
        : "../assets/images/icon-show-password.svg";
  });
});

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (password.value.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (password.value !== confirmPassword.value) {
      alert("Passwords do not match.");
      return;
    }

    alert("Password successfully reset!");
  });
}
