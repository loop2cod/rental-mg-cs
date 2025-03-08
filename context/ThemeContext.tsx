"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie";

const themeOptions = ["light", "dark", "system"] as const;

export type Theme = (typeof themeOptions)[number];

type InitialState = {
  theme: Theme;
  toggleTheme: (selectedTheme: Theme) => void;
};

const DEFAULT_THEME: Theme = "light";

const initialState: InitialState = {
  theme: DEFAULT_THEME,
  toggleTheme: () => {},
};

export const ThemeContext = createContext(initialState);

export const ThemeContextProvider = ({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme?: Theme;
}) => {
  const [theme, setTheme] = useState<Theme>(initialTheme || DEFAULT_THEME);

  useEffect(() => {
    const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");

    // Only update the class if it differs from what the server rendered
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

  const value = {
    theme,
    toggleTheme: (selectedTheme: Theme) => {
      setTheme(selectedTheme);
    },
  };

  return (
    <>
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    </>
  );
};

export default ThemeContextProvider;