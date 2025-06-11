import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Badge from '@/components/common/Badge';
import { ThemeToggle } from '@/components/ThemeToggle'; // ← importamos el toggle

interface NavbarProps {
  title: string;
  subtitle?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title, subtitle }) => {
  return (
    <header
      className="
        w-full py-4 px-6 flex items-center justify-between
        bg-background/80 dark:bg-background-dark/80
        backdrop-blur-md border-b border-border dark:border-border-dark
        sticky top-0 z-10
      "
    >
      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold text-foreground dark:text-foreground-dark">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
            {subtitle}
          </p>
        )}
      </div>
      
      {/* Controles: búsqueda, notis, modo y usuario */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-muted-foreground-dark w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="
              py-2 pl-10 pr-4 rounded-lg
              bg-secondary dark:bg-secondary-dark
              border border-border dark:border-border-dark
              focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring-dark
              w-full max-w-xs
              transition-all duration-300
              text-foreground dark:text-foreground-dark
              placeholder:text-muted-foreground dark:placeholder:text-muted-foreground-dark
            "
          />
        </div>
        
        {/* Notifications */}
        <div className="relative">
          <button className="p-2 rounded-lg hover:bg-secondary dark:hover:bg-secondary-dark transition-colors">
            <Bell className="w-5 h-5 text-foreground dark:text-foreground-dark" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-status-warning" />
          </button>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary dark:bg-primary-dark flex items-center justify-center text-primary-foreground dark:text-primary-foreground-dark">
            A
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground dark:text-foreground-dark">
              Admin
            </p>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
              Administrador
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground dark:text-muted-foreground-dark" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
