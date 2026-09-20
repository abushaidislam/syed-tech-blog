import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      screens: {
        xs: "420px",
      },
      maxWidth: {
        "grid-width": "76rem",
      },
      fontFamily: {
        display: ["var(--font-satoshi)", "system-ui", "sans-serif"],
        default: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono, ui-monospace)", "ui-monospace", "monospace"],
        rowan: ["Rowan", "Georgia", "serif"],
      },
      fontSize: {
        "2xs": [
          "0.625rem",
          {
            lineHeight: "0.875rem",
          },
        ],
      },
      colors: {
        "grid-border": "#e5e7eb",
        brown: {
          50: "#fdf8f6",
          100: "#f2e8e5",
          200: "#eaddd7",
          300: "#e0cec7",
          400: "#d2bab0",
          500: "#bfa094",
          600: "#a18072",
          700: "#977669",
          800: "#846358",
          900: "#43302b",
        },
        "bg-emphasis": "rgb(var(--bg-emphasis, 229 229 229) / <alpha-value>)",
        "bg-default": "rgb(var(--bg-default, 255 255 255) / <alpha-value>)",
        "bg-subtle": "rgb(var(--bg-subtle, 245 245 245) / <alpha-value>)",
        "bg-muted": "rgb(var(--bg-muted, 250 250 250) / <alpha-value>)",
        "bg-inverted": "rgb(var(--bg-inverted, 23 23 23) / <alpha-value>)",

        "bg-info": "rgb(var(--bg-info, 219 234 254) / <alpha-value>)",
        "bg-success": "rgb(var(--bg-success, 220 252 231) / <alpha-value>)",
        "bg-attention": "rgb(var(--bg-attention, 255 237 213) / <alpha-value>)",
        "bg-warning": "rgb(var(--bg-warning, 254 249 195) / <alpha-value>)",
        "bg-error": "rgb(var(--bg-error, 254 226 226) / <alpha-value>)",

        "border-emphasis": "rgb(var(--border-emphasis, 163 163 163) / <alpha-value>)",
        "border-default": "rgb(var(--border-default, 212 212 212) / <alpha-value>)",
        "border-muted": "rgb(var(--border-muted, 245 245 245) / <alpha-value>)",
        "border-subtle": "rgb(var(--border-subtle, 229 229 229) / <alpha-value>)",

        "content-inverted": "rgb(var(--content-inverted, 255 255 255) / <alpha-value>)",
        "content-muted": "rgb(var(--content-muted, 163 163 163) / <alpha-value>)",
        "content-subtle": "rgb(var(--content-subtle, 115 115 115) / <alpha-value>)",
        "content-default": "rgb(var(--content-default, 64 64 64) / <alpha-value>)",
        "content-emphasis": "rgb(var(--content-emphasis, 23 23 23) / <alpha-value>)",

        "content-info": "rgb(var(--content-info, 37 99 235) / <alpha-value>)",
        "content-success": "rgb(var(--content-success, 22 163 74) / <alpha-value>)",
        "content-attention": "rgb(var(--content-attention, 234 88 12) / <alpha-value>)",
        "content-warning": "rgb(var(--content-warning, 202 138 4) / <alpha-value>)",
        "content-error": "rgb(var(--content-error, 220 38 38) / <alpha-value>)",
      },
      animation: {
        "infinite-scroll": "infinite-scroll 22s linear infinite",
        "infinite-scroll-y": "infinite-scroll-y 22s linear infinite",
        "text-appear": "text-appear 0.15s ease",
        "pulse-scale": "pulse-scale 6s ease-out infinite",
        "gradient-move": "gradient-move 5s linear infinite",
        float: "float 4s linear infinite",
        "logo-flip-in": "logo-flip-in 0.5s ease-out forwards",
        "logo-flip-out": "logo-flip-out 0.5s ease-in forwards",
        "dot-progress": "dot-progress 4500ms linear forwards",
        "offset-move": "offset-move 10s linear infinite",
        "scale-in": "scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.2s ease-out forwards",
        "fade-in-blur": "fade-in-blur 0.5s ease-out forwards",
        "scale-in-fade": "scale-in-fade 0.2s ease-out forwards",
        "slide-up-fade": "slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "offset-move": {
          "0%": { offsetDistance: "var(--offset-start, 0%)" },
          "100%": { offsetDistance: "var(--offset-end, 100%)" },
        },
        "infinite-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(var(--scroll, -150%))" },
        },
        "infinite-scroll-y": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(var(--scroll, -150%))" },
        },
        "text-appear": {
          "0%": {
            opacity: "0",
            transform: "rotateX(45deg) scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "rotateX(0deg) scale(1)",
          },
        },
        "pulse-scale": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "30%": { opacity: "1" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        "gradient-move": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "logo-flip-in": {
          "0%": { transform: "rotateX(90deg)", opacity: "0" },
          "100%": { transform: "rotateX(0deg)", opacity: "1" },
        },
        "logo-flip-out": {
          "0%": { transform: "rotateX(0deg)", opacity: "1" },
          "100%": { transform: "rotateX(-90deg)", opacity: "0" },
        },
        float: {
          "0%": {
            transform: "scale(1) rotate(0) translateX(var(--r, 5%)) rotate(0)",
          },
          "50%": {
            transform: "scale(1.05) rotate(180deg) translateX(var(--r, 5%)) rotate(-180deg)",
          },
          "100%": {
            transform: "scale(1) rotate(360deg) translateX(var(--r, 5%)) rotate(-360deg)",
          },
        },
        "dot-progress": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "scale-in": {
          "0%": { transform: "scale(var(--from-scale,0.95))" },
          "100%": { transform: "scale(var(--to-scale,1))" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-blur": {
          "0%": { opacity: "0", filter: "blur(4px)" },
          "50%": { opacity: "0.5", filter: "blur(0px)" },
          "100%": { opacity: "1", filter: "blur(0px)" },
        },
        "scale-in-fade": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-up-fade": {
          "0%": { opacity: "0", transform: "translateY(var(--offset, 2px))" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [forms, typography],
};

export default config;
