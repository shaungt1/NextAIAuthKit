"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/registry/new-york/ui/card";
import { Button } from "@/registry/new-york/ui/button";
import ReactMarkdown from "react-markdown";

// Define the StepperProps interface
interface StepperProps {
  steps: {
    step: number;
    title: string;
    description: string;
    icon: any;
    markdown: string;
  }[];
}

export function Stepper({ steps }: StepperProps) {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <Card className="w-full max-w-3xl mt-12">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold text-primary mb-4">🚀 Quick Setup Guide</h2>

        {/* Stepper Progress Bar */}
        <div className="relative flex items-center justify-between w-full">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative w-full">
              {/* Step Button */}
              <button
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "w-16 h-16  flex items-center justify-center rounded-full border-2 font-semibold transition-colors relative z-10",
                  index === currentStep
                    ? "bg-primary text-primary-foreground border-primary"
                    : index < currentStep
                    ? "bg-primary/80 text-primary-foreground border-primary cursor-pointer hover:bg-primary"
                    : "bg-muted text-muted-foreground border-muted cursor-not-allowed"
                )}
              >
                {index < currentStep ? (
                  <step.icon className="w-8 h-8 text-white" />
                ) : (
                  <step.icon className="w-8 h-8 text-muted-foreground" />
                )}
              </button>

              {/* Step Title */}
              <span className="mt-2 text-sm font-medium text-muted-foreground">{step.title}</span>

              {/* Step Connector Line */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: index < currentStep ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                  className="absolute  top-6 left-16 h-[3px] mt-2 bg-primary w-[calc(100%-3rem)]"
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Description */}
        <motion.div
          className="mt-6 text-muted-foreground text-lg text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={steps[currentStep].step}
        >
          {steps[currentStep].description}
        </motion.div>

        {/* Markdown Viewer for Step Instructions */}
        <motion.div
          className="mt-4 p-4 border border-muted rounded-lg bg-background text-sm text-left"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={steps[currentStep].title}
        >
          <ReactMarkdown>{steps[currentStep].markdown}</ReactMarkdown>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
