import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          blue: "#3B82F6",
          gray: "#f7f9fb",
        },
      },
      boxShadow: {
        glass: "0 10px 25px rgba(30, 60, 120, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
