"use client";
import React from "react";
import { Button } from "./ui/button";
import { useDarkMode } from "./DarkModeProvider";

export function DarkModeToggle() {
  const { isDark, toggleDark } = useDarkMode();
  return (
    <Button variant="outline" size="icon" onClick={toggleDark} aria-label="Toggle dark mode">
      {isDark ? "🌞" : "🌙"}
    </Button>
  );
} 