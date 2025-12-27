const toggleBtn = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const toggleIcon = toggleBtn.querySelector("img");

toggleBtn.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  toggleIcon.src = isPassword 
    ? "../assets/images/icon-hide-password.svg"
    : "../assets/images/icon-show-password.svg";
});

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Login submitted!");
});
