
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';
import { useHelpTour } from '@/hooks/useHelpTour';

const TourOverlay: React.FC = () => {
  const { 
    isActive, 
    currentStep, 
    steps, 
    nextStep, 
    prevStep, 
    completeTour, 
    skipTour 
  } = useHelpTour();
  
  const [targetPosition, setTargetPosition] = useState<{x: number, y: number} | null>(null);

  useEffect(() => {
    if (isActive && steps[currentStep]) {
      const targetElement = document.querySelector(steps[currentStep].target);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setTargetPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      } else {
        setTargetPosition(null);
      }
    } else {
      setTargetPosition(null);
    }
  }, [isActive, currentStep, steps]);

  if (!isActive || !steps[currentStep]) return null;

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const getTooltipPosition = () => {
    if (!targetPosition) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    
    const { position } = currentStepData;
    const offset = 320; // Increased offset for better spacing
    const cardWidth = 320; // Fixed card width
    
    let style = { transform: 'translate(-50%, -50%)' };
    
    switch (position) {
      case 'top':
        return { 
          top: Math.max(targetPosition.y - offset, 100), 
          left: Math.min(Math.max(targetPosition.x, cardWidth / 2), window.innerWidth - cardWidth / 2),
          ...style
        };
      case 'bottom':
        return { 
          top: Math.min(targetPosition.y + offset, window.innerHeight - 200), 
          left: Math.min(Math.max(targetPosition.x, cardWidth / 2), window.innerWidth - cardWidth / 2),
          ...style
        };
      case 'left':
        return { 
          top: Math.min(Math.max(targetPosition.y, 150), window.innerHeight - 150), 
          left: Math.max(targetPosition.x - offset, cardWidth / 2),
          ...style
        };
      case 'right':
        return { 
          top: Math.min(Math.max(targetPosition.y, 150), window.innerHeight - 150), 
          left: Math.min(targetPosition.x + offset, window.innerWidth - cardWidth / 2),
          ...style
        };
      default:
        return { 
          top: Math.min(Math.max(targetPosition.y, 150), window.innerHeight - 150), 
          left: Math.min(Math.max(targetPosition.x, cardWidth / 2), window.innerWidth - cardWidth / 2),
          ...style
        };
    }
  };

  const tooltipStyle = getTooltipPosition();

  return (
    <>
      {/* Overlay de fondo */}
      <div className="fixed inset-0 bg-black/50 z-50" />
      
      {/* Spotlight en el elemento target */}
      {targetPosition && (
        <div 
          className="fixed border-4 border-primary rounded-lg z-50 pointer-events-none animate-pulse"
          style={{
            left: targetPosition.x - 60,
            top: targetPosition.y - 60,
            width: 120,
            height: 120,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
          }}
        />
      )}
      
      {/* Tooltip del tour */}
      <Card 
        className="fixed z-50 w-80 max-w-[90vw] shadow-2xl border-2"
        style={{
          left: tooltipStyle.left,
          top: tooltipStyle.top,
          transform: tooltipStyle.transform
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{currentStepData.title}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={completeTour}
              className="h-8 w-8 p-0 hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            Paso {currentStep + 1} de {steps.length}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentStepData.content}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={skipTour}
              className="flex items-center gap-2 text-xs"
            >
              <SkipForward className="h-3 w-3" />
              Saltar tour
            </Button>
            
            <div className="flex items-center gap-2">
              {!isFirstStep && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  className="flex items-center gap-2 text-xs"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Anterior
                </Button>
              )}
              
              <Button
                size="sm"
                onClick={nextStep}
                className="flex items-center gap-2 text-xs px-4"
              >
                {isLastStep ? 'Finalizar' : 'Siguiente'}
                {!isLastStep && <ArrowRight className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TourOverlay;
