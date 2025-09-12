import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  ChevronDown, 
  Filter,
  User,
  Workflow,
  Key,
  Calendar,
  Database,
  BarChart3,
  Settings,
  HelpCircle,
  Sparkles,
  FolderOpen,
  Plus
} from "lucide-react";

const Instance = () => {
  const [activeTab, setActiveTab] = useState("Workflows");
  const [workflowActive, setWorkflowActive] = useState(false);

  const sidebarItems = [
    { icon: BarChart3, label: "Overview", active: true },
    { icon: User, label: "Personal" },
    { icon: FolderOpen, label: "Projects" },
    { icon: Settings, label: "Admin Panel" },
    { icon: Workflow, label: "Templates" },
    { icon: Database, label: "Variables" },
    { icon: BarChart3, label: "Insights" },
    { icon: HelpCircle, label: "Help" },
    { icon: Sparkles, label: "What's New" }
  ];

  const stats = [
    { label: "Prod. executions", value: "0", subtitle: "Last 7 days" },
    { label: "Failed prod. executions", value: "0", subtitle: "Last 7 days" },
    { label: "Failure rate", value: "0%", subtitle: "Last 7 days" },
    { label: "Time saved", value: "--", subtitle: "Last 7 days" },
    { label: "Run time (avg.)", value: "0s", subtitle: "Last 7 days" }
  ];
  const navigate = useNavigate();
  const handleCreateWorkflow = () => {
    navigate("/workflow");
  };

  const tabs = ["Workflows", "Credentials", "Executions"];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">n8n</span>
            </div>
            <span className="font-semibold text-foreground">n8n</span>
          </div>
          
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    item.active 
                      ? "bg-accent text-accent-foreground font-medium" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-muted rounded-lg p-3 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-3 h-3" />
              <span>14 days left in your n8n trial</span>
            </div>
            <Button size="sm" className="w-full bg-success hover:bg-success/90 text-success-foreground">
              Upgrade now
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Overview</h1>
              <p className="text-muted-foreground">All the workflows, credentials and executions you have access to</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleCreateWorkflow}>
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-6">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  Sort by last updated
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Workflow Item */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <Workflow className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">My workflow</h3>
                    <p className="text-sm text-muted-foreground">
                      Last updated 3 hours ago | Created 10 September
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">Personal</Badge>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {workflowActive ? "Active" : "Inactive"}
                    </span>
                    <Switch
                      checked={workflowActive}
                      onCheckedChange={setWorkflowActive}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Total 1
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">50/page</span>
                <Button variant="outline" size="sm">
                  1
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Instance;