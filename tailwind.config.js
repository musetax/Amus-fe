/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react");
module.exports = {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        authGradientBg:
          "linear-gradient(226.04deg, #8170FF 25.45%, #2293E9 100%)",
        authViewBg:
          "linear-gradient(196.18deg, rgba(255, 255, 255, 0.03) -8.79%, rgba(255, 255, 255, 0.1) 99.28%)",
        btnBgGradient:
          "linear-gradient(89.05deg, rgba(76, 137, 239, 0.1) -3.62%, rgba(129, 112, 253, 0.1) 103.68%)",
        btnBgGradient1: "linear-gradient(180deg, #6A57F6 0%, #4D37F5 100%);",

        gradientBackground: "linear-gradient(180deg, #6A57F6 0%, #4D37F5 100%)",
        lightBluegradient:
          "linear-gradient(136.68deg, #F5FBFF 24.27%, #F1F7FB 99.81%);",
        mediumBlueGradient:
          "linear-gradient(87.46deg, rgba(83, 135, 241, 1) 0%, rgba(123, 115, 252, 1) 100%);",
        eventLinearBg:
          "linear-gradient(180deg, #EAF1FC -0.35%, #DDE8F9 100.35%)",
        gradientBg1:
          "linear-gradient(279.27deg, #130B50 8.23%, #6186F4 105.65%)",
        gradientBg2:
          "linear-gradient(124.75deg, rgba(77, 118, 234, 0.83) 0%, rgba(109, 138, 220, 0.83) 103.33%)",
        darkBlueGradient:
          "linear-gradient(121.15deg, #00F3E7 17.83%, #053EFE 102%)",
        blueGradient:
          "linear-gradient(120.42deg, #152945 -18.21%, #015CDD 106.55%)",
        gradientBorder:
          "linear-gradient(121.15deg, #053EFE 17.83%, #00F3E7 102%)",
        bgGradientBox:
          "linear-gradient(87.46deg, rgba(83, 135, 241, 0.14) 0%, rgba(123, 115, 252, 0.14) 100%);",
        blueGradient1:
          "linear-gradient(87.91deg, #4F88F0 -4.68%, #7E71FC 104.83%);",
      },
      boxShadow: {
        custom: "0px 0px 20px 0px #00000033",
        dark_headerShadow: "0px 0px 20px 0px #424242",
        boxShadow: "0px 25px 50px 0px #16194F0D",
        boxShadow2: "0px 3.48px 43.46px 0px #00000021 ",
        boxShadow3: "0px 2.61px 7.13px 0px #00000033",
        boxShadow4: "0px 1.96px 3.92px 0px #6E6E6E0D",
      },

      colors: {
        primary: {
          light: "#ffffff",
          dark: "#000000",
        },

        lightBlue: "#F1F7FB",
        lightBlue1: "#6350F6",
        lightBlue3: "#054BFD",
        darkBlue: "#1495EA",
        darkBlue1: "#7F71FC",
        mediumGray1: "#424A57",
        brightGray: "#E9F0F4",
        secondaryShade4: "rgba(72, 74, 78, 0.5)",
        secondaryShade1: "rgba(77, 55, 245,0.8)",
        primaryColor: "#02163D",
        slateColor: "#45556C",
        lightBlue: "#F1F5F9",
        lightGray: "#F5F5F5",
        lightGray2: "#f9f9f9",
        lightGray3: "#E9E9E9",
        lightGray4: "#E5E5E5",
        blueColor: "#1084D8",
        brightCyan: "#2FE9DB",
        secondary: "#293FCC",
        blue2: "#293FCC",
        blue3: "#332A7C",
        blue4: "#3252AB",
        pinkColor: "#F98E2B",
        tiffanyBlue: "#2FE9DB",
        lightgray1: "#F6F7FF",
        lightGray1: "#969EAF",
        lightGray3: "#F7F9FD",
        lightgray4: "#F7FBFE",
        lightGray5: "#BCBCBC1A",
        lightGray6: "#E8E8E8",
        lightGray7: "#E5E7EB",
        lightGray8: "#D2D8E3",
        cyanBlue: "#042567",
        lightblue: "rgba(4, 37, 103,0.3)",
        lightBlue2: "#edf7fe",
        lightBlue4: "#C3E3FA",
        textgray: "#526282",
        purpuleColor: "#4D37F5",
        mediumGray: "#E6EEFB",
        lightGreen: "#84F2E9",
      },
      spacing: {
        4.5: "18px",
      },
      height: {
        13: "52px",
      },
      fontFamily: {
        primary: ["DM Sans", "sans-serif"],
      },
      opacity: {
        24: "0.24",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["peer-checked"], // Enable peer-checked
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
