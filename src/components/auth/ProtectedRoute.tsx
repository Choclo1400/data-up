
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="py-8 text-center">
            <h2 className="text-lg font-semibold mb-2">Acceso Denegado</h2>
            <p className="text-muted-foreground">
              No tienes permisos para acceder a esta sección.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Rol actual: {user?.role}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requiredRole && !hasRole(requiredRole as any)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="py-8 text-center">
            <h2 className="text-lg font-semibold mb-2">Acceso Denegado</h2>
            <p className="text-muted-foreground">
              Tu rol no permite acceder a esta sección.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Rol requerido: {requiredRole} | Tu rol: {user?.role}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
