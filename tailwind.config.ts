import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#6D4FC2",
        "primary-soft": "#EDE7FB",
        lavender: "#B9A7E8",
        coral: "#F2836B",
        teal: "#1F9E86",
        "myth-red": "#D9534F",
        background: "#FAF8FE",
        surface: "#FFFFFF",
        text: "#1F1A2E",
        muted: "#6B6580",
        border: "#E6E1F2",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      spacing: {
        "margin-mobile": "1rem",
        "space-xs": "0.25rem",
        gutter: "1.5rem",
        "gutter-mobile": "1rem",
        margin: "2rem",
        "space-sm": "0.5rem",
        "space-lg": "1.5rem",
        "space-md": "1rem",
        "space-xl": "2rem",
      },
      fontFamily: {
        display: ["var(--font-nunito)", "Nunito", "sans-serif"],
        "headline-lg": ["var(--font-nunito)", "Nunito", "sans-serif"],
        "headline-md": ["var(--font-nunito)", "Nunito", "sans-serif"],
        "headline-sm": ["var(--font-nunito)", "Nunito", "sans-serif"],
        "title-md": ["var(--font-nunito)", "Nunito", "sans-serif"],
        "body-lg": ["var(--font-inter)", "Inter", "sans-serif"],
        "body-md": ["var(--font-inter)", "Inter", "sans-serif"],
        "body-sm": ["var(--font-inter)", "Inter", "sans-serif"],
        "label-lg": ["var(--font-inter)", "Inter", "sans-serif"],
        "label-md": ["var(--font-inter)", "Inter", "sans-serif"],
        "label-sm": ["var(--font-inter)", "Inter", "sans-serif"],
      },
      fontSize: {
        display: ["40px", { lineHeight: "52px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg": ["32px", { lineHeight: "42px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "700" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "700" }],
        "title-md": ["18px", { lineHeight: "26px", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "25.6px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "22px", fontWeight: "400" }],
        "label-lg": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        "label-md": ["14px", { lineHeight: "20px", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "600" }],
      },
    },
  },
  plugins: [],
};

export default config;
