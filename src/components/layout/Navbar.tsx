import React from 'react';
import { Button } from '@/components/ui/button';
import UserMenu from './UserMenu';
import NotificationCenter from '../notifications/NotificationCenter';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';

interface NavbarProps {
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  title = "Dashboard", 
  subtitle,
  onMenuClick 
}) => {
  const isMobile = useIsMobile();

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "px-4 md:px-6"
    )}>
      <div className="flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          {isMobile && onMenuClick && (
            <Button variant="ghost" size="sm" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <div>
            <h1 className="text-lg font-semibold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationCenter />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;