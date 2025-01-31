import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { useState, useEffect } from "react";
import { ReportViewer } from "@/components/custom/report-viewer";
import { CreateReportForm } from "@/components/custom/create-report-form";
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  Settings,
  ChevronRight,
  PlayCircle,
  Code2,
  MessageSquare,
  Moon,
  Sun,
  PlusCircle
} from "lucide-react";

// Mock data for reports
const mockReports = [
  {
    id: 1,
    name: "Report #1",
    description: "Quarterly Performance Analysis",
    lastUpdated: "2h ago",
    createdBy: "John Doe",
    apis: ["Sales API", "Customer Data API"],
    prompts: ["Data Analysis", "Report Generation"]
  },
  {
    id: 2,
    name: "Report #2",
    description: "Monthly Sales Overview",
    lastUpdated: "1d ago",
    createdBy: "Jane Smith",
    apis: ["Analytics API"],
    prompts: ["Sales Analysis"]
  },
  {
    id: 3,
    name: "Report #3",
    description: "Customer Satisfaction Survey",
    lastUpdated: "3d ago",
    createdBy: "Mike Johnson",
    apis: ["Customer Data API"],
    prompts: ["Survey Analysis", "Summary"]
  },
  {
    id: 4,
    name: "Report #4",
    description: "Team Performance Review",
    lastUpdated: "1w ago",
    createdBy: "Sarah Williams",
    apis: ["HR API", "Analytics API"],
    prompts: ["Performance Analysis"]
  },
  {
    id: 5,
    name: "Report #5",
    description: "Market Research Summary",
    lastUpdated: "2w ago",
    createdBy: "Alex Brown",
    apis: ["Market Data API"],
    prompts: ["Market Analysis", "Trends"]
  }
];

type View = 'reports' | 'settings' | 'history' | 'new-report';

interface ReportState {
  isGenerating: boolean;
  progress: number;
  content: string | null;
}

function App() {
  const { theme, setTheme } = useTheme();
  const [currentView, setCurrentView] = useState<View>('reports');
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);
  const [reportStates, setReportStates] = useState<Record<number, ReportState>>({});
  const [hasGeneratedReport, setHasGeneratedReport] = useState(false);

  const handleGenerateReport = () => {
    setHasGeneratedReport(true);
    generateReport(selectedReport.id);
  };

  const generateReport = async (reportId: number) => {
    setReportStates(prev => ({
      ...prev,
      [reportId]: {
        isGenerating: true,
        progress: 0,
        content: null
      }
    }));

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setReportStates(prev => ({
        ...prev,
        [reportId]: {
          ...prev[reportId],
          progress: i
        }
      }));
    }

    try {
      const response = await fetch(`/src/reports/mock_report_${reportId}.md`);
      const content = await response.text();
      
      setReportStates(prev => ({
        ...prev,
        [reportId]: {
          isGenerating: false,
          progress: 100,
          content
        }
      }));
    } catch (error) {
      console.error('Error loading report:', error);
      setReportStates(prev => ({
        ...prev,
        [reportId]: {
          isGenerating: false,
          progress: 100,
          content: "# Generated Report\n\nThis is a placeholder report content."
        }
      }));
    }
  };

  const getReportState = (reportId: number): ReportState => {
    return reportStates[reportId] || {
      isGenerating: false,
      progress: 0,
      content: null
    };
  };

  const renderRunTab = () => {
    if (!selectedReport) return null;

    const reportState = getReportState(selectedReport.id);

    return (
      <TabsContent value="run" className="space-y-4">
        {!hasGeneratedReport && (
          <Card className="p-6">
            <div className="text-center py-8">
              <PlayCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">Ready to Run Report</h2>
              <p className="text-muted-foreground mb-6">
                All systems are ready. Click the button below to generate your report.
              </p>
              <Button
                size="lg"
                onClick={handleGenerateReport}
                disabled={reportState.isGenerating}
              >
                Generate Report
              </Button>
            </div>
          </Card>
        )}

        {hasGeneratedReport && (
          <div className="flex justify-end mb-4">
            <Button
              className="rounded"
              size="lg"
              onClick={() => generateReport(selectedReport.id)}
              disabled={reportState.isGenerating}
            >
              Generate Report
            </Button>
          </div>
        )}

        <ReportViewer
          reportId={selectedReport.id}
          onGenerateReport={handleGenerateReport}
          isGenerating={reportState.isGenerating}
          progress={reportState.progress}
          reportContent={reportState.content}
        />
      </TabsContent>
    );
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'settings':
        return (
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">User Settings</h1>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Settings Placeholder</h2>
              <p className="text-muted-foreground">User settings and preferences will be configured here.</p>
            </Card>
          </div>
        );

      case 'history':
        return (
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Report History</h1>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="border rounded">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Report Name</th>
                        <th className="text-left p-4">Generated On</th>
                        <th className="text-left p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3].map((i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="p-4">Sample Report #{i}</td>
                          <td className="p-4">{i} day{i > 1 ? 's' : ''} ago</td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'new-report':
        return (
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Create New Report</h1>
            <CreateReportForm />
          </div>
        );

      default:
        return (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">
                {selectedReport ? selectedReport.name : 'Report Overview'}
              </h1>
              <Button className="rounded" onClick={() => setCurrentView('new-report')}>
                <PlusCircle className="mr-2  h-4 w-4" />
                Create New Report
              </Button>
            </div>
            
            {selectedReport ? (
              <Tabs defaultValue="info" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 h-12">
                  <TabsTrigger value="info">Information</TabsTrigger>
                  <TabsTrigger value="apis">APIs</TabsTrigger>
                  <TabsTrigger value="prompts">Prompts</TabsTrigger>
                  <TabsTrigger value="run">Run Report</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Report Details</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Report Name</label>
                        <p className="text-muted-foreground">{selectedReport.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <p className="text-muted-foreground">{selectedReport.description}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Created By</label>
                        <p className="text-muted-foreground">{selectedReport.createdBy}</p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="apis" className="space-y-4">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold">Connected APIs</h2>
                      <Button className="rounded">
                        <Code2 className="mr-2 h-4 w-4" />
                        Add API
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {selectedReport.apis.map((api) => (
                        <Card key={api} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{api}</h3>
                              <p className="text-sm text-muted-foreground">Connected and active</p>
                            </div>
                            <Button className="rounded" variant="ghost" size="sm">Configure</Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="prompts" className="space-y-4">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold">System Prompts</h2>
                      <Button className="rounded">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Add Prompt
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {selectedReport.prompts.map((prompt) => (
                        <Card key={prompt} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{prompt}</h3>
                              <p className="text-sm text-muted-foreground">Last edited 2 days ago</p>
                            </div>
                            <Button className="rounded" variant="ghost" size="sm">Edit</Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                {renderRunTab()}
              </Tabs>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">Select a report from the sidebar or create a new one.</p>
              </Card>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              {theme === 'dark' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-4">Reports Dashboard</h2>
          <nav className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full rounded justify-start"
              onClick={() => {
                setCurrentView('reports');
                setSelectedReport(null);
              }}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="w-full rounded justify-start"
              onClick={() => setCurrentView('new-report')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Reports
            </Button>
            <Button 
              variant="ghost" 
              className="w-full rounded justify-start"
              onClick={() => setCurrentView('history')}
            >
              <History className="mr-2 h-4 w-4" />
              History
            </Button>
            <Button 
              variant="ghost"
              className="w-full rounded justify-start"
              onClick={() => setCurrentView('settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </div>

        <div className="px-6 py-4 border-t">
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">Recent Reports</h3>
          <ScrollArea className="h-[400px] pr-4">
            {mockReports.map((report) => (
              <Card
                key={report.id}
                className={`p-4 mb-2 rounded cursor-pointer group ${
                  selectedReport?.id === report.id
                    ? theme === "light"
                      ? "bg-blue-700 text-white"
                      : "bg-accent"
                    : "hover:bg-accent"
                }`}
                onClick={() => {
                  setSelectedReport(report);
                  setCurrentView("reports");
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4
                      className={`font-medium ${
                        selectedReport?.id === report.id && theme === "light"
                          ? "text-white"
                          : ""
                      }`}
                    >
                      {report.name}
                    </h4>
                    <p
                      className={`text-sm ${
                        selectedReport?.id === report.id && theme === "light"
                          ? "text-gray-300"
                          : "text-muted-foreground"
                      }`}
                    >
                      Last updated {report.lastUpdated}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Card>
            ))}
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderMainContent()}
      </div>
    </div>
  );
}

export default App;