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
 
return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">n8n</span>
            </div>
            <span className="font-semibold text-gray-800">n8n</span>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    item.active 
                      ? "bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
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
      <main className="flex-1 flex flex-col">
        {/* Top bar (optional - matches n8n style) */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-800">My workflow</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Personal</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Share
              </Button>
              <Button size="sm" className="bg-red-500 hover:bg-red-600">
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Workflow canvas */}
        <div className="flex-1 relative">
          <WorkflowBuilder />
        </div>
      </main>
    </div>
  );
}