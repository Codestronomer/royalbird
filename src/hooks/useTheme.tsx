"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    // Determine initial preference: localStorage -> system -> light
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (stored === "dark" || stored === "light") {
      setThemeState(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    } else if (typeof window !== "undefined" && window.matchMedia) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setThemeState(prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", prefersDark);
    }

    // Listen for system changes and respect explicit stored preference only
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const storedNow = localStorage.getItem("theme");
      if (storedNow !== "dark" && storedNow !== "light") {
        setThemeState(e.matches ? "dark" : "light");
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };
    mq?.addEventListener("change", handleChange);
    return () => mq?.removeEventListener("change", handleChange);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
    document.documentElement.classList.toggle("dark", t === "dark");
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
