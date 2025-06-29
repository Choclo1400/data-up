import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import RoleBasedNavigation from './RoleBasedNavigation';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Inmel</h1>
        <p className="text-sm text-muted-foreground">
          Sistema de gestión
        </p>
      </div>
      
      <div className="flex-1">
        <RoleBasedNavigation />
      </div>
      
      {user && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Conectado como:
          </p>
          <p className="text-sm font-medium">
            {user.name}
          </p>
          <p className="text-xs text-muted-foreground">
            ({user.role})
          </p>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-secondary data-[state=open]:text-secondary-foreground bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            Abrir menú
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          {renderSidebarContent()}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="fixed left-0 top-0 z-20 h-full w-64 flex-col bg-background border-r flex">
      {renderSidebarContent()}
    </aside>
  );
};

export default Sidebar;