import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database, FileText, Settings } from "lucide-react";

export interface Bot {
  name: string;
  description: string;
}

interface BotCardProps {
  bot: Bot;
  type: "data" | "report";
}

const DATA_APIS = [
  "Sales Analytics API",
  "Customer Data API",
  "Product Metrics API",
  "User Behavior API",
  "Market Research API"
];

const REPORT_APIS = [
  "Document Generation API",
  "PDF Export API",
  "Chart Rendering API",
  "Template Engine API",
  "Data Visualization API"
];

export function BotCard({ bot, type }: BotCardProps) {
  const apis = type === "data" ? DATA_APIS : REPORT_APIS;

  return (
    <Card className="p-4">
      <div className="flex items-start space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          type === "data" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
        }`}>
          {type === "data" ? <Database className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{bot.name}</h4>
          <p className="text-sm text-muted-foreground">{bot.description}</p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit {type === "data" ? "Data" : "Report"} Bot</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="botName">Name</Label>
                <Input id="botName" defaultValue={bot.name} />
              </div>
              <div>
                <Label htmlFor="botDescription">Description</Label>
                <Textarea id="botDescription" defaultValue={bot.description} />
              </div>
              <div>
                <Label>Select API</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an API" />
                  </SelectTrigger>
                  <SelectContent>
                    {apis.map((api) => (
                      <SelectItem key={api} value={api}>
                        {api}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="systemInstructions">System Instructions</Label>
                <Textarea
                  id="systemInstructions"
                  placeholder="Enter system instructions..."
                  className="h-32"
                />
              </div>
              <Button className="w-full">Save Changes</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </Card>
  );
}