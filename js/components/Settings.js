import { SettingsView } from "./SettingsView.js";
import { store } from "../state/store.js";

export const Settings = (activeSetting = "color-theme") => {
  const settingsMenu = [
    {
      id: "color-theme",
      label: "Color Theme",
      icon: "../assets/images/icon-sun.svg",
    },
    {
      id: "font-theme",
      label: "Font Theme",
      icon: "../assets/images/icon-font.svg",
    },
    {
      id: "change-password",
      label: "Change Password",
      icon: "../assets/images/icon-lock.svg",
    },
    {
      id: "logout",
      label: "Logout",
      icon: "../assets/images/icon-logout.svg",
    },
  ];

  return `
    <div class="settings">
      <div class="settings__menu">
        <h2 class="settings__title">Settings</h2>
        <ul class="settings__list">
          ${settingsMenu
            .map(
              (item) => `
            <li class="settings__item ${
              activeSetting === item.id ? "settings__item--active" : ""
            }" data-setting="${item.id}">
              <div class="settings__item-content">
                <img src="${item.icon}" alt="${item.label}" class="settings__item-icon" />
                <span class="settings__item-label">${item.label}</span>
              </div>
              <img src="../assets/images/icon-chevron-right.svg" alt="Arrow" class="settings__item-arrow" />
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
      <div class="settings__content">
        ${SettingsView(activeSetting, store.settings)}
      </div>
    </div>
  `;
};

