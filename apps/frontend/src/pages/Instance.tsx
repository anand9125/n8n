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
  Plus
} from "lucide-react";

import WorkflowItem from "@/components/WorkflowItem";
import ExecutionItem from "@/components/ExecutionItem";
import CredentialItem from "@/components/CredentialItem";

const Instance = () => {
  const [activeTab, setActiveTab] = useState("Workflows");
  const [workflowActive, setWorkflowActive] = useState(false);



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
 console.log(activeTab)

  const tabs = ["Workflows", "Credentials", "Executions"];

  return (
   <div className="min-h-screen bg-background flex flex-col">
  {/* Optional Sidebar Here */}
  
  <div className="flex-1 flex justify-center">
    <div className="w-full max-w-7xl px-4">
   <div className="bg-gray-200">Hiiiiiii</div>
      


      {/* Main Content */}
      <main className=" overflow-hidden">
        <div className="p-6 ">
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
            {activeTab=="Workflows" && <WorkflowItem/>}
            {activeTab=="Credentials" && <CredentialItem />}
            {activeTab=="Excutions" && <ExecutionItem />}

            
          </div>
        </div>
      </main>
      </div>
      </div>
    </div>
  );
};

export default Instance;