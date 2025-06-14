
import React from 'react';
import { Search } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import UserMenu from './UserMenu';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';

interface NavbarProps {
  title: string;
  subtitle?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title, subtitle }) => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-background/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-border dark:border-border-dark sticky top-0 z-10">
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
      
      {/* Controles: búsqueda, notificaciones, modo y usuario */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-muted-foreground-dark w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="py-2 pl-10 pr-4 rounded-lg bg-secondary dark:bg-secondary-dark border border-border dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-ring-dark w-full max-w-xs transition-all duration-300 text-foreground dark:text-foreground-dark placeholder:text-muted-foreground dark:placeholder:text-muted-foreground-dark"
          />
        </div>
        
        {/* Notifications - Reemplazamos el botón simple con el dropdown completo */}
        <NotificationDropdown />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
};

export default Navbar;
