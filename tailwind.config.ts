import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        primary: {
          DEFAULT: "#1e40af", // Indigo/Blue
          hover: "#1d4ed8",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f1f5f9",
          hover: "#e2e8f0",
          foreground: "#0f172a",
        },
        accent: {
          DEFAULT: "#0284c7",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#16a34a",
          foreground: "#ffffff",
          subtle: "#dcfce7",
          text: "#15803d",
        },
        warning: {
          DEFAULT: "#d97706",
          foreground: "#ffffff",
          subtle: "#fef3c7",
          text: "#b45309",
        },
        danger: {
          DEFAULT: "#dc2626",
          foreground: "#ffffff",
          subtle: "#fee2e2",
          text: "#b91c1c",
        },
      },
    },
  },
  plugins: [],
};
export default config;
