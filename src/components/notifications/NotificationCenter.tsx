
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  MarkAsUnread
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
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case NotificationType.REJECTION:
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case NotificationType.ASSIGNMENT:
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      case NotificationType.STATUS_CHANGE:
        return <FileText className="w-5 h-5 text-orange-500" />;
      case NotificationType.SYSTEM:
        return <Info className="w-5 h-5 text-gray-500" />;
      case NotificationType.BACKUP_ALERT:
        return <Shield className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-96 sm:w-[480px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificaciones
            </SheetTitle>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={markAllAsRead}
              >
                Marcar todas como leídas
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No tienes notificaciones</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                      notification.isRead 
                        ? 'bg-white border-gray-200' 
                        : `${getPriorityColor(notification.priority)} border-l-4`
                    }`}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-medium ${
                            notification.isRead ? 'text-gray-900' : 'text-gray-900 font-semibold'
                          }`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                              locale: es
                            })}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {notification.type.replace('_', ' ')}
                            </Badge>
                            
                            {notification.actionUrl && (
                              <Button variant="outline" size="sm" className="h-6 text-xs">
                                Ver detalles
                              </Button>
                            )}
                          </div>
                        </div>
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
