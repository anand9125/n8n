import React from 'react';
import { X, Play, Calendar, Webhook, FileText, Zap, Search, Bot, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface TriggerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSelect: (triggerType: string) => void;
}

export const TriggerSidebar: React.FC<TriggerSidebarProps> = ({
  isOpen,
  onClose,
  onTriggerSelect,
}) => {
  if (!isOpen) return null;

  const triggers = [
    {
      id: 'manual',
      icon: Play,
      title: 'Trigger manually',
      description: 'Runs the flow on clicking a button in n8n. Good for getting started quickly',
    },
    {
      id: 'app-event',
      icon: Zap,
      title: 'On app event',
      description: 'Runs the flow when something happens in an app like Telegram, Notion or Airtable',
    },
    {
      id: 'schedule',
      icon: Clock,
      title: 'On a schedule',
      description: 'Runs the flow every day, hour, or custom interval',
    },
    {
      id: 'webhook',
      icon: Webhook,
      title: 'On webhook call',
      description: 'Runs the flow on receiving an HTTP request',
    },
    {
      id: 'form',
      icon: FileText,
      title: 'On form submission',
      description: 'Generate webforms in n8n and pass their responses to the workflow',
    },
    {
      id: 'workflow',
      icon: Send,
      title: 'When executed by another workflow',
      description: 'Runs the flow when called by the Execute Workflow node from a different workflow',
    },
  ];

  return (
    <div className="w-96 h-full bg-background border-l border-border overflow-y-auto">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">What triggers this workflow?</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          A trigger is a step that starts your workflow
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="p-4 space-y-3">
        {triggers.map((trigger) => {
          const IconComponent = trigger.icon;
          return (
            <Card
              key={trigger.id}
              className="p-4 cursor-pointer hover:bg-accent transition-colors border border-border"
              onClick={() => onTriggerSelect(trigger.id)}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <IconComponent className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm mb-1">{trigger.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {trigger.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};