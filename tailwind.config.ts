import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090B",
        card: {
          DEFAULT: "#18181B",
          hover: "#202024",
        },
        border: "#27272A",
        primary: {
          DEFAULT: "#3B82F6",
          hover: "#2563EB",
        },
        purple: {
          DEFAULT: "#8B5CF6",
          hover: "#7C3AED",
        },
        cyan: {
          DEFAULT: "#06B6D4",
          hover: "#0891B2",
        },
        foreground: "#FAFAFA",
        muted: {
          DEFAULT: "#A1A1AA",
          foreground: "#71717A",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "glass-gradient":
          "linear-gradient(135deg, rgba(24, 24, 27, 0.6) 0%, rgba(9, 9, 11, 0.8) 100%)",
      },
      boxShadow: {
        "glass-sm": "0 2px 8px 0 rgba(0, 0, 0, 0.3)",
        "glass-md": "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
        "glass-lg": "0 16px 48px 0 rgba(0, 0, 0, 0.5)",
        "glow-blue": "0 0 15px rgba(59, 130, 246, 0.15)",
        "glow-purple": "0 0 15px rgba(139, 92, 246, 0.15)",
        "glow-cyan": "0 0 15px rgba(6, 182, 212, 0.15)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
export default config;
