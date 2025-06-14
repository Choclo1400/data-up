import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Save, RotateCcw, HardDrive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BackupManagement from '@/components/settings/BackupManagement';

interface SystemConfig {
  companyName: string;
  defaultMaxRequests: number;
  emailNotifications: boolean;
  darkMode: boolean;
  language: string;
  timezone: string;
  autoAssignRequests: boolean;
  backupFrequency: string;
  sessionTimeout: number;
  maintenanceMode: boolean;
  systemMessage: string;
}

const SettingsPage: React.FC = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [config, setConfig] = useState<SystemConfig>({
    companyName: 'Inmel Chile',
    defaultMaxRequests: 5,
    emailNotifications: true,
    darkMode: false,
    language: 'es',
    timezone: 'America/Santiago',
    autoAssignRequests: true,
    backupFrequency: 'daily',
    sessionTimeout: 30,
    maintenanceMode: false,
    systemMessage: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSaveConfig = async () => {
    setLoading(true);
    
    try {
      // Simular guardado en MongoDB
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Configuración guardada:', config);
      
      toast({
        title: "Configuración guardada",
        description: "Los cambios han sido aplicados exitosamente.",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetConfig = () => {
    if (!confirm('¿Estás seguro de que quieres restaurar la configuración por defecto?')) return;
    
    setConfig({
      companyName: 'Inmel Chile',
      defaultMaxRequests: 5,
      emailNotifications: true,
      darkMode: false,
      language: 'es',
      timezone: 'America/Santiago',
      autoAssignRequests: true,
      backupFrequency: 'daily',
      sessionTimeout: 30,
      maintenanceMode: false,
      systemMessage: ''
    });
    
    toast({
      title: "Configuración restaurada",
      description: "Se han aplicado los valores por defecto.",
    });
  };

  const updateConfig = (key: keyof SystemConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Configuración del Sistema" 
          subtitle="Administra parámetros y preferencias globales"
        />
        
        <main className="flex-1 px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Configuración</h1>
                <p className="text-muted-foreground">Administra los parámetros del sistema</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleResetConfig} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Restaurar
              </Button>
              <Button onClick={handleSaveConfig} disabled={loading} className="gap-2">
                <Save className="w-4 h-4" />
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Configuración General</TabsTrigger>
              <TabsTrigger value="backups" className="gap-2">
                <HardDrive className="w-4 h-4" />
                Respaldos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Configuración General */}
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración General</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Nombre de la Empresa</Label>
                      <Input
                        id="companyName"
                        value={config.companyName}
                        onChange={(e) => updateConfig('companyName', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="defaultMaxRequests">Máximo de Solicitudes por Técnico</Label>
                      <Input
                        id="defaultMaxRequests"
                        type="number"
                        min="1"
                        max="20"
                        value={config.defaultMaxRequests}
                        onChange={(e) => updateConfig('defaultMaxRequests', parseInt(e.target.value))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="language">Idioma</Label>
                      <Select 
                        value={config.language} 
                        onValueChange={(value) => updateConfig('language', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="timezone">Zona Horaria</Label>
                      <Select 
                        value={config.timezone} 
                        onValueChange={(value) => updateConfig('timezone', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Santiago">Santiago, Chile</SelectItem>
                          <SelectItem value="America/Buenos_Aires">Buenos Aires, Argentina</SelectItem>
                          <SelectItem value="America/Lima">Lima, Perú</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Configuración de Sistema */}
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Sistema</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications">Notificaciones por Email</Label>
                        <p className="text-sm text-muted-foreground">Enviar notificaciones automáticas</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={config.emailNotifications}
                        onCheckedChange={(value) => updateConfig('emailNotifications', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="darkMode">Modo Oscuro</Label>
                        <p className="text-sm text-muted-foreground">Tema oscuro por defecto</p>
                      </div>
                      <Switch
                        id="darkMode"
                        checked={config.darkMode}
                        onCheckedChange={(value) => updateConfig('darkMode', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoAssignRequests">Asignación Automática</Label>
                        <p className="text-sm text-muted-foreground">Asignar solicitudes automáticamente</p>
                      </div>
                      <Switch
                        id="autoAssignRequests"
                        checked={config.autoAssignRequests}
                        onCheckedChange={(value) => updateConfig('autoAssignRequests', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="maintenanceMode">Modo Mantenimiento</Label>
                        <p className="text-sm text-muted-foreground">Activar modo mantenimiento</p>
                      </div>
                      <Switch
                        id="maintenanceMode"
                        checked={config.maintenanceMode}
                        onCheckedChange={(value) => updateConfig('maintenanceMode', value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        min="5"
                        max="480"
                        value={config.sessionTimeout}
                        onChange={(e) => updateConfig('sessionTimeout', parseInt(e.target.value))}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Configuración de Respaldo */}
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Respaldo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="backupFrequency">Frecuencia de Respaldo</Label>
                      <Select 
                        value={config.backupFrequency} 
                        onValueChange={(value) => updateConfig('backupFrequency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Cada hora</SelectItem>
                          <SelectItem value="daily">Diario</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="monthly">Mensual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Mensaje del Sistema */}
                <Card>
                  <CardHeader>
                    <CardTitle>Mensaje del Sistema</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="systemMessage">Mensaje para Usuarios</Label>
                      <Textarea
                        id="systemMessage"
                        placeholder="Mensaje que se mostrará a todos los usuarios..."
                        value={config.systemMessage}
                        onChange={(e) => updateConfig('systemMessage', e.target.value)}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="backups">
              <BackupManagement />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
