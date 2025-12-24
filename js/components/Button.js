export const Button = ({ label, id, variant = "primary" }) => `
  <button id="${id}" class="btn btn--${variant}">
    ${label}
  </button>
`;
