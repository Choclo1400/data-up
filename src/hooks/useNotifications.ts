
import { useState, useEffect } from 'react';
import { Notification, NotificationType, NotificationPriority, NotificationGroup } from '@/types/notifications';

// Mock data para demostración
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: NotificationType.APPROVAL,
    priority: NotificationPriority.HIGH,
    title: 'Solicitud Aprobada',
    message: 'La solicitud #REQ-2024-001 ha sido aprobada por el supervisor.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    userId: 'current-user',
    requestId: 'REQ-2024-001',
    actionUrl: '/requests'
  },
  {
    id: '2',
    type: NotificationType.ASSIGNMENT,
    priority: NotificationPriority.MEDIUM,
    title: 'Nueva Asignación',
    message: 'Se te ha asignado la solicitud #REQ-2024-002 para mantenimiento.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    userId: 'current-user',
    requestId: 'REQ-2024-002',
    actionUrl: '/requests'
  },
  {
    id: '3',
    type: NotificationType.STATUS_CHANGE,
    priority: NotificationPriority.LOW,
    title: 'Cambio de Estado',
    message: 'La solicitud #REQ-2024-003 cambió a "En Progreso".',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    userId: 'current-user',
    requestId: 'REQ-2024-003',
    actionUrl: '/requests'
  },
  {
    id: '4',
    type: NotificationType.BACKUP_ALERT,
    priority: NotificationPriority.CRITICAL,
    title: 'Error en Respaldo',
    message: 'El respaldo automático falló. Se requiere intervención manual.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    userId: 'current-user',
    actionUrl: '/settings'
  },
  {
    id: '5',
    type: NotificationType.REJECTION,
    priority: NotificationPriority.MEDIUM,
    title: 'Solicitud Rechazada',
    message: 'La solicitud #REQ-2024-004 fue rechazada. Motivo: Información incompleta.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    userId: 'current-user',
    requestId: 'REQ-2024-004',
    actionUrl: '/requests'
  },
  {
    id: '6',
    type: NotificationType.ERROR,
    priority: NotificationPriority.HIGH,
    title: 'Error del Sistema',
    message: 'Se detectó un error en la sincronización de datos.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    userId: 'current-user',
    actionUrl: '/settings'
  }
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const groupedNotifications = notifications.reduce((groups, notification) => {
    const existingGroup = groups.find(g => g.type === notification.type);
    if (existingGroup) {
      existingGroup.notifications.push(notification);
      existingGroup.count++;
    } else {
      groups.push({
        type: notification.type,
        count: 1,
        notifications: [notification]
      });
    }
    return groups;
  }, [] as NotificationGroup[]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const deleteAllRead = () => {
    setNotifications(prev =>
      prev.filter(notification => !notification.isRead)
    );
  };

  // Simular nueva notificación cada 30 segundos para demo
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: `demo-${Date.now()}`,
        type: NotificationType.SYSTEM,
        priority: NotificationPriority.LOW,
        title: 'Notificación de Demo',
        message: 'Esta es una notificación de demostración generada automáticamente.',
        isRead: false,
        createdAt: new Date().toISOString(),
        userId: 'current-user',
        actionUrl: '/analytics'
      };

      setNotifications(prev => [newNotification, ...prev]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    groupedNotifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead
  };
};
