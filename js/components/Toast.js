export const showToast = (
  message,
  actionLink = null,
  actionText = null,
  onActionClick = null
) => {
  // Removing existing toasts
  const existingToasts = document.querySelectorAll(".toast");
  existingToasts.forEach((toast) => {
    toast.classList.remove("toast--active");
    setTimeout(() => toast.remove(), 300);
  });

  const toastId = `toast-${Date.now()}`;

  // Build action link if provided
  let actionLinkHTML = "";
  if (actionLink && actionText) {
    actionLinkHTML = ` <a href="#" class="toast__action" id="${toastId}-action">${actionText}</a>`;
  }

  const toastHTML = `
    <section class="toast" id="${toastId}">
      <div class="toast__icon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="toast__message">
        ${message}${actionLinkHTML}
      </div>
      <button class="toast__close" id="${toastId}-close" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </section>
  `;

  // Creating toast container if no toast container exist
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  // Appending toast to body
  toastContainer.insertAdjacentHTML("beforeend", toastHTML);

  const toast = document.getElementById(toastId);
  const closeBtn = document.getElementById(`${toastId}-close`);
  const actionBtn = document.getElementById(`${toastId}-action`);

  // Show toast with animation
  setTimeout(() => {
    toast?.classList.add("toast--active");
  }, 10);

  // Close button handler
  closeBtn?.addEventListener("click", () => {
    hideToast(toastId);
  });

  // Action link handler
  if (actionBtn && onActionClick) {
    actionBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (onActionClick) {
        onActionClick();
      }
      hideToast(toastId);
    });
  }

  // Auto-hide toast container
  const autoHideTimer = setTimeout(() => {
    hideToast(toastId);
  }, 5000);

  // Store timer on toast element so we can clear it if manually closed
  if (toast) {
    toast._autoHideTimer = autoHideTimer;
  }
};

export const hideToast = (toastId) => {
  const toast = document.getElementById(toastId);
  if (toast) {
    if (toast._autoHideTimer) {
      clearTimeout(toast._autoHideTimer);
    }

    toast.classList.remove("toast--active");
    setTimeout(() => {
      toast.remove();

      const container = document.getElementById("toast-container");
      if (container && container.children.length === 0) {
        container.remove();
      }
    }, 300);
  }
};
