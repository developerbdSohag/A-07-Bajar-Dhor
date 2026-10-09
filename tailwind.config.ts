import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-hind-siliguri)",
          "Hind Siliguri",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        bazardor: {
          "color-scheme": "light",
          "primary": "oklch(55% 0.15 150)",
          "primary-content": "oklch(98% 0.012 150)",
          "secondary": "oklch(72% 0.13 65)",
          "secondary-content": "oklch(24% 0.04 65)",
          "accent": "oklch(70% 0.13 195)",
          "accent-content": "oklch(20% 0.03 195)",
          "neutral": "oklch(31% 0.02 152)",
          "neutral-content": "oklch(97% 0.01 152)",
          "base-100": "oklch(99% 0.004 145)",
          "base-200": "oklch(96.5% 0.008 145)",
          "base-300": "oklch(92.5% 0.012 145)",
          "base-content": "oklch(26% 0.02 150)",
          "info": "oklch(62% 0.14 235)",
          "info-content": "oklch(98% 0.01 235)",
          "success": "oklch(60% 0.15 152)",
          "success-content": "oklch(98% 0.01 152)",
          "warning": "oklch(79% 0.15 80)",
          "warning-content": "oklch(26% 0.05 80)",
          "error": "oklch(57% 0.19 25)",
          "error-content": "oklch(98% 0.01 25)",
        },
      },
    ],
  },
};

export default config;
