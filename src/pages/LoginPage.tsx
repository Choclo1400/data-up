
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Building, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, complete todos los campos');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <Building className="w-8 h-8 text-primary" />
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Sistema de Solicitudes</CardTitle>
          <CardDescription>
            Ingrese sus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@inmel.cl"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Usuarios de prueba:</h4>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p><strong>Admin:</strong> admin@inmel.cl</p>
              <p><strong>Supervisor:</strong> supervisor@inmel.cl</p>
              <p><strong>Gestor:</strong> gestor@inmel.cl</p>
              <p><strong>Empleado:</strong> empleado@inmel.cl</p>
              <p><strong>Contraseña:</strong> password123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
