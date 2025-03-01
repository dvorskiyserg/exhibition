// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ["Inter", "sans-serif"], // Основний шрифт для тексту
//         serif: ["Playfair Display", "serif"], // Для заголовків
//         montserrat: ["Montserrat", "sans-serif"], // Акцентний
//       },
//       colors: {
//         primary: "var(--color-primary)", // Використання CSS-змінної
//         secondary: "var(--color-secondary)",
//         accent: "var(--color-accent)",
//         danger: "var(--color-danger)",
//         success: "var(--color-success)",
//       },
//     },
//   },
//   plugins: [require("@tailwindcss/forms")],
// };
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        danger: "var(--color-danger)",
        success: "var(--color-success)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
