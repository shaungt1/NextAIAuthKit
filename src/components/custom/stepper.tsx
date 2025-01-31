import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="w-full py-4">
      <div className="relative flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative">
            <button
              onClick={() => onStepClick(index)}
              disabled={index > currentStep}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors relative z-10",
                index === currentStep
                  ? "bg-primary text-primary-foreground"
                  : index < currentStep
                  ? "bg-primary/80 text-primary-foreground cursor-pointer hover:bg-primary"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {index + 1}
            </button>
            <span className="mt-2 text-sm text-muted-foreground">
              {step}
            </span>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute top-5 left-10 h-[2px] w-[calc(100%-2.5rem)]",
                  index < currentStep
                    ? "bg-primary"
                    : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}