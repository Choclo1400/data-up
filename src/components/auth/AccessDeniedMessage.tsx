
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  ArrowLeft, 
  Lock, 
  UserX, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AccessDeniedMessageProps {
  requiredPermission?: string;
  requiredRole?: string;
  customMessage?: string;
  showUserInfo?: boolean;
}

const AccessDeniedMessage: React.FC<AccessDeniedMessageProps> = ({
  requiredPermission,
  requiredRole,
  customMessage,
  showUserInfo = true
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getIcon = () => {
    if (requiredPermission) return <Shield className="w-12 h-12 text-red-500" />;
    if (requiredRole) return <UserX className="w-12 h-12 text-orange-500" />;
    return <Lock className="w-12 h-12 text-gray-500" />;
  };

  const getTitle = () => {
    if (requiredPermission) return "Permiso Insuficiente";
    if (requiredRole) return "Rol No Autorizado";
    return "Acceso Denegado";
  };

  const getMessage = () => {
    if (customMessage) return customMessage;
    if (requiredPermission) {
      return "No tienes los permisos necesarios para acceder a esta funcionalidad.";
    }
    if (requiredRole) {
      return "Tu rol actual no te permite acceder a esta sección.";
    }
    return "No tienes autorización para acceder a este contenido.";
  };

  const getAlertType = () => {
    if (requiredPermission) return "default";
    if (requiredRole) return "destructive";
    return "default";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="py-8">
          <div className="text-center space-y-6">
            {/* Icono */}
            <div className="flex justify-center">
              {getIcon()}
            </div>

            {/* Título y mensaje principal */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                {getTitle()}
              </h2>
              <p className="text-muted-foreground">
                {getMessage()}
              </p>
            </div>

            {/* Información detallada */}
            <div className="space-y-3">
              {requiredPermission && (
                <Alert variant={getAlertType()}>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Permiso requerido:</p>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {requiredPermission}
                      </code>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {requiredRole && (
                <Alert variant={getAlertType()}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p><strong>Rol requerido:</strong> {requiredRole}</p>
                      {showUserInfo && user && (
                        <p><strong>Tu rol actual:</strong> {user.role}</p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Información del usuario actual */}
            {showUserInfo && user && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h3 className="font-medium text-sm">Tu información de acceso:</h3>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <p><strong>Usuario:</strong> {user.name}</p>
                  <p><strong>Rol:</strong> {user.role}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => navigate(-1)} 
                className="gap-2"
                variant="default"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
              
              <Button 
                onClick={() => navigate('/')} 
                variant="outline"
                className="gap-2"
              >
                <Shield className="w-4 h-4" />
                Ir al Dashboard
              </Button>
            </div>

            {/* Contacto con administrador */}
            <div className="text-xs text-muted-foreground border-t pt-4">
              <p>¿Necesitas acceso a esta función?</p>
              <p>Contacta a tu administrador del sistema.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDeniedMessage;
