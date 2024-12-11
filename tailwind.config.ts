import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "simmpy-green": "#6AB04C",
        "simmpy-yellow": "#F9CA24",
        "simmpy-red": "#c13f0b",
        "simmpy-gray-100": "#E1E1E6",
        "simmpy-gray-200": "#5E5E5E",
        "simmpy-gray-600": "#444444",
        "simmpy-gray-800": "#2B2B2B",
        "simmpy-gray-900": "#121214",
      },
      fontFamily: {
        montserrat: ["var(--font-montserrant)"],
        lato: ["var(--font-lato)"],
      },
    },
    keyframes: {
      grow: {
        "0%": { transform: "scale(0)", opacity: "0" },
        "100%": { transform: "scale(1)", opacity: "1" },
      },
      shrink: {
        "0%": { transform: "scale(1)", opacity: "1" },
        "100%": { transform: "scale(0)", opacity: "0" },
      },
    },
    animation: {
      grow: "grow 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards",
      shrink: "shrink 0.5s ease-in-out forwards",
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
