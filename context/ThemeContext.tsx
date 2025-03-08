"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie";

const themeOptions = ["light", "dark", "system"] as const;
const colorOptions = ["zinc", "red", "rose", "orange", "green", "blue", "yellow", "violet"] as const;

export type Theme = (typeof themeOptions)[number];
export type ColorTheme = (typeof colorOptions)[number];

type InitialState = {
  theme: Theme;
  colorTheme: ColorTheme;
  toggleTheme: (selectedTheme: Theme) => void;
  toggleColorTheme: (selectedColor: ColorTheme) => void;
};

const DEFAULT_THEME: Theme = "light";
const DEFAULT_COLOR_THEME: ColorTheme = "zinc";

const initialState: InitialState = {
  theme: DEFAULT_THEME,
  colorTheme: DEFAULT_COLOR_THEME,
  toggleTheme: () => {},
  toggleColorTheme: () => {},
};

export const ThemeContext = createContext(initialState);

export const ThemeContextProvider = ({
  children,
  initialTheme,
  initialColorTheme,
}: {
  children: ReactNode;
  initialTheme?: Theme;
  initialColorTheme?: ColorTheme;
}) => {
  const [theme, setTheme] = useState<Theme>(initialTheme || DEFAULT_THEME);
  const [colorTheme, setColorTheme] = useState<ColorTheme>(initialColorTheme || DEFAULT_COLOR_THEME);

  useEffect(() => {
    const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");

    // Update dark/light theme
    const updateTheme = () => {
      const shouldBeDark =
        theme === "dark" || (theme === "system" && darkModePreference.matches);
      const isCurrentlyDark = document.body.classList.contains("dark");

      if (shouldBeDark && !isCurrentlyDark) {
        document.body.classList.add("dark");
      } else if (!shouldBeDark && isCurrentlyDark) {
        document.body.classList.remove("dark");
      }
    };

    updateTheme();
    Cookies.set("theme", theme, { expires: 365 });

    if (theme === "system") {
      darkModePreference.addEventListener("change", updateTheme);
      return () => darkModePreference.removeEventListener("change", updateTheme);
    }
  }, [theme]);

  useEffect(() => {
    // Update color theme
    document.body.setAttribute("data-color-theme", colorTheme);
    Cookies.set("colorTheme", colorTheme, { expires: 365 });
  }, [colorTheme]);

  const value = {
    theme,
    colorTheme,
    toggleTheme: (selectedTheme: Theme) => {
      setTheme(selectedTheme);
    },
    toggleColorTheme: (selectedColor: ColorTheme) => {
      setColorTheme(selectedColor);
    },
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContextProvider;