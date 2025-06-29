import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  UserPlus, 
  FileText,
  Shield,
  Trash2,
  Check,
  Clock,
  X
} from 'lucide-react';
import { NotificationType } from '@/types/notifications';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.APPROVAL:
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case NotificationType.REJECTION:
        return <X className="w-4 h-4 text-rose-500" />;
      case NotificationType.ASSIGNMENT:
        return <UserPlus className="w-4 h-4 text-blue-500" />;
      case NotificationType.STATUS_CHANGE:
        return <FileText className="w-4 h-4 text-amber-500" />;
      case NotificationType.SYSTEM:
        return <Info className="w-4 h-4 text-gray-500" />;
      case NotificationType.BACKUP_ALERT:
        return <Shield className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'border-l-4 border-l-red-400 bg-red-50/50 dark:bg-red-950/10';
      case 'HIGH':
        return 'border-l-4 border-l-orange-400 bg-orange-50/50 dark:bg-orange-950/10';
      case 'MEDIUM':
        return 'border-l-4 border-l-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/10';
      default:
        return 'border-l-4 border-l-blue-400 bg-blue-50/50 dark:bg-blue-950/10';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative hover:bg-secondary/80 transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-medium animate-pulse"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-96 sm:w-[480px] flex flex-col">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Notificaciones</h2>
                <p className="text-sm text-muted-foreground font-normal">
                  {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
                </p>
              </div>
            </SheetTitle>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <Check className="w-3 h-3 mr-1" />
                Marcar todas
              </Button>
            )}
          </div>
        </SheetHeader>

        <Separator />

        <div className="flex-1 overflow-hidden">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="p-4 bg-muted/50 rounded-full mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Sin notificaciones</h3>
              <p className="text-sm text-muted-foreground">
                Las nuevas notificaciones aparecerán aquí
              </p>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="space-y-2 p-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group relative p-4 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-md ${
                      notification.isRead 
                        ? 'bg-card hover:bg-accent/50' 
                        : `${getPriorityColor(notification.priority)} hover:shadow-lg`
                    }`}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                  >
                    {/* Indicator dot for unread */}
                    {!notification.isRead && (
                      <div className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full animate-pulse" />
                    )}
                    
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 bg-background rounded-lg shadow-sm">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm font-medium leading-tight ${
                            notification.isRead ? 'text-foreground/80' : 'text-foreground'
                          }`}>
                            {notification.title}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs shrink-0 ${getPriorityBadgeColor(notification.priority)}`}
                          >
                            {notification.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                              locale: es
                            })}
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="h-7 w-7 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/20"
                              >
                                <Check className="w-3 h-3 text-emerald-600" />
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
                        
                        {notification.actionUrl && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(`Navegando a: ${notification.actionUrl}`);
                            }}
                          >
                            Ver detalles
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationCenter;