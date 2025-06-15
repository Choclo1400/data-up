
import React, { useState } from 'react';
import { Bell, BellDot, Check, CheckCheck, Trash2, Clock, AlertTriangle, CheckCircle, XCircle, Settings, User, Activity, FolderOpen } from 'lucide-react';
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
import { cn } from '@/lib/utils';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.APPROVAL:
      return <CheckCircle className="w-5 h-5 text-success-600" />;
    case NotificationType.REJECTION:
      return <XCircle className="w-5 h-5 text-error-600" />;
    case NotificationType.ASSIGNMENT:
      return <User className="w-5 h-5 text-info-600" />;
    case NotificationType.STATUS_CHANGE:
      return <Activity className="w-5 h-5 text-warning-600" />;
    case NotificationType.BACKUP_ALERT:
      return <FolderOpen className="w-5 h-5 text-purple-600" />;
    case NotificationType.ERROR:
      return <AlertTriangle className="w-5 h-5 text-error-600" />;
    case NotificationType.SYSTEM:
      return <Settings className="w-5 h-5 text-gray-600" />;
    default:
      return <Bell className="w-5 h-5 text-gray-600" />;
  }
};

const getPriorityColor = (priority: NotificationPriority) => {
  switch (priority) {
    case NotificationPriority.CRITICAL:
      return 'bg-error-50 border-error-200 text-error-800';
    case NotificationPriority.HIGH:
      return 'bg-warning-50 border-warning-200 text-warning-800';
    case NotificationPriority.MEDIUM:
      return 'bg-info-50 border-info-200 text-info-800';
    case NotificationPriority.LOW:
      return 'bg-gray-50 border-gray-200 text-gray-800';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-800';
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

  // Ordenar notificaciones por fecha (más recientes primero)
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredNotifications = activeTab === 'all' 
    ? sortedNotifications 
    : sortedNotifications.filter(n => n.type === activeTab);

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
          className="relative p-2 rounded-lg hover:bg-secondary transition-all duration-200 hover:scale-105"
        >
          {unreadCount > 0 ? (
            <BellDot className="w-5 h-5 text-foreground animate-pulse" />
          ) : (
            <Bell className="w-5 h-5 text-foreground" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-bounce"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      
      <DrawerContent className="h-[85vh] flex flex-col">
        <DrawerHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-xl font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Centro de Notificaciones
              </DrawerTitle>
              <DrawerDescription className="text-sm mt-1">
                {unreadCount > 0 
                  ? `${unreadCount} notificaciones sin leer` 
                  : '¡Todo en orden! No hay notificaciones nuevas'
                }
              </DrawerDescription>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs hover:scale-105 transition-transform"
                >
                  <CheckCheck className="w-4 h-4 mr-1" />
                  Marcar todas
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={deleteAllRead}
                className="text-xs hover:scale-105 transition-transform"
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
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Bell className="w-10 h-10 text-primary/60" />
                  </div>
                  <p className="text-lg font-medium mb-2">No tienes notificaciones recientes</p>
                  <p className="text-sm text-center">¡Todo en orden! Las nuevas notificaciones aparecerán aquí</p>
                </div>
              ) : (
                <ScrollArea className="h-full px-6">
                  <div className="space-y-4 py-4">
                    {filteredNotifications.map((notification, index) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-md hover:scale-[1.02]",
                          !notification.isRead 
                            ? 'bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-primary/30 shadow-sm' 
                            : 'bg-card hover:bg-accent/30 border-border'
                        )}
                        onClick={() => handleNotificationClick(notification)}
                        style={{ 
                          animationDelay: `${index * 50}ms`,
                          animation: 'fade-in 0.3s ease-out forwards'
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1 p-2 rounded-lg bg-background shadow-sm">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <p className={cn(
                                "text-sm font-semibold",
                                !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                              )}>
                                {notification.title}
                              </p>
                              <div className="flex items-center gap-2 ml-2">
                                <Badge 
                                  variant="outline" 
                                  className={cn("text-xs px-2 py-1", getPriorityColor(notification.priority))}
                                >
                                  {notification.priority.toUpperCase()}
                                </Badge>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-lg" />
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
                                    className="h-8 px-3 text-xs hover:bg-success-100 hover:text-success-700 transition-colors"
                                  >
                                    <Check className="w-3 h-3 mr-1" />
                                    Marcar como leído
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="h-7 w-7 p-0 hover:bg-error-100 hover:text-error-700 transition-colors"
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
                </ScrollArea>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <Separator />
        
        <DrawerFooter className="pt-4 bg-gradient-to-r from-secondary/5 to-primary/5">
          <Button 
            variant="outline" 
            onClick={() => {
              setOpen(false);
              console.log('Navegando al historial completo de notificaciones');
            }}
            className="w-full hover:scale-105 transition-transform"
          >
            Ver historial completo de notificaciones
          </Button>
          <DrawerClose asChild>
            <Button variant="ghost" className="hover:scale-105 transition-transform">
              Cerrar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default NotificationPanel;
