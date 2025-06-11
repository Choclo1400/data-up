import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-800" />;
  }

  const isDarkMode = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className={cn(
        "p-2 rounded-lg transition-colors duration-200",
        "flex items-center justify-center",
        
        // Modo Claro: Un gris notable que resalta sobre el fondo blanco.
        "bg-slate-200 hover:bg-slate-300",
        
        // Modo Oscuro: Un gris oscuro que resalta sobre el fondo principal oscuro.
        "dark:bg-slate-800 dark:hover:bg-slate-700",
        
        // Color del ícono
        "text-muted-foreground dark:text-gray-400",
        
        // Foco de Accesibilidad
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "dark:focus-visible:ring-offset-background-dark"
      )}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};