import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="sticky top-16 z-40 w-full border-b border-border bg-card py-6">
      <div className="container max-w-4xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                    currentStep > step.id
                      ? 'bg-success border-success text-white'
                      : currentStep === step.id
                      ? 'bg-primary border-primary text-white'
                      : 'bg-card border-border text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-[12px] font-medium">{step.id}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-[12px] text-center ${
                    currentStep >= step.id ? 'text-foreground font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 mb-6 transition-colors ${
                    currentStep > step.id ? 'bg-success' : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
