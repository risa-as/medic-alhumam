import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1A5276",
          hover: "#154360",
          light: "#D6EAF8",
        },
        surface: "#FFFFFF",
        "app-bg": "#F0F4F8",
        sidebar: {
          DEFAULT: "#0D2137",
          hover: "#1A3A52",
          active: "#1A5276",
        },
        border: {
          DEFAULT: "#D5DCE8",
          light: "#EAF0F6",
        },
        txt: {
          DEFAULT: "#0D1B2A",
          secondary: "#5A6A7E",
          muted: "#94A3B8",
        },
        state: {
          success: "#1A7F5A",
          "success-light": "#D1FAE5",
          danger: "#B91C1C",
          "danger-light": "#FEE2E2",
          warning: "#B45309",
          "warning-light": "#FEF3C7",
          info: "#1D4ED8",
          "info-light": "#DBEAFE",
        },
      },
      borderRadius: {
        none: "0px",
        sm: "3px",
        DEFAULT: "4px",
        md: "4px",
        lg: "5px",
        xl: "5px",
        "2xl": "5px",
        "3xl": "5px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(13,27,42,0.08)",
        DEFAULT: "0 2px 8px rgba(13,27,42,0.10)",
        md: "0 2px 8px rgba(13,27,42,0.10)",
        lg: "0 4px 16px rgba(13,27,42,0.14)",
      },
      fontFamily: {
        sans: ["var(--font-app)", '"Segoe UI"', "Tahoma", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
