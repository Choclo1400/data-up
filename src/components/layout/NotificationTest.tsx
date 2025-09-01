import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const NotificationTest = () => {
  const { user } = useAuth();

  const createTestNotification = async (type: 'info' | 'warning' | 'error' | 'success', title: string, message: string) => {
    if (!user) {
      toast.error('Debes estar autenticado para crear notificaciones');
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title,
          message,
          type,
          is_read: false
        });

      if (error) throw error;

      toast.success(`Notificación ${type} creada exitosamente`);
      
      // Trigger a refetch of notifications by invalidating the query
      // This will update the notification panel immediately
      window.dispatchEvent(new CustomEvent('notification-created'));
      
    } catch (error) {
      console.error('Error creating notification:', error);
      toast.error('Error al crear la notificación');
    }
  };

  const testNotifications = [
    {
      type: 'info' as const,
      title: 'Nueva actualización disponible',
      message: 'Se ha lanzado una nueva versión del sistema con mejoras de rendimiento.',
      icon: Info,
      color: 'bg-blue-500'
    },
    {
      type: 'error' as const,
      title: 'Solicitud urgente asignada',
      message: 'Se te ha asignado una solicitud de emergencia que requiere atención inmediata.',
      icon: AlertTriangle,
      color: 'bg-red-500'
    },
    {
      type: 'success' as const,
      title: 'Solicitud completada',
      message: 'La solicitud #12345 ha sido completada exitosamente por el técnico.',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      type: 'warning' as const,
      title: 'Mantenimiento programado',
      message: 'El sistema estará en mantenimiento mañana de 02:00 a 04:00 AM.',
      icon: Bell,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Pruebas del Sistema de Notificaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Usa estos botones para crear notificaciones de prueba y verificar que el panel funciona correctamente.
          Después de crear una notificación, haz clic en el ícono de campana en la barra superior.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {testNotifications.map((notification, index) => {
            const IconComponent = notification.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-muted/50"
                onClick={() => createTestNotification(notification.type, notification.title, notification.message)}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className={`p-1 rounded-full ${notification.color}`}>
                    <IconComponent className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium text-sm">{notification.title}</span>
                </div>
                <span className="text-xs text-muted-foreground text-left">
                  {notification.message}
                </span>
              </Button>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Cómo probar:</h4>
          <ol className="text-xs text-muted-foreground space-y-1">
            <li>1. Haz clic en cualquier botón de arriba para crear una notificación</li>
            <li>2. Observa el ícono de campana en la barra superior (debería mostrar un contador)</li>
            <li>3. Haz clic en la campana para abrir el panel de notificaciones</li>
            <li>4. Verifica que la notificación aparece con el estilo correcto</li>
            <li>5. Haz clic en la notificación para marcarla como leída</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationTest;