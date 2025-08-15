
'use client';

import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface AppTourProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const tourSteps = [
  {
    targetId: 'search-bar',
    content: 'Start by searching for a guest by name. The list will update as you type.',
    side: 'bottom' as const,
    align: 'start' as const,
  },
  {
    targetId: 'hotel-filter',
    content: 'You can filter the guest list to a specific hotel property.',
     side: 'bottom' as const,
     align: 'start' as const,
  },
  {
    targetId: 'status-filter',
    content: 'Or, filter by guest status to see who is checked-in, arriving soon, or checked-out.',
     side: 'bottom' as const,
     align: 'start' as const,
  },
  {
    targetId: 'guest-list',
    content: 'Select a guest from this list to see their detailed profile.',
    side: 'right' as const,
    align: 'start' as const,
  },
  {
    targetId: 'guest-details-panel',
    content: 'This is the "Single View of the Guest", giving you all key information at a glance.',
    side: 'left' as const,
    align: 'start' as const,
  },
];

export function AppTour({ isOpen, onOpenChange }: AppTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);
  
  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onOpenChange(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    onOpenChange(false);
  };

  const activeStep = tourSteps[currentStep];
  const targetElement = activeStep ? document.getElementById(activeStep.targetId) : null;

  if (!isOpen || !targetElement) {
    return null;
  }

  return (
    <Popover open={true} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div style={{
            position: 'absolute',
            top: `${targetElement.getBoundingClientRect().top}px`,
            left: `${targetElement.getBoundingClientRect().left}px`,
            width: `${targetElement.getBoundingClientRect().width}px`,
            height: `${targetElement.getBoundingClientRect().height}px`,
            pointerEvents: 'none',
        }} />
      </PopoverTrigger>
      <PopoverContent
        side={activeStep.side}
        align={activeStep.align}
        sideOffset={10}
        className="w-80"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="space-y-4">
          <p className="text-sm">{activeStep.content}</p>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Step {currentStep + 1} of {tourSteps.length}
            </p>
            <div className="flex gap-2">
              {currentStep > 0 && <Button variant="ghost" size="sm" onClick={handlePrev}>Previous</Button>}
              <Button size="sm" onClick={handleNext}>
                {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
