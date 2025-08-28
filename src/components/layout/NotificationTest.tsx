import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function NotificationTest() {
  const { user } = useAuth();

  const createTestNotification = async () => {
    if (!user) {
      toast.error('Debes estar autenticado para crear notificaciones');
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Notificación de Prueba',
          message: `Esta es una notificación de prueba creada el ${new Date().toLocaleString('es-ES')}`,
          type: 'info',
          is_read: false
        });

      if (error) throw error;

      toast.success('Notificación de prueba creada exitosamente');
    } catch (error) {
      console.error('Error creating test notification:', error);
      toast.error('Error al crear la notificación de prueba');
    }
  };

  const createUrgentNotification = async () => {
    if (!user) {
      toast.error('Debes estar autenticado para crear notificaciones');
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Solicitud Urgente Asignada',
          message: 'Se te ha asignado una nueva solicitud de servicio con prioridad URGENTE. Requiere atención inmediata.',
          type: 'error',
          is_read: false
        });

      if (error) throw error;

      toast.success('Notificación urgente creada');
    } catch (error) {
      console.error('Error creating urgent notification:', error);
      toast.error('Error al crear la notificación urgente');
    }
  };

  const createSuccessNotification = async () => {
    if (!user) {
      toast.error('Debes estar autenticado para crear notificaciones');
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Solicitud Completada',
          message: 'La solicitud de servicio #12345 ha sido completada exitosamente. El cliente ha confirmado su satisfacción.',
          type: 'success',
          is_read: false
        });

      if (error) throw error;

      toast.success('Notificación de éxito creada');
    } catch (error) {
      console.error('Error creating success notification:', error);
      toast.error('Error al crear la notificación de éxito');
    }
  };

  const createWarningNotification = async () => {
    if (!user) {
      toast.error('Debes estar autenticado para crear notificaciones');
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Recordatorio de Mantenimiento',
          message: 'El mantenimiento programado del sistema comenzará en 30 minutos. Guarda tu trabajo.',
          type: 'warning',
          is_read: false
        });

      if (error) throw error;

      toast.success('Notificación de advertencia creada');
    } catch (error) {
      console.error('Error creating warning notification:', error);
      toast.error('Error al crear la notificación de advertencia');
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Debes iniciar sesión para probar las notificaciones</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900">
        Pruebas de Notificaciones
      </h3>
      <p className="text-sm text-gray-600">
        Usa estos botones para crear notificaciones de prueba y verificar que el panel funciona correctamente.
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={createTestNotification}
          variant="outline"
          className="w-full"
        >
          📢 Notificación Info
        </Button>
        
        <Button 
          onClick={createUrgentNotification}
          variant="destructive"
          className="w-full"
        >
          🚨 Notificación Urgente
        </Button>
        
        <Button 
          onClick={createSuccessNotification}
          variant="default"
          className="w-full bg-green-600 hover:bg-green-700"
        >
          ✅ Notificación Éxito
        </Button>
        
        <Button 
          onClick={createWarningNotification}
          variant="outline"
          className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50"
        >
          ⚠️ Notificación Advertencia
        </Button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-800">
          <strong>Instrucciones:</strong> Después de crear una notificación, haz clic en el ícono de campana 🔔 en la barra superior para ver el panel de notificaciones.
        </p>
      </div>
    </div>
  );
}