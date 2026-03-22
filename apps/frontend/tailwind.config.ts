import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#0b1220",
        card: "#101826",
        ink: "#e5edf8",
        muted: "#90a1b9",
        accent: "#5eead4",
        accent2: "#8b5cf6",
        danger: "#f87171",
        warning: "#fbbf24",
        success: "#34d399",
      },
      boxShadow: {
        glow: "0 20px 60px rgba(94, 234, 212, 0.15)",
      },
      backgroundImage: {
        "dashboard-grid":
          "radial-gradient(circle at top, rgba(94,234,212,0.12), transparent 28%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        "dashboard-grid": "auto, 32px 32px, 32px 32px",
      },
    },
  },
  plugins: [],
} satisfies Config;

