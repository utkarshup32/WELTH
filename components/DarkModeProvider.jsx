"use client";
import { createContext, useContext, useEffect, useState } from "react";

const DarkModeContext = createContext({
  isDark: false,
  toggleDark: () => {}
});

export function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const toggleDark = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDark }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => useContext(DarkModeContext);
