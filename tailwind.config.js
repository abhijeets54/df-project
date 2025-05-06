/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        forensic: {
          DEFAULT: "#1e3a8a", // Dark blue base
          light: "#3b82f6", // Lighter blue
          dark: "#172554", // Very dark blue
          accent: "#0ea5e9", // Blue accent
          muted: "#bfdbfe", // Very light blue
          success: "#10b981", // Green for successful operations
          warning: "#f59e0b", // Amber for warnings
          error: "#ef4444", // Red for errors
          highlight: "#3b82f6", // Highlight color
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
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
        "scan-up": {
          "0%": { height: "0%", opacity: 0.4 },
          "100%": { height: "100%", opacity: 0.8 },
        },
        "scan-line": {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
        "data-flow": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "glitch": {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: 0.8 },
          "100%": { transform: "scale(2)", opacity: 0 },
        },
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "progress-bar": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "scan-up": "scan-up 2s ease-in-out infinite alternate",
        "scan-line": "scan-line 3s ease-in-out infinite",
        "data-flow": "data-flow 3s linear infinite",
        "glitch": "glitch 0.4s linear infinite",
        "pulse-ring": "pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "progress-bar": "progress-bar 2s ease-in-out",
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px), linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px)',
        'forensic-gradient': 'linear-gradient(to right, #1e3a8a, #3b82f6)',
        'grid-overlay': 'radial-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '32px 32px',
      },
    },
  },
  plugins: [],
}; 