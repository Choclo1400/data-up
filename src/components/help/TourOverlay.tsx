
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
      }
    }
  }, [isActive, currentStep, steps]);

  if (!isActive || !steps[currentStep]) return null;

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const getTooltipPosition = () => {
    if (!targetPosition) return { top: '50%', left: '50%' };
    
    const { position } = currentStepData;
    const offset = 20;
    
    switch (position) {
      case 'top':
        return { top: targetPosition.y - offset, left: targetPosition.x };
      case 'bottom':
        return { top: targetPosition.y + offset, left: targetPosition.x };
      case 'left':
        return { top: targetPosition.y, left: targetPosition.x - offset };
      case 'right':
        return { top: targetPosition.y, left: targetPosition.x + offset };
      default:
        return { top: targetPosition.y, left: targetPosition.x };
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
          className="fixed w-20 h-20 border-4 border-primary rounded-lg z-50 pointer-events-none"
          style={{
            left: targetPosition.x - 40,
            top: targetPosition.y - 40,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
          }}
        />
      )}
      
      {/* Tooltip del tour */}
      <Card 
        className="fixed z-50 w-80 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: tooltipStyle.left,
          top: tooltipStyle.top
        }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={completeTour}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            Paso {currentStep + 1} de {steps.length}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-4">
            {currentStepData.content}
          </p>
          
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={skipTour}
              className="flex items-center gap-1"
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
                  className="flex items-center gap-1"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Anterior
                </Button>
              )}
              
              <Button
                size="sm"
                onClick={nextStep}
                className="flex items-center gap-1"
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
