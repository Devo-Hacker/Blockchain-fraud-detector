import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#EFEDF9",
        bgAlt: "#E6E2F7",
        surface: "#FFFFFF",
        surfaceTint: "#F7F5FD",
        ink: "#2B2745",
        inkSoft: "#6B6584",
        inkFaint: "#9994B0",
        violet: "#6C5CE7",
        violetDeep: "#5443D6",
        violetPale: "#E3DFFB",
        mint: "#2FBF8F",
        mintPale: "#DDF5EB",
        amber: "#E0A430",
        amberPale: "#FBEED2",
        coral: "#E5595B",
        coralPale: "#FBDEDE",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        clay: "0 14px 34px rgba(87,76,176,0.10), 0 2px 8px rgba(43,39,69,0.05)",
      },
      borderRadius: {
        lg2: "26px",
        md2: "18px",
      },
    },
  },
  plugins: [],
};
export default config;