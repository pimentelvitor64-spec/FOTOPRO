import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101012",
        sand: "#f6f1ea",
        brand: "#bd7a3f",
      },
      boxShadow: {
        soft: "0 24px 80px rgba(16,16,18,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
