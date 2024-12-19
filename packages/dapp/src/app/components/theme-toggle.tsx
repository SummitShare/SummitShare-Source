// src/components/theme-toggle.tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';
import { Button } from '../components/button/Button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="small"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="w-9 h-9 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800"
    >
      {theme === 'light' ? (
        <Sun className="h-5 w-5 text-neutral-900 dark:text-neutral-100" />
      ) : (
        <Moon className="h-5 w-5 text-neutral-900 dark:text-neutral-100" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}