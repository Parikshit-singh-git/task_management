/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: "#27272a",
        input: "#27272a",
        ring: "#10b981",
        background: "#09090b",
        foreground: "#f4f4f5",
        primary: {
          DEFAULT: "#10b981",
          foreground: "#f4f4f5",
        },
        secondary: {
          DEFAULT: "#27272a",
          foreground: "#f4f4f5",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#f4f4f5",
        },
        muted: {
          DEFAULT: "#27272a",
          foreground: "#a1a1aa",
        },
        accent: {
          DEFAULT: "#f59e0b",
          foreground: "#f4f4f5",
        },
        popover: {
          DEFAULT: "#18181b",
          foreground: "#f4f4f5",
        },
        card: {
          DEFAULT: "#18181b",
          foreground: "#f4f4f5",
        },
      },
    },
  },
  plugins: [],
}
