/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          white: "#ffffff",
          grey: {
            100: "#F8F8F8",
            200: "#E0E0E0",
            300: "#BDBDBD",
            400: "#9E9E9E",
            500: "#757575",
            600: "#616161",
            700: "#8F8F8F",
            800: "#212121",
            900: "#000000",
          },
          blue: {
            100: "#5B98E8",
          },
          green: {
            100: "#1CA900",
            200: "#D5F2CF",
          },
          yellow: "#FFCC1A",
          red: "#E85B5B",
          purple: "#6366FF",
          gold: "#FFCE63",
          accent: "#10b981",
          background: "#f9fafb",
          // Add more custom colors here
        },
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      fontSize: {
        verySmall: "10px", // 10px
        mini: "8px", // 8px

        small: "12px",
        medium: "13px", // 13px
        normal: "14px", // 14px
        large: "16px", // 16px
        xlarge: "18px", // 18px
      },
      animation: {
        "gradient-slide": "gradient-slide 4s ease-in-out infinite",
        "gradient-slide-slow": "gradient-slide 10s ease-in-out infinite",
        pulseScale: "pulseScale 1s ease-in-out infinite",
      },
      keyframes: {
        "gradient-slide": {
          "0%": { "background-position": "0% 0%" },
          "50%": { "background-position": "100% 100%" },
          "100%": { "background-position": "0% 0%" },
        },
        pulseScale: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
        },
      },
    },
  },

  plugins: [],
};
