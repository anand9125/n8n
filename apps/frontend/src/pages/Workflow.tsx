import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import {ChevronDown} from "lucide-react";
import { WorkflowBuilder } from '@/components/WorkflowBuilder';


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
    <div className="min-h-screen bg-gray-100 flex justify-center">
  <div className="w-full max-w-7xl ">
    {/* Sidebar */}

    {/* Main content area */}
    <main className="flex-1 flex flex-col">
      <div className="flex-1 relative">
        <WorkflowBuilder />
      </div>
    </main>
  </div>
</div>

  );
}