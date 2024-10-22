import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles"

export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#858585",
          800: "#292929",
          900: "#141414",
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1F2A40",
          500: "#141b2d",
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
        greenAccent: {
          100: "#dbf5ee",
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd",
          500: "#4cceac",
          600: "#3da58a",
          700: "#2e7c67",
          800: "#1e5245",
          900: "#0f2922",
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#db4f4a",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        blueAccent: {
          100: "#e1e2fe",
          200: "#c3c6fd",
          300: "#a4a9fc",
          400: "#868dfb",
          500: "#6870fa",
          600: "#535ac8",
          700: "#3e4396",
          800: "#2a2d64",
          900: "#151632",
        },
        whiteblack: {
          100: "#1F2A40",
        },
      }
    : {
        grey: {
          100: "#262626",
          200: "#404040",
          300: "#595959",
          400: "#737373",
          500: "#8c8c8c",
          600: "#a6a6a6",
          700: "#c2c2c2",
          900: "#fcfcfc",
        },

        primary: {
          100: "#070707",
          200: "#0d0d0d",
          300: "#131313",
          400: "#eaeff3",
          500: "#fff",
          600: "#595959",
          700: "#8c8c8c",
          800: "#a6a6a6",
          900: "#c2c2c2",
        },

        greenAccent: {
          100: "#031b16",
          200: "#09362a",
          300: "#0f513f",
          400: "#166c55",
          500: "#1f8969",
          600: "#1f8969",
          700: "#65c6b6",
          800: "#8edccf",
          900: "#c4ede4",
        },

        redAccent: {
          100: "#390404",
          200: "#620808",
          300: "#8c1b1b",
          400: "#b62e2e",
          500: "#e84141",
          600: "#ec6767",
          700: "#f18c8c",
          800: "#f6b2b2",
          900: "#fbd8d8",
        },

        blueAccent: {
          100: "#0d1032",
          200: "#1a2166",
          300: "#263296",
          400: "#3343c6",
          500: "#4054f8",
          600: "#6675fa",
          700: "#8c97fb",
          800: "#b2b8fd",
          900: "#d9dcfe",
        },
        whiteblack: {
          100: "#FFFEFC",
        },
      }),
});


export const themeSettings = (mode) => {
    const colors = tokens(mode);

    return {
      palette: {
        mode: mode,
        ...(mode === "dark"
          ? {
              primary: {
                main: colors.primary[500],
              },
              secondary: {
                main: colors.greenAccent[500],
              },
              neutral: {
                dark: colors.grey[700],
                main: colors.grey[500],
                light: colors.grey[100],
              },
              background: {
                default: colors.primary[500],
              },
            }
          : {
              primary: {
                main: colors.primary[100],
              },
              secondary: {
                main: colors.greenAccent[500],
              },
              neutral: {
                dark: colors.grey[700],
                main: colors.grey[500],
                light: colors.grey[100],
              },
              background: {
                default: colors.primary[400],
              },
            }),
      },
      typography: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
        h1: {
          fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
          fontSize: 25,
        },
        h2: {
          fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
          fontSize: 32,
        },
        h3: {
          fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
          fontSize: 24,
        },
        h4: {
          fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
          fontSize: 18,
        },
        h5: {
          fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
          fontSize: 30,
        },
        h6: {
          fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
          fontSize: 14,
        },
      },
    };
}

export const ColorModeContext = createContext({
    toggleColorMode: () => { }
});

export const useMode = () => {
    const [mode, setMode] = useState("light");
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () =>
                setMode((prev) => (prev === "light" ? "dark" : "light")),
        }), []
    );

    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    return [theme, colorMode];
};