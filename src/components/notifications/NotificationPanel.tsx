
import React, { useState } from 'react';
import { Bell, BellDot, Check, CheckCheck, Trash2, Clock, AlertTriangle, CheckCircle, XCircle, Settings, User, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationType, NotificationPriority } from '@/types/notifications';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.APPROVAL:
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case NotificationType.REJECTION:
      return <XCircle className="w-5 h-5 text-red-500" />;
    case NotificationType.ASSIGNMENT:
      return <User className="w-5 h-5 text-blue-500" />;
    case NotificationType.STATUS_CHANGE:
      return <Activity className="w-5 h-5 text-orange-500" />;
    case NotificationType.BACKUP_ALERT:
      return <Settings className="w-5 h-5 text-purple-500" />;
    case NotificationType.ERROR:
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    case NotificationType.SYSTEM:
      return <Bell className="w-5 h-5 text-gray-500" />;
    default:
      return <Bell className="w-5 h-5 text-gray-500" />;
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

const NotificationPanel: React.FC = () => {
  const {
    notifications,
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

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      console.log(`Navegando a: ${notification.actionUrl}`);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          {unreadCount > 0 ? (
            <BellDot className="w-5 h-5 text-foreground" />
          ) : (
            <Bell className="w-5 h-5 text-foreground" />
          )}
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      
      <DrawerContent className="h-[85vh] flex flex-col">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-xl font-semibold">Centro de Notificaciones</DrawerTitle>
              <DrawerDescription>
                {unreadCount > 0 ? `${unreadCount} notificaciones sin leer` : 'Todas las notificaciones están al día'}
              </DrawerDescription>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  <CheckCheck className="w-4 h-4 mr-1" />
                  Marcar todas
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={deleteAllRead}
                className="text-xs"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Limpiar leídas
              </Button>
            </div>
          </div>
        </DrawerHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4 mx-6 mt-4">
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

          <div className="flex-1 overflow-hidden">
            <TabsContent value={activeTab} className="h-full m-0">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Bell className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No hay notificaciones</p>
                  <p className="text-sm">Las nuevas notificaciones aparecerán aquí</p>
                </div>
              ) : (
                <ScrollArea className="h-full px-6">
                  <div className="space-y-3 py-4">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-xl border border-border hover:shadow-md cursor-pointer transition-all duration-200 ${
                          !notification.isRead 
                            ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800' 
                            : 'bg-card hover:bg-accent/50'
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <p className={`text-sm font-medium ${
                                !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                                {notification.title}
                              </p>
                              <div className="flex items-center gap-2 ml-2">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs px-2 py-0.5 ${getPriorityColor(notification.priority)}`}
                                >
                                  {notification.priority.toUpperCase()}
                                </Badge>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                )}
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
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
                                    className="h-7 w-7 p-0 hover:bg-green-100 dark:hover:bg-green-900/20"
                                  >
                                    <Check className="w-3 h-3 text-green-600" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="h-7 w-7 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="w-3 h-3 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <Separator />
        
        <DrawerFooter className="pt-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setOpen(false);
              console.log('Navegando al historial completo de notificaciones');
            }}
            className="w-full"
          >
            Ver historial completo de notificaciones
          </Button>
          <DrawerClose asChild>
            <Button variant="ghost">Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default NotificationPanel;
