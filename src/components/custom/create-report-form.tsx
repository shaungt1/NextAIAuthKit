import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Stepper } from "./stepper";
import { Bot, BotCard } from "./bot-card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const STEPS = [
  "Basic Information",
  "Configure Bots",
  "Review & Create"
];

export function CreateReportForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dataBots: [{ name: "Default Data Bot", description: "Data gathering bot" }],
    reportBots: [{ name: "Default Report Bot", description: "Report generation bot" }],
  });

  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Report Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter report title"
                className="mb-4"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter report description"
                className="min-h-[100px]"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Data Bots</h3>
              <div className="space-y-4">
                {formData.dataBots.map((bot, index) => (
                  <BotCard key={index} bot={bot} type="data" />
                ))}
              </div>
              {formData.dataBots.length < 3 && (
                <Button
                  variant="outline"
                  onClick={() => setFormData({
                    ...formData,
                    dataBots: [...formData.dataBots, { name: `Data Bot ${formData.dataBots.length + 1}`, description: "" }]
                  })}
                  className="mt-4"
                >
                  Add Data Bot
                </Button>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Report Bots</h3>
              <div className="space-y-4">
                {formData.reportBots.map((bot, index) => (
                  <BotCard key={index} bot={bot} type="report" />
                ))}
              </div>
              {formData.reportBots.length < 3 && (
                <Button
                  variant="outline"
                  onClick={() => setFormData({
                    ...formData,
                    reportBots: [...formData.reportBots, { name: `Report Bot ${formData.reportBots.length + 1}`, description: "" }]
                  })}
                  className="mt-4"
                >
                  Add Report Bot
                </Button>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please review your report configuration before creating. This will set up your report with the specified bots and configurations.
              </AlertDescription>
            </Alert>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Report Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <p className="text-muted-foreground">{formData.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-muted-foreground">{formData.description}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Configured Bots</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Data Bots: {formData.dataBots.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Report Bots: {formData.reportBots.length}
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
        <div className="mt-8">
          {renderStepContent()}
        </div>
        <div className="mt-6 flex justify-end">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="mr-2"
            >
              Previous
            </Button>
          )}
          <Button onClick={handleNext}>
            {currentStep === STEPS.length - 1 ? "Create Report" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
}