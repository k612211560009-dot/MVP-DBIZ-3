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
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                index < currentStep
                  ? 'bg-[#16A34A] text-white'
                  : index === currentStep
                  ? 'bg-[#2E5BFF] text-white'
                  : 'bg-[#E2E8F0] text-[#94A3B8]'
              }`}
            >
              {index < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <span>{step.id}</span>
              )}
            </div>
            <span
              className={`text-xs whitespace-nowrap ${
                index <= currentStep ? 'text-[#1E293B]' : 'text-[#94A3B8]'
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 flex-1 mx-2 ${
                index < currentStep ? 'bg-[#16A34A]' : 'bg-[#E2E8F0]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
