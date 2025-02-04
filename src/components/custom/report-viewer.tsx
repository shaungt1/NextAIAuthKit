import { Card } from "@/registry/ui/card";
import { Progress } from "@/registry/ui/progress";
import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";

interface ReportViewerProps {
  reportId: number;
  onGenerateReport: () => void;
  isGenerating: boolean;
  progress: number;
  reportContent: string | null;
}

export function ReportViewer({
  reportId,
  onGenerateReport,
  isGenerating,
  progress,
  reportContent
}: ReportViewerProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        {isGenerating && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-center text-muted-foreground">
              Generating report... {progress}%
            </p>
          </div>
        )}
        
        {reportContent && (
          <div className="prose dark:prose-invert max-w-none">
            <Markdown>{reportContent}</Markdown>
          </div>
        )}
      </div>
    </Card>
  );
}