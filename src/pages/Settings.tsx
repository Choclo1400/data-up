import React from 'react'
import { Settings as SettingsIcon, User, Bell, Shield, Database } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">
          Configuración general del sistema
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Perfil de Usuario</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-notifications">
                Notificaciones de perfil
              </Label>
              <Switch id="profile-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-updates">
                Actualizaciones por email
              </Label>
              <Switch id="email-updates" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notificaciones</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">
                Notificaciones push
              </Label>
              <Switch id="push-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-notifications">
                Sonidos de notificación
              </Label>
              <Switch id="sound-notifications" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Seguridad</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor">
                Autenticación de dos factores
              </Label>
              <Switch id="two-factor" />
            </div>
            <Separator />
            <Button variant="outline">
              Cambiar Contraseña
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-backup">
                Respaldo automático
              </Label>
              <Switch id="auto-backup" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance-mode">
                Modo mantenimiento
              </Label>
              <Switch id="maintenance-mode" />
            </div>
            <Separator />
            <div className="flex space-x-2">
              <Button variant="outline">
                Exportar Datos
              </Button>
              <Button variant="outline">
                Limpiar Cache
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Settings