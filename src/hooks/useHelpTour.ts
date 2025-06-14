
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export const useHelpTour = () => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);

  // Pasos del tour por rol
  const getTourSteps = (): TourStep[] => {
    const commonSteps: TourStep[] = [
      {
        id: 'welcome',
        title: '¡Bienvenido a Inmel!',
        content: 'Te vamos a mostrar las principales funciones del sistema.',
        target: 'body',
        position: 'bottom'
      },
      {
        id: 'navigation',
        title: 'Navegación Principal',
        content: 'Aquí encontrarás todas las opciones disponibles según tu rol.',
        target: '[data-tour="navigation"]',
        position: 'right'
      },
      {
        id: 'user-menu',
        title: 'Menú de Usuario',
        content: 'Accede a tu perfil, configuración y cerrar sesión.',
        target: '[data-tour="user-menu"]',
        position: 'left'
      }
    ];

    if (!user) return commonSteps;

    const roleSpecificSteps: Record<string, TourStep[]> = {
      ADMIN: [
        {
          id: 'admin-users',
          title: 'Gestión de Usuarios',
          content: 'Administra usuarios, roles y permisos del sistema.',
          target: '[href="/users"]',
          position: 'right'
        },
        {
          id: 'admin-audit',
          title: 'Auditoría',
          content: 'Revisa el registro de todas las actividades del sistema.',
          target: '[href="/audit"]',
          position: 'right'
        }
      ],
      OPERATOR: [
        {
          id: 'operator-requests',
          title: 'Mis Solicitudes',
          content: 'Aquí puedes ver y gestionar tus solicitudes.',
          target: '[href="/requests"]',
          position: 'right'
        },
        {
          id: 'operator-new',
          title: 'Nueva Solicitud',
          content: 'Crea nuevas solicitudes de servicio fácilmente.',
          target: '[href="/requests/new"]',
          position: 'right'
        }
      ]
    };

    return [...commonSteps, ...(roleSpecificSteps[user.role] || [])];
  };

  const steps = getTourSteps();

  // Verificar si el usuario ya completó el tour
  useEffect(() => {
    if (user) {
      const tourCompleted = localStorage.getItem(`tour-completed-${user.id}`);
      setHasCompletedTour(!!tourCompleted);
      
      // Iniciar tour automáticamente para usuarios nuevos
      if (!tourCompleted) {
        const timer = setTimeout(() => {
          setIsActive(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const startTour = () => {
    setCurrentStep(0);
    setIsActive(true);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    setIsActive(false);
    setCurrentStep(0);
    if (user) {
      localStorage.setItem(`tour-completed-${user.id}`, 'true');
      setHasCompletedTour(true);
    }
  };

  const skipTour = () => {
    completeTour();
  };

  return {
    isActive,
    currentStep,
    steps,
    hasCompletedTour,
    startTour,
    nextStep,
    prevStep,
    completeTour,
    skipTour
  };
};
