// theme-context.js
import { Theme } from "@radix-ui/themes";
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("dark");

  const toggleTheme = () => setMode(prev => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <Theme appearance={mode} accentColor="indigo" panelBackground="translucent" hasBackground={false}>{children}</Theme>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
