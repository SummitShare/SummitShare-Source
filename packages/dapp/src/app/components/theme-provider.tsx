'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Define the possible theme types
type Theme = 'light' | 'dark';

// Props for the ThemeProvider component
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

// State for the ThemeProvider component
type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Initial state for the ThemeProvider context
const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
};

// Create the ThemeProvider context
const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// ThemeProvider component
export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'summitshare-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme, storageKey]);

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        setTheme,
      }}
      {...props}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};