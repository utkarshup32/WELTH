"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const DarkModeContext = createContext({
  isDark: false,
  toggleDark: () => {},
  setDark: (value) => {}, // Add setDark for direct control
});

export function DarkModeProvider({ children }) {
  // Initialize state to false (light mode) for the initial SSR render.
  // The actual theme will be determined and applied on the client side.
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Track if component has mounted on client

  // Function to apply/remove 'dark' class to html element and update localStorage
  const applyTheme = useCallback((dark) => {
    if (typeof window !== 'undefined') { // Ensure window is available
      const root = document.documentElement;
      if (dark) {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, []);

  // Effect to determine and apply the initial theme on the client side.
  // This runs only once after the component mounts.
  useEffect(() => {
    setIsMounted(true); // Mark component as mounted on client

    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem("theme");
      let initialDarkState;

      if (storedTheme === "dark") {
        initialDarkState = true;
      } else if (storedTheme === "light") {
        initialDarkState = false;
      } else {
        // If no stored theme, check system preference
        initialDarkState = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      setIsDark(initialDarkState);
      applyTheme(initialDarkState); // Apply theme immediately after determining it
    }
  }, [applyTheme]); // Dependency on applyTheme to ensure it's stable

  // Effect to apply theme whenever isDark state changes (e.g., from toggleDark)
  useEffect(() => {
    if (isMounted) { // Only apply theme changes after initial mount
      applyTheme(isDark);
    }
  }, [isDark, applyTheme, isMounted]);

  // Listen for system theme changes (optional, but good for responsiveness)
  useEffect(() => {
    if (typeof window !== 'undefined' && isMounted) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => {
        // Only update if no explicit user preference is stored
        if (localStorage.getItem("theme") === null) {
          setIsDark(e.matches);
        }
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [isMounted]);


  const toggleDark = () => {
    setIsDark((prev) => !prev);
  };

  const setDark = (value) => {
    setIsDark(value);
  };

  // Render children only after the component has mounted and initial theme is applied
  // This helps prevent rendering content that depends on the resolved theme before it's ready.
  if (!isMounted && typeof window === 'undefined') {
    // During SSR, render nothing or a light-themed placeholder
    // The `html` tag in layout.js already has `dark:bg-black dark:text-white`
    // which will handle the initial styling based on system preference.
    return <>{children}</>;
  }

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDark, setDark }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => useContext(DarkModeContext);
