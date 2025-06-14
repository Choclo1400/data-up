
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission,
  requiredRole 
}) => {
  const { isAuthenticated, hasPermission, hasRole, loading, user } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Cargando...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="py-8 text-center">
            <h2 className="text-xl font-semibold mb-3 text-destructive">Acceso Denegado</h2>
            <p className="text-muted-foreground mb-4">
              No tienes los permisos necesarios para acceder a esta sección.
            </p>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Permiso requerido: <span className="font-medium">{requiredPermission}</span>
            </p>
            <Button onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requiredRole && !hasRole(requiredRole as any)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="py-8 text-center">
            <h2 className="text-xl font-semibold mb-3 text-destructive">Acceso Denegado</h2>
            <p className="text-muted-foreground mb-4">
              Tu rol actual no te permite acceder a esta sección.
            </p>
            <p className="text-sm text-muted-foreground mt-2 mb-1">
              Rol requerido: <span className="font-medium">{requiredRole}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Tu rol: <span className="font-medium">{user?.role}</span>
            </p>
            <Button onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
