import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { json } from 'stream/consumers';
import { Button } from "@/components/ui/button";
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
import { WorkflowBuilder } from '@/components/WorkflowBuilder';

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
const initialNodes = [
  {
    id: 'n1',
    position: { x: 0, y: 0 },
    data: { label: 'Node 1' },
    type: 'input',
  },
  {
    id: 'n2',
    position: { x: 100, y: 100 },
    data: { label: 'Node 2' },
  },
  {
    id: 'n3',
    position: { x: 150, y: 150 },
    data: { label: 'Node 3' },
  },
  {
    id: 'n4',
    position: { x: 200, y: 200 },
    data: { label: 'Node 4' },
  },
  {
    id: 'n5',
    position: { x: 250, y: 250 },
    data: { label: 'Node 5' },
  },
];
 
const initialEdges = [
  {
    id: 'n1-n2',
    source: 'n1',
    target: 'n2',
  },
];
export default function App() {
    const[nodes, setNodes] = useState(initialNodes);
    const[edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback(
      (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
      [],
    );
    const onEdgesChange = useCallback(
      (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
      [],
    );
    const onConnect = useCallback(
      (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
      [],
    );
    
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
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-4">
        <div style={{ height: '100vh', width: '100%' }}>
          <WorkflowBuilder></WorkflowBuilder>
        </div>
      </main>
      
    </div>
  );
}