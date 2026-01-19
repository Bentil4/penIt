export const Modal = ({
  type,
  title,
  description,
  icon,
  confirmText,
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  const modalId = `modal-${type}`;

  return `
    <section class="modal-overlay" id="${modalId}-overlay">
      <div class="modal">
        <div class="modal__header">
          <img src="${icon}" alt="${title}" class="modal__icon" />
          <h3 class="modal__title">${title}</h3>
        </div>
        <p class="modal__description">${description}</p>
        <div class="modal__actions">
          <button class="modal__button modal__button--secondary" id="${modalId}-cancel">
            ${cancelText}
          </button>
          <button class="modal__button modal__button--${type === "delete" ? "danger" : "primary"}" id="${modalId}-confirm">
            ${confirmText}
          </button>
        </div>
      </div>
    </section>
  `;
};

export const showModal = (
  type,
  title,
  description,
  icon,
  confirmText,
  onConfirm,
) => {
  // Removing any existing modal
  const existingModal = document.querySelector(".modal-overlay");
  if (existingModal) {
    existingModal.remove();
  }

  const modalId = `modal-${type}`;
  const modalHTML = Modal({
    type,
    title,
    description,
    icon,
    confirmText,
    onConfirm,
    onCancel: () => hideModal(modalId),
  });

  // Insert modal into body
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Add event listeners
  const overlay = document.getElementById(`${modalId}-overlay`);
  const confirmBtn = document.getElementById(`${modalId}-confirm`);
  const cancelBtn = document.getElementById(`${modalId}-cancel`);

  // Confirm action
  confirmBtn?.addEventListener("click", () => {
    if (onConfirm) {
      onConfirm();
    }
    hideModal(modalId);
  });

  // Cancel action
  cancelBtn?.addEventListener("click", () => {
    hideModal(modalId);
  });

  // Close on overlay click
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) {
      hideModal(modalId);
    }
  });

  // Close with Escape key
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      hideModal(modalId);
      document.removeEventListener("keydown", handleEscape);
    }
  };
  document.addEventListener("keydown", handleEscape);

  // Animate in
  setTimeout(() => {
    overlay?.classList.add("modal-overlay--active");
  }, 10);
};

export const hideModal = (modalId) => {
  const overlay = document.getElementById(`${modalId}-overlay`);
  if (overlay) {
    overlay.classList.remove("modal-overlay--active");
    setTimeout(() => {
      overlay.remove();
    }, 200);
  }
};

// showInputModal({ title, label, placeholder, icon, confirmText, cancelText, onConfirm })
// Renders a modal containing a single text input and Confirm/Cancel buttons.
// Calls onConfirm(value) iff value.trim() is non-empty.
export const showInputModal = ({
  title,
  label = "Value",
  placeholder = "",
  icon = "../assets/images/icon-tag.svg",
  confirmText = "Create",
  cancelText = "Cancel",
  onConfirm,
} = {}) => {
  // Remove any existing modal
  const existing = document.querySelector(".modal-overlay");
  if (existing) existing.remove();

  const modalId = `modal-input-${Date.now()}`;
  const inputId = `${modalId}-input`;
  const html = `
    <section class="modal-overlay" id="${modalId}-overlay">
      <div class="modal">
        <div class="modal__header">
          ${icon ? `<img src="${icon}" alt="${title}" class="modal__icon" />` : ""}
          <h3 class="modal__title">${title}</h3>
        </div>
        <div class="modal__field">
          <label for="${inputId}" class="modal__label">${label}</label>
          <input id="${inputId}" class="modal__input" type="text" placeholder="${placeholder}" />
        </div>
        <div class="modal__actions">
          <button class="modal__button modal__button--secondary" id="${modalId}-cancel">${cancelText}</button>
          <button class="modal__button modal__button--primary" id="${modalId}-confirm">${confirmText}</button>
        </div>
      </div>
    </section>
  `;

  // Inject
  document.body.insertAdjacentHTML("beforeend", html);

  // Hook up elements
  const overlay = document.getElementById(`${modalId}-overlay`);
  const input = document.getElementById(inputId);
  const confirmBtn = document.getElementById(`${modalId}-confirm`);
  const cancelBtn = document.getElementById(`${modalId}-cancel`);

  // Focus input on open
  setTimeout(() => input?.focus(), 0);

  // Close helpers
  const close = () => {
    overlay?.classList.remove("modal-overlay--active");
    setTimeout(() => overlay?.remove(), 200);
    document.removeEventListener("keydown", escHandler);
  };
  const escHandler = (e) => {
    if (e.key === "Escape") close();
  };
  document.addEventListener("keydown", escHandler);

  // Confirm handler
  const confirm = () => {
    const value = input?.value?.trim() ?? "";
    if (!value) {
      input?.classList.add("modal__input--error");
      input?.focus();
      return;
    }
    if (onConfirm) onConfirm(value);
    close();
  };

  // Wire events
  confirmBtn?.addEventListener("click", confirm);
  cancelBtn?.addEventListener("click", close);
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  input?.addEventListener("input", () =>
    input.classList.remove("modal__input--error"),
  );
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirm();
    }
  });

  // Animate in
  setTimeout(() => overlay?.classList.add("modal-overlay--active"), 10);
};
