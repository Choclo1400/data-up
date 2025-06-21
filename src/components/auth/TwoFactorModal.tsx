import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { 
  Shield, 
  Mail, 
  Smartphone, 
  Clock, 
  RefreshCw,
  AlertTriangle 
} from 'lucide-react';

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<boolean>;
  onResendCode: () => Promise<void>;
  method: '2fa-email' | '2fa-sms' | null;
  loading: boolean;
}

export const TwoFactorModal: React.FC<TwoFactorModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  onResendCode,
  method,
  loading
}) => {
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);

  // Countdown para reenvío
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (code.length !== 6) return;
    
    setLastError(null);
    const success = await onVerify(code);
    
    if (!success) {
      setAttempts(prev => prev + 1);
      setCode('');
      setLastError('Código incorrecto. Verifica e inténtalo de nuevo.');
    }
  };

  const handleResend = async () => {
    await onResendCode();
    setCountdown(60); // 60 segundos de espera
    setAttempts(0);
    setLastError(null);
    setCode('');
  };

  const getMethodInfo = () => {
    if (method === '2fa-email') {
      return {
        icon: <Mail className="w-8 h-8 text-blue-600" />,
        title: 'Verificación por Email',
        description: 'Ingresa el código de 6 dígitos enviado a tu correo electrónico.',
        destination: 'correo electrónico'
      };
    } else {
      return {
        icon: <Smartphone className="w-8 h-8 text-green-600" />,
        title: 'Verificación por SMS',
        description: 'Ingresa el código de 6 dígitos enviado a tu teléfono móvil.',
        destination: 'teléfono móvil'
      };
    }
  };

  const methodInfo = getMethodInfo();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              {methodInfo.icon}
            </div>
          </div>
          <DialogTitle>{methodInfo.title}</DialogTitle>
          <DialogDescription>
            {methodInfo.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Código OTP */}
          <div className="space-y-3">
            <Label htmlFor="verification-code">Código de Verificación</Label>
            <div className="flex justify-center">
              <InputOTP
                value={code}
                onChange={setCode}
                maxLength={6}
                disabled={loading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            {/* Código de prueba */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                <strong>Código de prueba:</strong> 123456
              </p>
            </div>
          </div>

          {/* Errores */}
          {lastError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {lastError}
                {attempts >= 3 && (
                  <span className="block mt-1 text-xs">
                    Has fallado {attempts} veces. Considera reenviar el código.
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Información de reenvío */}
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              ¿No recibiste el código en tu {methodInfo.destination}?
            </p>
            
            {countdown > 0 ? (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Podrás reenviar en {countdown} segundos</span>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResend}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reenviar Código
              </Button>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleVerify} 
            disabled={loading || code.length !== 6}
            className="gap-2"
          >
            {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
            Verificar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};