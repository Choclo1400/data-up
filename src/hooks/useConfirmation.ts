
import { useState } from 'react';

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  variant?: 'danger' | 'warning' | 'info';
  type?: 'delete' | 'archive' | 'disable' | 'generic';
  confirmText?: string;
  cancelText?: string;
}

export const useConfirmation = () => {
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  const showConfirmation = (config: Omit<ConfirmationState, 'isOpen'>) => {
    setConfirmation({
      ...config,
      isOpen: true,
    });
  };

  const hideConfirmation = () => {
    setConfirmation(prev => ({
      ...prev,
      isOpen: false,
    }));
  };

  const confirm = () => {
    confirmation.onConfirm();
    hideConfirmation();
  };

  return {
    confirmation,
    showConfirmation,
    hideConfirmation,
    confirm,
  };
};
