import React, { createContext, useContext, useState, useEffect } from 'react';
import { getData, setData, STORAGE_KEYS } from '../services/storageService';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return getData(STORAGE_KEYS.THEME, "light");
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return getData(STORAGE_KEYS.SIDEBAR_COLLAPSED, false);
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    setData(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      setData(STORAGE_KEYS.SIDEBAR_COLLAPSED, next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDark: theme === "dark",
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
