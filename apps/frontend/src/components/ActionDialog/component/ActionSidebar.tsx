
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DragableToken } from '../../DragableToken';
import { ActionConfig, FormField } from '../types';

interface ActionSidebarProps {
  config: ActionConfig;
  formData: Record<string, any>;
  selectedSubAction: string;
  waitFields: FormField[];
  fields: any[];
  onClose: () => void;
  isFormValid: boolean;
}

export const ActionSidebar: React.FC<ActionSidebarProps> = ({
  config,
  formData,
  selectedSubAction,
  waitFields,
  fields,
  onClose,
  isFormValid
}) => {
  const IconComponent = config.icon;

  return (
    <div className="w-80 bg-muted/30 p-6 border-r border-border">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm text-muted-foreground">Back to canvas</span>
      </div>

      <div className="bg-card rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-lg bg-${config.color}-100 flex items-center justify-center`}>
            <IconComponent className={`w-5 h-5 text-${config.color}-600`} />
          </div>
          <div>
            <h3 className="font-medium">{config.title}</h3>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>
        </div>
        <Button className="w-full" size="sm" disabled={!isFormValid}>
          Test Action
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          Configure your action settings and test the connection before saving.
          <a href="#" className="text-primary hover:underline ml-1">Learn more</a>
        </p>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground mb-2">REQUIRED FIELDS</div>
        {config.fields
          .filter(field => field.required)
          .map(field => (
            <div key={field.name} className="flex items-center gap-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${formData[field.name] && formData[field.name].trim() ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-muted-foreground">{field.label}</span>
            </div>
          ))
        }
        {selectedSubAction === "sendAndWait" && (
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${waitFields.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-muted-foreground">Wait Fields ({waitFields.length})</span>
          </div>
        )}
      </div>
      
      <div className='text-xs font-medium text-muted-foreground mb-3 pt-4'>
        Draggable Component
      </div>
      <div>
        {fields.map((f, idx) => (
          <DragableToken key={idx} field={f} />
        ))}
      </div>
    </div>
  );
};