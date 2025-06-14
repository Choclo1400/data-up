
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface TwoFactorAuthState {
  isEnabled: boolean;
  isVerifying: boolean;
  pendingVerification: boolean;
  method: '2fa-email' | '2fa-sms' | null;
}

export const use2FA = () => {
  const [state, setState] = useState<TwoFactorAuthState>({
    isEnabled: false,
    isVerifying: false,
    pendingVerification: false,
    method: null
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sendVerificationCode = async (method: '2fa-email' | '2fa-sms') => {
    setLoading(true);
    
    try {
      // Simular envío de código
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setState(prev => ({
        ...prev,
        pendingVerification: true,
        method,
        isVerifying: true
      }));

      toast({
        title: "Código enviado",
        description: method === '2fa-email' 
          ? "Se ha enviado un código de verificación a tu correo electrónico."
          : "Se ha enviado un código de verificación a tu teléfono móvil.",
      });

    } catch (error) {
      toast({
        title: "Error al enviar código",
        description: "No se pudo enviar el código de verificación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (code: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simular verificación - código correcto es "123456"
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (code === '123456') {
        setState(prev => ({
          ...prev,
          isEnabled: true,
          isVerifying: false,
          pendingVerification: false,
          method: prev.method
        }));

        toast({
          title: "2FA activado",
          description: "La autenticación de dos factores ha sido activada exitosamente.",
        });

        return true;
      } else {
        toast({
          title: "Código incorrecto",
          description: "El código ingresado no es válido. Verifica e inténtalo de nuevo.",
          variant: "destructive",
        });
        return false;
      }

    } catch (error) {
      toast({
        title: "Error de verificación",
        description: "No se pudo verificar el código. Inténtalo de nuevo.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState({
        isEnabled: false,
        isVerifying: false,
        pendingVerification: false,
        method: null
      });

      toast({
        title: "2FA desactivado",
        description: "La autenticación de dos factores ha sido desactivada.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo desactivar el 2FA.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (state.method) {
      await sendVerificationCode(state.method);
    }
  };

  const cancelVerification = () => {
    setState(prev => ({
      ...prev,
      isVerifying: false,
      pendingVerification: false,
      method: null
    }));
  };

  return {
    state,
    loading,
    sendVerificationCode,
    verifyCode,
    disable2FA,
    resendCode,
    cancelVerification
  };
};
