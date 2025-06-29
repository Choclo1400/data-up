import React from 'react'
import { Bell, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover'
import { useAuth } from '@/contexts/AuthContext'
import { useNotifications, useMarkNotificationAsRead } from '@/hooks/useSupabaseQuery'

export const NotificationCenter: React.FC = () => {
  const { user } = useAuth()
  const { data: notifications, isLoading } = useNotifications(user?.id || '')
  const markAsRead = useMarkNotificationAsRead()

  const unreadCount = notifications?.data?.filter(n => !n.is_read).length || 0

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex items-center justify-between border-b pb-2">
          <h4 className="font-semibold">Notificaciones</h4>
          <Badge variant="secondary">{unreadCount} nuevas</Badge>
        </div>
        
        <ScrollArea className="h-64 mt-2">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Cargando...
            </div>
          ) : notifications?.data?.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No hay notificaciones
            </div>
          ) : (
            <div className="space-y-2">
              {notifications?.data?.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    !notification.is_read ? 'bg-accent' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">
                        {notification.title}
                      </h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}