
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Mail, 
  Smartphone, 
  CheckCircle, 
  AlertTriangle,
  Settings
} from 'lucide-react';
import { use2FA } from '@/hooks/use2FA';
import TwoFactorModal from '@/components/auth/TwoFactorModal';

const TwoFactorAuth: React.FC = () => {
  const { 
    state, 
    loading, 
    sendVerificationCode, 
    verifyCode, 
    disable2FA, 
    resendCode, 
    cancelVerification 
  } = use2FA();

  const [showModal, setShowModal] = useState(false);

  const handleEnable2FA = async (method: '2fa-email' | '2fa-sms') => {
    await sendVerificationCode(method);
    setShowModal(true);
  };

  const handleVerifyCode = async (code: string) => {
    const success = await verifyCode(code);
    if (success) {
      setShowModal(false);
    }
    return success;
  };

  const handleModalClose = () => {
    setShowModal(false);
    cancelVerification();
  };

  const handleDisable = async () => {
    await disable2FA();
  };

  return (
    <div className="space-y-6">
      {/* Estado actual del 2FA */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <CardTitle>Autenticación de Dos Factores (2FA)</CardTitle>
                <CardDescription>
                  Agrega una capa extra de seguridad a tu cuenta
                </CardDescription>
              </div>
            </div>
            <Badge 
              variant={state.isEnabled ? "default" : "secondary"}
              className="gap-1"
            >
              {state.isEnabled ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Activado
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  Desactivado
                </>
              )}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {state.isEnabled ? (
            // 2FA está activado
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  La autenticación de dos factores está <strong>activada</strong> mediante{' '}
                  {state.method === '2fa-email' ? 'correo electrónico' : 'SMS'}.
                  Tu cuenta está protegida con seguridad adicional.
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {state.method === '2fa-email' ? (
                    <Mail className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Smartphone className="w-5 h-5 text-green-600" />
                  )}
                  <div>
                    <p className="font-medium">
                      {state.method === '2fa-email' ? 'Email' : 'SMS'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Método de verificación activo
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleDisable}
                  disabled={loading}
                >
                  Desactivar
                </Button>
              </div>
            </div>
          ) : (
            // 2FA está desactivado
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Tu cuenta no tiene autenticación de dos factores activada. 
                  Recomendamos activarla para mayor seguridad.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Opción Email */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-6 h-6 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Por Email</h4>
                      <p className="text-sm text-muted-foreground">
                        Recibe códigos en tu correo
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleEnable2FA('2fa-email')}
                    disabled={loading || state.pendingVerification}
                    className="w-full"
                    variant="outline"
                  >
                    Activar con Email
                  </Button>
                </div>

                {/* Opción SMS */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-6 h-6 text-green-600" />
                    <div>
                      <h4 className="font-medium">Por SMS</h4>
                      <p className="text-sm text-muted-foreground">
                        Recibe códigos en tu móvil
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleEnable2FA('2fa-sms')}
                    disabled={loading || state.pendingVerification}
                    className="w-full"
                    variant="outline"
                  >
                    Activar con SMS
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-medium text-sm">¿Cómo funciona?</h4>
                <p className="text-xs text-muted-foreground">
                  La autenticación de dos factores requiere un código adicional 
                  cada vez que inicies sesión, enviado a tu email o teléfono móvil.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de verificación */}
      <TwoFactorModal
        isOpen={showModal}
        onClose={handleModalClose}
        onVerify={handleVerifyCode}
        onResendCode={resendCode}
        method={state.method}
        loading={loading}
      />
    </div>
  );
};

export default TwoFactorAuth;
