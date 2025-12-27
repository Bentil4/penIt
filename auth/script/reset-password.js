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
