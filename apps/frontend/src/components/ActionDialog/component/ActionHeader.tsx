
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ActionConfig } from '../types';

interface ActionHeaderProps {
  config: ActionConfig;
}

export const ActionHeader: React.FC<ActionHeaderProps> = ({ config }) => {
  const IconComponent = config.icon;

  return (
    <DialogHeader className="p-6 border-b border-border">
      <DialogTitle className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg bg-${config.color}-100 flex items-center justify-center`}>
          <IconComponent className={`w-4 h-4 text-${config.color}-600`} />
        </div>
        {config.title}
        <Badge variant="outline" className="ml-2">Action</Badge>
      </DialogTitle>
    </DialogHeader>
  );
};
