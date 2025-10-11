
import React, { useState } from 'react';
import { ActionTypeSelector } from './ActionTypeSelection';
import { NodeConfiguration } from '../../NodeConfigure';
import { FormField } from '../types';

interface ActionPreviewProps {
  selectedAction: string;
  selectedSubAction: string;
  formData: Record<string, any>;
  waitFields: FormField[];
  userResponseFields: any[];
  onSubActionChange: (value: string) => void;
}

export const ActionPreview: React.FC<ActionPreviewProps> = ({
  selectedAction,
  selectedSubAction,
  formData,
  waitFields,
  userResponseFields,
  onSubActionChange
}) => {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="w-80 bg-muted/30 border-l border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">PREVIEW</h3>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {!formData.message && !formData.subject && waitFields.length === 0 && (
          <div className="text-center text-muted-foreground text-sm">
            Fill in the configuration to see a preview
          </div>
        )}
      </div>

      <div className='pl-4'>
        <ActionTypeSelector
          selectedAction={selectedAction}
          selectedSubAction={selectedSubAction}
          onSubActionChange={onSubActionChange}
        />

        {userResponseFields.length > 0 && (
          <div className="pt-6">
            <div className="p-4 rounded-lg border border-border bg-muted/30 flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                You have responses from the previous node — you can use them in this configuration.
              </p>

              <button
                onClick={() => setShowConfig(true)}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition text-sm font-medium w-fit"
              >
                Configure Settings
              </button>
            </div>

            {showConfig && (
              <NodeConfiguration
                userResponseFields={userResponseFields}
                onSaveConfiguration={(config: any) => {
                  console.log(config);
                  setShowConfig(false);
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};