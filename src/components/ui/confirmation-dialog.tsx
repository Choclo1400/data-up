
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Trash2, Archive, Power } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  type?: 'delete' | 'archive' | 'disable' | 'generic';
  loading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText = 'Cancelar',
  variant = 'danger',
  type = 'generic',
  loading = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'delete':
        return <Trash2 className="h-6 w-6 text-red-600" />;
      case 'archive':
        return <Archive className="h-6 w-6 text-orange-600" />;
      case 'disable':
        return <Power className="h-6 w-6 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
    }
  };

  const getConfirmText = () => {
    if (confirmText) return confirmText;
    
    switch (type) {
      case 'delete':
        return 'Eliminar';
      case 'archive':
        return 'Archivar';
      case 'disable':
        return 'Desactivar';
      default:
        return 'Confirmar';
    }
  };

  const getButtonVariant = () => {
    return variant === 'danger' ? 'destructive' : 'default';
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={loading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={getButtonVariant() === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}
            disabled={loading}
          >
            {loading ? 'Procesando...' : getConfirmText()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
