
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import RequestsDashboardOverview from '@/components/dashboard/RequestsDashboardOverview';
import RequestCard from '@/components/requests/RequestCard';
import { TechnicalRequest, RequestStatus, RequestType, Priority } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Mock data for recent requests
const mockRecentRequests: TechnicalRequest[] = [
  {
    id: 'REQ001',
    title: 'Mantenimiento preventivo subestación Norte',
    description: 'Realizar mantenimiento preventivo programado en la subestación Norte según protocolo Enel',
    type: RequestType.MAINTENANCE,
    status: RequestStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    clientCode: 'ENEL-001',
    requestedBy: 'Carlos Mendoza',
    assignedTo: 'Juan Pérez',
    createdDate: '2024-01-15T08:00:00Z',
    dueDate: '2024-01-20T18:00:00Z',
    estimatedHours: 8,
    actualHours: 6,
    location: 'Subestación Norte - Santiago',
    equipment: 'Transformador 220kV',
    notes: 'Coordinar corte programado con centro de control',
    attachments: [],
    history: []
  },
  {
    id: 'REQ002',
    title: 'Inspección línea de transmisión Sector Sur',
    description: 'Inspección visual y termográfica de línea de transmisión en sector sur',
    type: RequestType.INSPECTION,
    status: RequestStatus.PENDING,
    priority: Priority.MEDIUM,
    clientCode: 'ENEL-002',
    requestedBy: 'María González',
    createdDate: '2024-01-16T10:30:00Z',
    dueDate: '2024-01-25T16:00:00Z',
    estimatedHours: 4,
    location: 'Línea 220kV Sur',
    equipment: 'Torres 150-180',
    history: []
  },
  {
    id: 'REQ003',
    title: 'Reparación urgente sistema SCADA',
    description: 'Falla en comunicación del sistema SCADA con equipos de campo',
    type: RequestType.EMERGENCY,
    status: RequestStatus.APPROVED,
    priority: Priority.CRITICAL,
    clientCode: 'ENEL-001',
    requestedBy: 'Roberto Silva',
    assignedTo: 'Ana Torres',
    createdDate: '2024-01-17T14:00:00Z',
    dueDate: '2024-01-18T08:00:00Z',
    estimatedHours: 12,
    location: 'Centro de Control',
    equipment: 'Servidor SCADA Principal',
    notes: 'Requiere acceso 24/7 hasta resolución',
    history: []
  }
];

const RequestsDashboard = () => {
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState<string>('');
  
  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const formattedDate = now.toLocaleDateString('es-ES', options);
    setCurrentDate(formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1));
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Dashboard - Sistema de Solicitudes Técnicas" 
          subtitle={currentDate}
        />
        
        <main className="flex-1 px-6 py-6">
          <RequestsDashboardOverview />
          
          <section className="mt-8 slide-enter" style={{ animationDelay: '0.4s' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Solicitudes Recientes</h2>
              <button className="text-sm text-primary hover:underline">
                Ver todas
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockRecentRequests.map((request) => (
                <RequestCard 
                  key={request.id} 
                  request={request} 
                  onClick={() => console.log(`Clicked on ${request.id}`)}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default RequestsDashboard;
