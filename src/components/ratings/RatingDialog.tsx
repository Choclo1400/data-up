
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreateRatingData } from '@/types/ratings';

interface RatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: CreateRatingData) => Promise<void>;
  requestId: string;
  requestTitle: string;
  technicianName: string;
  loading?: boolean;
}

const RatingDialog: React.FC<RatingDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  requestId,
  requestTitle,
  technicianName,
  loading = false
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    try {
      await onSubmit({
        requestId,
        rating,
        comment: comment.trim() || undefined
      });
      
      // Reset form
      setRating(0);
      setHoveredRating(0);
      setComment('');
      onClose();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setComment('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Calificar Servicio</DialogTitle>
          <DialogDescription>
            ¿Cómo calificarías el servicio recibido?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Solicitud</h4>
            <p className="text-sm">{requestTitle}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Técnico</h4>
            <p className="text-sm">{technicianName}</p>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Calificación</Label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 hover:scale-110 transition-transform"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={cn(
                      "w-8 h-8 transition-colors",
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="comment" className="text-sm font-medium">
              Comentarios (opcional)
            </Label>
            <Textarea
              id="comment"
              placeholder="Comparte tu experiencia con el servicio..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || loading}
              className="flex-1"
            >
              Enviar Calificación
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
