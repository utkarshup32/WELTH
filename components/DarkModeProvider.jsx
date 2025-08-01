"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  const applyTheme = useCallback((theme) => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    }
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    applyTheme(storedTheme || systemTheme);
  }, [applyTheme]);

  const toggleDark = () => {
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
  };

  const value = { isDark, toggleDark };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => useContext(DarkModeContext);