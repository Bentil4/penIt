export const SettingsView = (activeSetting, currentSettings = {}) => {
  switch (activeSetting) {
    case "color-theme":
      return ColorThemeView(currentSettings.colorTheme || "light");
    case "font-theme":
      return FontThemeView(currentSettings.fontTheme || "Inter");
    case "change-password":
      return ChangePasswordView();
    case "logout":
      return LogoutView();
    default:
      return ColorThemeView(currentSettings.colorTheme || "light");
  }
};


// Theme View
const ColorThemeView = (currentTheme = "light") => {
  const isLight = currentTheme === "light";
  const isDark = currentTheme === "dark";
  const isSystem = currentTheme === "system";

  return `
    <div class="settings-view">
      <button class="settings-view__back" id="settings-back-btn">
        <img src="../assets/images/icon-arrow-left.svg" alt="Back" />
      </button>
      <h2 class="settings-view__title">Color Theme</h2>
      <p class="settings-view__description">Choose your color theme:</p>
      
      <div class="settings-view__options">
        <label class="settings-view__option ${isLight ? "settings-view__option--selected" : ""}">
          <input 
            type="radio" 
            name="color-theme" 
            value="light" 
            class="settings-view__radio"
            ${isLight ? "checked" : ""}
          />
          <div class="settings-view__option-content">
            <img 
              src="../assets/images/icon-sun.svg" 
              alt="Light Mode" 
              class="settings-view__option-icon"
            />
            <div class="settings-view__option-text">
              <span class="settings-view__option-label">Light Mode</span>
              <span class="settings-view__option-description">Pick a clean and classic light theme</span>
            </div>
          </div>
        </label>

        <label class="settings-view__option ${isDark ? "settings-view__option--selected" : ""}">
          <input 
            type="radio" 
            name="color-theme" 
            value="dark" 
            class="settings-view__radio"
            ${isDark ? "checked" : ""}
          />
          <div class="settings-view__option-content">
            <img 
              src="../assets/images/icon-moon.svg" 
              alt="Dark Mode" 
              class="settings-view__option-icon"
            />
            <div class="settings-view__option-text">
              <span class="settings-view__option-label">Dark Mode</span>
              <span class="settings-view__option-description">Select a sleek and modern dark theme</span>
            </div>
          </div>
        </label>

        <label class="settings-view__option ${isSystem ? "settings-view__option--selected" : ""}">
          <input 
            type="radio" 
            name="color-theme" 
            value="system" 
            class="settings-view__radio"
            ${isSystem ? "checked" : ""}
          />
          <div class="settings-view__option-content">
            <img 
              src="../assets/images/icon-system-theme.svg" 
              alt="System" 
              class="settings-view__option-icon"
            />
            <div class="settings-view__option-text">
              <span class="settings-view__option-label">System</span>
              <span class="settings-view__option-description">Adapts to your device's theme</span>
            </div>
          </div>
        </label>
      </div>

      <div class="settings-view__actions">
        <button class="settings-view__button settings-view__button--primary" id="apply-color-theme">
          Apply Changes
        </button>
      </div>
    </div>
  `;
};


//Font View
const FontThemeView = (currentFont = "Inter") => {
  const isSansSerif = currentFont === "Inter";
  const isSerif = currentFont === "Noto Serif";
  const isMonospace = currentFont === "Source Code Pro";

  return `
    <div class="settings-view">
      <button class="settings-view__back" id="settings-back-btn">
        <img src="../assets/images/icon-arrow-left.svg" alt="Back" />
      </button>
      <h2 class="settings-view__title">Font Theme</h2>
      <p class="settings-view__description">Choose your font theme:</p>
      
      <div class="settings-view__options">
        <label class="settings-view__option ${isSansSerif ? "settings-view__option--selected" : ""}">
          <input 
            type="radio" 
            name="font-theme" 
            value="Inter" 
            class="settings-view__radio"
            ${isSansSerif ? "checked" : ""}
          />
          <div class="settings-view__option-content">
            <img 
              src="../assets/images/icon-font-sans-serif.svg" 
              alt="Sans Serif" 
              class="settings-view__option-icon"
            />
            <div class="settings-view__option-text">
              <span class="settings-view__option-label">Sans Serif</span>
              <span class="settings-view__option-description">Modern and clean</span>
            </div>
          </div>
        </label>

        <label class="settings-view__option ${isSerif ? "settings-view__option--selected" : ""}">
          <input 
            type="radio" 
            name="font-theme" 
            value="Noto Serif" 
            class="settings-view__radio"
            ${isSerif ? "checked" : ""}
          />
          <div class="settings-view__option-content">
            <img 
              src="../assets/images/icon-font-serif.svg" 
              alt="Serif" 
              class="settings-view__option-icon"
            />
            <div class="settings-view__option-text">
              <span class="settings-view__option-label">Serif</span>
              <span class="settings-view__option-description">Traditional and elegant</span>
            </div>
          </div>
        </label>

        <label class="settings-view__option ${isMonospace ? "settings-view__option--selected" : ""}">
          <input 
            type="radio" 
            name="font-theme" 
            value="Source Code Pro" 
            class="settings-view__radio"
            ${isMonospace ? "checked" : ""}
          />
          <div class="settings-view__option-content">
            <img 
              src="../assets/images/icon-font-monospace.svg" 
              alt="Monospace" 
              class="settings-view__option-icon"
            />
            <div class="settings-view__option-text">
              <span class="settings-view__option-label">Monospace</span>
              <span class="settings-view__option-description">Fixed-width for code and technical writing</span>
            </div>
          </div>
        </label>
      </div>

      <div class="settings-view__actions">
        <button class="settings-view__button settings-view__button--primary" id="apply-font-theme">
          Apply Changes
        </button>
      </div>
    </div>
  `;
};

const ChangePasswordView = () => {
  return `
    <div class="settings-view">
      <button class="settings-view__back" id="settings-back-btn">
        <img src="../assets/images/icon-arrow-left.svg" alt="Back" />
      </button>
      <h2 class="settings-view__title">Change Password</h2>
      <p class="settings-view__description">Update your account password:</p>
      
      <form class="settings-view__form" id="change-password-form">
        <div class="settings-view__field">
          <label class="settings-view__field-label">Current Password</label>
          <input 
            type="password" 
            class="settings-view__field-input" 
            id="current-password"
            required
          />
        </div>

        <div class="settings-view__field">
          <label class="settings-view__field-label">New Password</label>
          <input 
            type="password" 
            class="settings-view__field-input" 
            id="new-password"
            required
          />
        </div>

        <div class="settings-view__field">
          <label class="settings-view__field-label">Confirm New Password</label>
          <input 
            type="password" 
            class="settings-view__field-input" 
            id="confirm-password"
            required
          />
        </div>

        <div class="settings-view__actions">
          <button type="submit" class="settings-view__button settings-view__button--primary">
            Update Password
          </button>
        </div>
      </form>
    </div>
  `;
};

const LogoutView = () => {
  return `
    <div class="settings-view">
      <button class="settings-view__back" id="settings-back-btn">
        <img src="../assets/images/icon-arrow-left.svg" alt="Back" />
      </button>
      <h2 class="settings-view__title">Logout</h2>
      <p class="settings-view__description">Are you sure you want to logout?</p>
      
      <div class="settings-view__actions">
        <button class="settings-view__button settings-view__button--primary" id="confirm-logout">
          Logout
        </button>
      </div>
    </div>
  `;
};

