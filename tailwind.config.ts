import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        broadcast: "0 18px 60px rgba(15, 23, 42, 0.16)",
        glow: "0 0 34px rgba(59, 130, 246, 0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
