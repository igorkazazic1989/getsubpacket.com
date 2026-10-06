import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F3F4F1", // drywall
        ink: "#1E2B33", // slate
        pencil: "#F2C230", // carpenter-pencil yellow, the one loud colour
        line: "#D5D9D3",
        ok: "#2E7D4F",
        warn: "#A86B12",
        bad: "#B8392B",
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Narrow", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: { prose: "68ch" },
    },
  },
  plugins: [],
};
export default config;
