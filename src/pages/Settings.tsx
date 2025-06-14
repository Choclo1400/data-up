import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, KeyRound, CheckCircle } from 'lucide-react';
import TwoFactorAuth from '@/components/settings/TwoFactorAuth';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!password || !newPassword || !confirmPassword) {
      setPasswordError('Por favor, complete todos los campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden');
      return;
    }

    setLoading(true);
    // Simular llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);

    setPasswordError('Contraseña actualizada exitosamente');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Configuración</h2>
        <p className="text-muted-foreground">
          Administra la configuración de tu cuenta y preferencias.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="backup">Respaldos</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>
                Aquí puedes actualizar tu información personal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>En desarrollo...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <TwoFactorAuth />
          
          {/* Configuración de contraseñas existente */}
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
              <CardDescription>
                Actualiza tu contraseña para mantener tu cuenta segura.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">Contraseña Actual</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">Nueva Contraseña</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>

                {passwordError && (
                  <Alert variant="destructive">
                    <KeyRound className="h-4 w-4" />
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Cambiar Contraseña
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Respaldos</CardTitle>
              <CardDescription>
                Administra los respaldos de tu sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>En desarrollo...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sistema</CardTitle>
              <CardDescription>
                Configuración avanzada del sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>En desarrollo...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
