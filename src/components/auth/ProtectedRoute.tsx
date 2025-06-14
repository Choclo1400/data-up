
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import AccessDeniedMessage from './AccessDeniedMessage';

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
      <AccessDeniedMessage 
        requiredPermission={requiredPermission}
        showUserInfo={true}
      />
    );
  }

  if (requiredRole && !hasRole(requiredRole as any)) {
    return (
      <AccessDeniedMessage 
        requiredRole={requiredRole}
        showUserInfo={true}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
