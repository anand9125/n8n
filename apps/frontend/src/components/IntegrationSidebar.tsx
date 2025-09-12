import React from 'react';
import { X, Search, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface IntegrationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onIntegrationSelect: (integration: string) => void;
}

export const IntegrationSidebar: React.FC<IntegrationSidebarProps> = ({
  isOpen,
  onClose,
  onIntegrationSelect,
}) => {
  if (!isOpen) return null;

  const integrations = [
    {
      id: 'telegram',
      icon: MessageCircle,
      title: 'Telegram',
      description: 'Send messages, manage groups, and interact with Telegram Bot API',
    },
    {
      id: 'resend',
      icon: Send,
      title: 'Resend',
      description: 'Send transactional emails with high deliverability rates',
    },
  ];

  return (
    <div className="w-96 h-full bg-background border-l border-border overflow-y-auto">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">What happens next?</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="p-4 space-y-3">
        {integrations.map((integration) => {
          const IconComponent = integration.icon;
          return (
            <Card
              key={integration.id}
              className="p-4 cursor-pointer hover:bg-accent transition-colors border border-border"
              onClick={() => onIntegrationSelect(integration.id)}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <IconComponent className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm mb-1">{integration.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {integration.description}
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