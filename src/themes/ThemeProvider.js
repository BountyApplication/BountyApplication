import React, { useEffect, createContext, useState } from "react";

const ThemeContext = createContext();

const getTheme = () => {
  const theme = localStorage.getItem("theme");
  if (!theme) {
    // Default theme is taken as dark-theme
    localStorage.setItem("theme", "light-theme");
    return "light-theme";
  } else {
    return theme;
  }
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getTheme);
  function toggleTheme() {
    const next = theme === "dark-theme" ? "light-theme" : "dark-theme";
    localStorage.setItem("theme", next);
    window.location.reload();
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute(
      "data-theme",
      theme === "dark-theme" ? "dark" : "light"
    );
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };