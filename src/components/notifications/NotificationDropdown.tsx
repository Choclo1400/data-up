
import React, { useState } from 'react';
import { Bell, BellDot, Check, CheckCheck, Trash2, Filter, Clock, AlertTriangle, CheckCircle, XCircle, Settings, User, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationType, NotificationPriority } from '@/types/notifications';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.APPROVAL:
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case NotificationType.REJECTION:
      return <XCircle className="w-4 h-4 text-red-500" />;
    case NotificationType.ASSIGNMENT:
      return <User className="w-4 h-4 text-blue-500" />;
    case NotificationType.STATUS_CHANGE:
      return <Activity className="w-4 h-4 text-orange-500" />;
    case NotificationType.BACKUP_ALERT:
      return <Settings className="w-4 h-4 text-purple-500" />;
    case NotificationType.ERROR:
      return <AlertTriangle className="w-4 h-4 text-red-600" />;
    case NotificationType.SYSTEM:
      return <Bell className="w-4 h-4 text-gray-500" />;
    default:
      return <Bell className="w-4 h-4 text-gray-500" />;
  }
};

const getPriorityColor = (priority: NotificationPriority) => {
  switch (priority) {
    case NotificationPriority.CRITICAL:
      return 'bg-red-100 border-red-200 text-red-800';
    case NotificationPriority.HIGH:
      return 'bg-orange-100 border-orange-200 text-orange-800';
    case NotificationPriority.MEDIUM:
      return 'bg-yellow-100 border-yellow-200 text-yellow-800';
    case NotificationPriority.LOW:
      return 'bg-gray-100 border-gray-200 text-gray-800';
    default:
      return 'bg-gray-100 border-gray-200 text-gray-800';
  }
};

const getTypeLabel = (type: NotificationType) => {
  const labels = {
    [NotificationType.APPROVAL]: 'Aprobaciones',
    [NotificationType.REJECTION]: 'Rechazos',
    [NotificationType.ASSIGNMENT]: 'Asignaciones',
    [NotificationType.STATUS_CHANGE]: 'Cambios de Estado',
    [NotificationType.BACKUP_ALERT]: 'Alertas de Respaldo',
    [NotificationType.ERROR]: 'Errores',
    [NotificationType.SYSTEM]: 'Sistema'
  };
  return labels[type] || 'Desconocido';
};

const NotificationDropdown: React.FC = () => {
  const {
    notifications,
    groupedNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);

  const unreadFilteredCount = filteredNotifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      // En una app real, aquí navegarías a la URL
      console.log(`Navegando a: ${notification.actionUrl}`);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 rounded-lg hover:bg-secondary dark:hover:bg-secondary-dark transition-colors"
        >
          {unreadCount > 0 ? (
            <BellDot className="w-5 h-5 text-foreground dark:text-foreground-dark" />
          ) : (
            <Bell className="w-5 h-5 text-foreground dark:text-foreground-dark" />
          )}
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-96 p-0 bg-background border border-border shadow-lg" 
        align="end"
        sideOffset={5}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">Notificaciones</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Marcar todas como leídas
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={deleteAllRead}
              className="text-xs"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Limpiar leídas
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
            <TabsTrigger value="all" className="text-xs">
              Todas
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 w-4 rounded-full p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value={NotificationType.APPROVAL} className="text-xs">
              Aprobaciones
            </TabsTrigger>
            <TabsTrigger value={NotificationType.ASSIGNMENT} className="text-xs">
              Asignaciones
            </TabsTrigger>
            <TabsTrigger value={NotificationType.ERROR} className="text-xs">
              Errores
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-96">
            <TabsContent value={activeTab} className="m-0">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Bell className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No hay notificaciones</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                        !notification.isRead ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className={`text-sm font-medium truncate ${
                              !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {notification.title}
                            </p>
                            <div className="flex items-center gap-2 ml-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs px-1 py-0 ${getPriorityColor(notification.priority)}`}
                              >
                                {notification.priority.toUpperCase()}
                              </Badge>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(notification.createdAt), { 
                                addSuffix: true, 
                                locale: es 
                              })}
                            </span>
                            
                            <div className="flex items-center gap-1">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <Separator />
        
        <div className="p-3 bg-muted/30">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => {
              setOpen(false);
              // Aquí navegarías a la página de historial completo
              console.log('Navegando al historial completo de notificaciones');
            }}
          >
            Ver historial completo
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
