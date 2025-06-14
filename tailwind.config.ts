import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      colors: {
        // Custom brand colors
        navy: "#1A1F2C",
        "simatex-purple": "#2563eb", // Changed to from-blue-600
        "simatex-purple-dark": "#1d4ed8", // Changed to hover:from-blue-700
        "simatex-purple-light": "#60a5fa", // Changed to disabled:from-blue-400
        "simatex-blue": "#6495ED",

        // Standard UI colors
        background: {
          DEFAULT: "#ffffff", // bg-white
          dark: "#1f2937", // dark:bg-gray-800
          light: "#f3f4f6", // bg-gray-100
        },
        foreground: {
          DEFAULT: "#111827", // text-gray-900
          dark: "#f3f4f6", // dark:text-gray-100
        },
        border: {
          DEFAULT: "#e5e7eb", // border-gray-200
          dark: "#374151", // dark:border-gray-700
        },

        // Accent (primary) colors
        primary: {
          DEFAULT: "#2563eb", // from-blue-600
          hover: "#1d4ed8", // hover:from-blue-700
          foreground: "#ffffff",
          disabled: "#60a5fa", // disabled:from-blue-400
        },

        // Secondary, muted, and other utility colors
        secondary: {
          DEFAULT: "#6b7280", // text-gray-500
          foreground: "#ffffff", // text-white
        },
        muted: {
          DEFAULT: "#f3f4f6", // bg-gray-100
          foreground: "#6b7280", // text-gray-500
        },
        destructive: {
          DEFAULT: "#dc2626", // text-red-600
          foreground: "#fef2f2", // bg-red-50
        },
        accent: {
          DEFAULT: "#3b82f6", // text-blue-500
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#ffffff", // bg-white
          foreground: "#111827", // text-gray-900
          dark: "#1f2937", // dark:bg-gray-800
        },
        popover: {
          DEFAULT: "#ffffff", // bg-white
          foreground: "#111827", // text-gray-900
          dark: "#1f2937", // dark:bg-gray-800
        },
        ring: "#3b82f6", // focus:ring-blue-500
        input: "#e5e7eb", // border-gray-200
      },

      backgroundImage: {
        'glass-gradient': 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'card-gradient': 'linear-gradient(to bottom right, var(--card), rgba(255, 255, 255, 0.05))',
        'primary-gradient': 'linear-gradient(to right, #2563eb, #4f46e5)', // from-blue-600 to to-indigo-600
        'primary-gradient-hover': 'linear-gradient(to right, #1d4ed8, #4338ca)', // hover:from-blue-700 to hover:to-indigo-700
        'primary-gradient-disabled': 'linear-gradient(to right, #60a5fa, #818cf8)', // disabled:from-blue-400 to disabled:to-indigo-400
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;