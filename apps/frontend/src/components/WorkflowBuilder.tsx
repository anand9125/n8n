import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, Webhook, Bot, Clock, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { TriggerSidebar } from './TriggerSidebar';
import { WebhookDialog } from './WebhookDialog';
import { IntegrationSidebar } from './IntegrationSidebar';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

interface WorkflowBuilderProps {
  className?: string;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ className }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showTriggerSidebar, setShowTriggerSidebar] = useState(false);
  const [showWebhookDialog, setShowWebhookDialog] = useState(false);
  const [showIntegrationSidebar, setShowIntegrationSidebar] = useState(false);
  const [webhookConfigured, setWebhookConfigured] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);  //track the currently selected node

  const onConnect = useCallback( //Automatically adds an edge when the user connects two nodes in the UI
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleAddFirstStep = () => {  //Shows the trigger sidebar where the user selects a trigger to start the workflow.
    setShowTriggerSidebar(true);
  };

  const handleTriggerSelect = (triggerType: string) => { //Handles selection of a trigger type
    setShowTriggerSidebar(false);
    
    if (triggerType === 'webhook') {
      setShowWebhookDialog(true);
    } else {
      // Add other trigger types here
      console.log('Selected trigger:', triggerType);
    }
  };

  const handleWebhookSave = (webhookData: any) => {  //Closes the webhook dialog and marks webhook as configured.
    setShowWebhookDialog(false);
    setWebhookConfigured(true);
    
      // Create webhook node
  const webhookNode: Node = {
    id: 'webhook-1',
    type: 'default',
    position: { x: 400, y: 200 },
    data: { 
      label: (
        <div className="relative bg-gray-200 rounded-md w-full h-full flex items-center gap-2 p-1">
          {/* Webhook Icon */}
          <div className="w-5 h-5 rounded  flex items-center justify-center">
            <Webhook className="w-3 h-3 text-orange-400" />
          </div>

          {/* Webhook Text */}
          <div className="font-medium text-xs text-black ">
            Webhook
          </div>

          {/* Delete Button - Positioned Top Right */}
          <button
            className="absolute top-0 right-0 -mt-2 -mr-1 w-2 h-2 rounded-full bg-red-500 text-white flex items-center justify-center hover:opacity-80 transition-opacity"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); handleDeleteNode('webhook-1'); }}
          >
            <X className="w-2 h-2" />
          </button>
        </div>
      )
    },
    style: {
      background: '#e5e7eb',  // Tailwind's bg-gray-200
      border: '1px solid #4a5568',
      borderRadius: '8px',
      fontSize: '12px',
      width: '100px',   // Fixed width
      height: '30px',   // Fixed height
    },
  };

  const addButtonNode: Node = {
    id: 'add-next',
    type: 'default',
    position: { x: 400, y: 320 },
    data: {
      label: (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
          <div
            className="w-4 h-4 rounded-full border-2 border-dashed border-gray-400 bg-gray-200 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-300 transition-colors"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); handleAddNextStep('add-next'); }}
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      )
    },
    style: {
      background: '#e5e7eb',  // Solid background
      border: 'none',
      borderRadius: '8px',
      width: '40px',
      height: '40px',
    },
  };


  setNodes([webhookNode, addButtonNode]);
  
  // Connect webhook to add button
  const newEdge: Edge = {
    id: 'webhook-to-add',
    source: 'webhook-1',
    target: 'add-next',
    style: { stroke: 'hsl(var(--muted-foreground))' },
  };

  setEdges([newEdge]);
  };

  const handleAddNextStep = (nodeId: string) => {   //Opens the Integration Sidebar to configure the next step when clicking the add button.
    setSelectedNodeId(nodeId);
    setShowIntegrationSidebar(true);
  };

  const handleIntegrationSelect = (integration: string) => {  //When an integration (e.g., Telegram, Resend) is selected:
    setShowIntegrationSidebar(false);
    
    // We need the position of the clicked "Add Next Step" node to place the new integration node in the correct location.
    const currentAddNode = nodes.find(node => node.id === selectedNodeId);
    if (!currentAddNode) return;

    // Generate unique ID for the new integration node
    const existingIntegrationNodes = nodes.filter(node => node.id.startsWith(integration));
    const integrationNodeId = `${integration}-${existingIntegrationNodes.length + 1}`;//telegram-1
    
    // Generate unique ID for the new add button
    const existingAddNodes = nodes.filter(node => node.id.startsWith('add-next'));
    const newAddNodeId = `add-next-${existingAddNodes.length + 1}`;
    
    const oldEdge = edges.find(edge => edge.target === selectedNodeId); //get the previous connection
    //selectedNodeId: the ID of the current "Add Next Step" button being clicked.
    //oldEdge.source: the ID of the node that was connected to this "Add Next Step
    // Create integration node at current add button position
    const integrationNode: Node = {
      id: integrationNodeId,
      type: 'default',
      position: { x: currentAddNode.position.x, y: currentAddNode.position.y },
      data: { 
        label: (
          <div className="relative bg-gray-200 rounded-md w-full h-full flex items-center gap-2 p-1">
             <div className="w-5 h-5 rounded  flex items-center justify-center">
               {integration === 'telegram' ? (
                 <Send className="w-3 h-3 text-blue-600" />
               ) : (
                 <Bot className="w-3 h-3 text-blue-600" />
               )}
             </div>
            <div>
              <div className="font-medium text-xs text-black">{integration === 'telegram' ? 'Telegram' : 'Resend'}</div>
            </div>
            <button
            className="absolute top-0 right-0 -mt-2 -mr-1 w-2 h-2 rounded-full bg-red-500 text-white flex items-center justify-center hover:opacity-80 transition-opacity"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); handleDeleteNode(integrationNodeId); }}
           >
            <X className="w-2 h-2" />
        </button>
          </div>
        ),
        prevNodeId: oldEdge?.source || null,
        nextNodeId: newAddNodeId,
      },
      style: {
          background: '#e5e7eb',  // Tailwind's bg-gray-200
          border: '1px solid #4a5568',
          borderRadius: '8px',
          fontSize: '12px',
          width: '100px',   // Fixed width
          height: '30px',   // Fixed height
        },
    };

    // Create new add button node 120px below the integration node
    const newAddButtonNode: Node = {
      id: newAddNodeId,
      type: 'default',
      position: { x: currentAddNode.position.x, y: currentAddNode.position.y + 120 },
      data: {
        label: (
           <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
             <div 
           className="w-4 h-4 rounded-full border-2 border-dashed border-gray-400 bg-gray-200 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-300 transition-colors"
           onMouseDown={(e) => e.stopPropagation()}
           onClick={(e) => { e.stopPropagation(); handleAddNextStep(newAddNodeId); }}
        >
          <Plus className="w-4 h-4 text-gray-600" />
            </div>
        </div>
        ),
        prevNodeId: integrationNodeId,
        nextNodeId: null,
      },
      style: {
        background: '#e5e7eb',  // Solid background
        border: 'none',
        borderRadius: '8px',
        width: '40px',
        height: '40px',
      },
    };

    // Update nodes - replace the old add button with integration node and new add button
    setNodes(prevNodes => {
      const filteredNodes = prevNodes.filter(node => node.id !== selectedNodeId);
      return [...filteredNodes, integrationNode, newAddButtonNode];
    });

    // Update edges
    setEdges(prevEdges => {
      // Find the edge that was pointing to the old add button
      const oldEdge = prevEdges.find(edge => edge.target === selectedNodeId);
      
      // Create new edges
      const newEdges: Edge[] = [];
      
      // If there was an edge pointing to the old add button, redirect it to the new integration node
      if (oldEdge) {
        const connectionEdge: Edge = {
          id: `${oldEdge.source}-to-${integrationNodeId}`,
          source: oldEdge.source,
          target: integrationNodeId,
          style: { stroke: 'hsl(var(--muted-foreground))' },
        };
        newEdges.push(connectionEdge);
      }
      
      // Add edge from integration to new add button
      const integrationToAddEdge: Edge = {
        id: `${integrationNodeId}-to-${newAddNodeId}`,
        source: integrationNodeId,
        target: newAddNodeId,
        style: { stroke: 'hsl(var(--muted-foreground))' },
      };
      newEdges.push(integrationToAddEdge);
      
      // Remove old edges pointing to the replaced add button and add new edges
      const filteredEdges = prevEdges.filter(edge => edge.target !== selectedNodeId);
      return [...filteredEdges, ...newEdges];
    });
  };

// When the user clicks the delete (X) button on a node, the goal is to:
// Remove the node from the workflow.
// Remove any edges connected to the node.
// Reconnect the previous node to the next node (if applicable).
// Ensure the workflow stays consistent (no dangling nodes).


const handleDeleteNode = (nodeId: string) => {  
  if (nodeId === 'webhook-1') {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setWebhookConfigured(false);
    setShowIntegrationSidebar(false);
    setShowTriggerSidebar(false);
    setShowWebhookDialog(false);
    return;
  }
   
  //) Find the node to delete and create updated node list
  setNodes(prevNodes => {  //prevNodes: the current list of nodes (array of node)
    const nodeToDelete = prevNodes.find(node => node.id === nodeId);
    if (!nodeToDelete) return prevNodes;

    const updatedNodes = prevNodes.filter(node => node.id !== nodeId);

    // Remove edges in a separate state update
    setEdges(prevEdges => {
      const incomingEdges = prevEdges.filter(edge => edge.target === nodeId);
      const outgoingEdges = prevEdges.filter(edge => edge.source === nodeId);

      let newEdges = prevEdges.filter(edge => edge.source !== nodeId && edge.target !== nodeId);
       
      if (incomingEdges.length > 0) {
        if (outgoingEdges.length > 0) {
          // Connect incoming sources to outgoing targets
          incomingEdges.forEach(inEdge => {
            outgoingEdges.forEach(outEdge => {
              const directEdge: Edge = {
                id: `${inEdge.source}-to-${outEdge.target}-${Date.now()}`,
                source: inEdge.source,
                target: outEdge.target,
                style: { stroke: 'hsl(var(--muted-foreground))' },
              };
              newEdges.push(directEdge);
            });
          });
        } else {
          // No outgoing, connect incoming to next add-next node
          const addNextNode = updatedNodes.find(node => node.id.startsWith('add-next'));
          if (addNextNode) {
            incomingEdges.forEach(inEdge => {
              const directEdge: Edge = {
                id: `${inEdge.source}-to-${addNextNode.id}-${Date.now()}`,
                source: inEdge.source,
                target: addNextNode.id,
                style: { stroke: 'hsl(var(--muted-foreground))' },
              };
              newEdges.push(directEdge);
            });
          }
        }
      }

      return newEdges;
    });

    return updatedNodes;
  });

  if (selectedNodeId === nodeId) {
    setSelectedNodeId(null);
  }
};



  const AddFirstStepCard = () => (
    <Card 
      className="pointer-events-auto absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-28 border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-accent/50 transition-colors cursor-pointer flex items-center justify-center"
      onClick={handleAddFirstStep}
    >
      <div className="text-center">
        <Plus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <div className="text-sm font-medium text-muted-foreground">Add first step...</div>
      </div>
    </Card>
  );

  return (
    <div className={cn("w-full h-screen bg-background", className)}>
      <div className="flex h-full">
        {/* Main workflow canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            className="bg-workflow-bg"
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
          >
            <Controls position="bottom-left" />
            <MiniMap position="bottom-right" />
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          </ReactFlow>

          {nodes.length === 0 && <AddFirstStepCard />}
        </div>

        {/* Right sidebars */}
        <TriggerSidebar
          isOpen={showTriggerSidebar}
          onClose={() => setShowTriggerSidebar(false)}
          onTriggerSelect={handleTriggerSelect}
        />
        
        <IntegrationSidebar
          isOpen={showIntegrationSidebar}
          onClose={() => setShowIntegrationSidebar(false)}
          onIntegrationSelect={handleIntegrationSelect}
        />
      </div>

      {/* Dialogs */}
      <WebhookDialog
        isOpen={showWebhookDialog}
        onClose={() => setShowWebhookDialog(false)}
        onSave={handleWebhookSave}
      />
    </div>
  );
};