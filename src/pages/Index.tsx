
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import RoleBasedDashboard from '@/components/dashboard/RoleBasedDashboard';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const Index: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn("flex-1 flex flex-col", !isMobile && "ml-64")}>
        <Navbar 
          title="Dashboard" 
          subtitle="Panel de control personalizado"
        />
        
        <main className="flex-1 px-6 py-6">
          <RoleBasedDashboard />
        </main>
      </div>
    </div>
  );
};

export default Index;
