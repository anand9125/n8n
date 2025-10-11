
import React from 'react';
import { Label } from '@/components/ui/label';
import { FieldRenderer } from './FiledRender';
import { WaitFieldsSection } from './WaitField';
import { ActionConfig, FormField } from '../types';

interface ConfigurationTabProps {
  config: ActionConfig;
  formData: Record<string, any>;
  selectedSubAction: string;
  waitFields: FormField[];
  onInputChange: (fieldName: string, value: string) => void;
  onAddField: () => void;
  onRemoveField: (idx: number) => void;
  onUpdateField: (idx: number, key: keyof FormField, value: string) => void;
}

export const ConfigurationTab: React.FC<ConfigurationTabProps> = ({
  config,
  formData,
  selectedSubAction,
  waitFields,
  onInputChange,
  onAddField,
  onRemoveField,
  onUpdateField
}) => {
  return (
    <div className="grid gap-6">
      {config.fields.map(field => (
        <div key={field.name}>
          <Label htmlFor={field.name} className="text-sm font-medium mb-2 block">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <FieldRenderer
            field={field}
            value={formData[field.name]}
            onChange={(val) => onInputChange(field.name, val)}
          />
          {field.name === 'botToken' && (
            <p className="text-xs text-muted-foreground mt-1">
              Get your bot token from @BotFather on Telegram
            </p>
          )}
          {field.name === 'webhookUrl' && (
            <p className="text-xs text-muted-foreground mt-1">
              Create an incoming webhook in your Slack workspace
            </p>
          )}
        </div>
      ))}

      {selectedSubAction === "sendAndWait" && (
        <WaitFieldsSection
          waitFields={waitFields}
          onAddField={onAddField}
          onRemoveField={onRemoveField}
          onUpdateField={onUpdateField}
        />
      )}
    </div>
  );
};
