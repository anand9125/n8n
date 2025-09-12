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
import { Button } from '@/components/ui/button';
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
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleAddFirstStep = () => {
    setShowTriggerSidebar(true);
  };

  const handleTriggerSelect = (triggerType: string) => {
    setShowTriggerSidebar(false);
    
    if (triggerType === 'webhook') {
      setShowWebhookDialog(true);
    } else {
      // Add other trigger types here
      console.log('Selected trigger:', triggerType);
    }
  };

  const handleWebhookSave = (webhookData: any) => {
    setShowWebhookDialog(false);
    setWebhookConfigured(true);
    
    // Create webhook node
    const webhookNode: Node = {
      id: 'webhook-1',
      type: 'default',
      position: { x: 400, y: 200 },
      data: { 
        label: (
          <div className="flex items-center gap-2 p-4 relative">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Webhook className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <div className="font-medium text-sm">Webhook</div>
            </div>
            <button
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-90 transition-colors pointer-events-auto"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); handleDeleteNode('webhook-1'); }}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )
      },
      style: {
        background: 'hsl(var(--workflow-node-bg))',
        border: '1px solid hsl(var(--workflow-node-border))',
        borderRadius: '12px',
        fontSize: '14px',
        width: '200px',
      },
    };

    const addButtonNode: Node = {
      id: 'add-next',
      type: 'default',
      position: { x: 400, y: 320 },
      data: {
        label: (
           <div 
             className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-accent transition-colors"
             onMouseDown={(e) => e.stopPropagation()}
             onClick={(e) => { e.stopPropagation(); handleAddNextStep('add-next'); }}
           >
             <Plus className="w-6 h-6 text-muted-foreground" />
           </div>
        )
      },
      style: {
        background: 'transparent',
        border: 'none',
        width: '48px',
        height: '48px',
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

  const handleAddNextStep = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setShowIntegrationSidebar(true);
  };

  const handleIntegrationSelect = (integration: string) => {
    setShowIntegrationSidebar(false);
    
    // Find the current add button node to determine position
    const currentAddNode = nodes.find(node => node.id === selectedNodeId);
    if (!currentAddNode) return;

    // Generate unique ID for the new integration node
    const existingIntegrationNodes = nodes.filter(node => node.id.startsWith(integration));
    const integrationNodeId = `${integration}-${existingIntegrationNodes.length + 1}`;
    
    // Generate unique ID for the new add button
    const existingAddNodes = nodes.filter(node => node.id.startsWith('add-next'));
    const newAddNodeId = `add-next-${existingAddNodes.length + 1}`;
    
    // Create integration node at current add button position
    const integrationNode: Node = {
      id: integrationNodeId,
      type: 'default',
      position: { x: currentAddNode.position.x, y: currentAddNode.position.y },
      data: { 
        label: (
          <div className="flex items-center gap-2 p-4 relative">
             <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
               {integration === 'telegram' ? (
                 <Send className="w-4 h-4 text-blue-600" />
               ) : (
                 <Bot className="w-4 h-4 text-blue-600" />
               )}
             </div>
            <div>
              <div className="font-medium text-sm">{integration === 'telegram' ? 'Telegram' : 'Resend'}</div>
            </div>
            <div
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-90 transition-colors cursor-pointer z-10"
              style={{ pointerEvents: 'all' }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleDeleteNode(integrationNodeId);
              }}
            >
              <X className="w-3 h-3" />
            </div>
          </div>
        )
      },
      style: {
        background: 'hsl(var(--workflow-node-bg))',
        border: '1px solid hsl(var(--workflow-node-border))',
        borderRadius: '12px',
        fontSize: '14px',
        width: '200px',
      },
    };

    // Create new add button node 120px below the integration node
    const newAddButtonNode: Node = {
      id: newAddNodeId,
      type: 'default',
      position: { x: currentAddNode.position.x, y: currentAddNode.position.y + 120 },
      data: {
        label: (
           <div 
             className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-accent transition-colors"
             onMouseDown={(e) => e.stopPropagation()}
             onClick={(e) => { e.stopPropagation(); handleAddNextStep(newAddNodeId); }}
           >
             <Plus className="w-6 h-6 text-muted-foreground" />
           </div>
        )
      },
      style: {
        background: 'transparent',
        border: 'none',
        width: '48px',
        height: '48px',
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

  const handleDeleteNode = (nodeId: string) => {
    // If deleting the trigger, clear the whole workflow
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

    // Find the node to delete
    const nodeToDelete = nodes.find(node => node.id === nodeId);
    if (!nodeToDelete) return;

    // Find edges connected to this node
    const incomingEdge = edges.find(edge => edge.target === nodeId);
    const outgoingEdge = edges.find(edge => edge.source === nodeId);

    // Remove the node
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));

    // Update edges - connect the previous node directly to the next node
    setEdges(prevEdges => {
      let newEdges = prevEdges.filter(edge => edge.source !== nodeId && edge.target !== nodeId);

      // If both incoming and outgoing edges exist, create a direct connection
      if (incomingEdge && outgoingEdge) {
        const directEdge: Edge = {
          id: `${incomingEdge.source}-to-${outgoingEdge.target}-${Date.now()}`,
          source: incomingEdge.source,
          target: outgoingEdge.target,
          style: { stroke: 'hsl(var(--muted-foreground))' },
        };
        newEdges.push(directEdge);
      }

      return newEdges;
    });

    // Reset selection if it was pointing to the deleted node
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  const AddFirstStepCard = () => (
    <Card 
      className="pointer-events-auto absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-32 border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-accent/50 transition-colors cursor-pointer flex items-center justify-center"
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