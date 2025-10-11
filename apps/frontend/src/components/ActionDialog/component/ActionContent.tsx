
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfigurationTab } from './Configuration';
import { DocumentationTab } from './DacomentationTab';
import SendAndWaitInfoDialog from '../../DiscriptionDialog';
import { ActionConfig, FormField } from '../types';

interface ActionContentProps {
  config: ActionConfig;
  selectedAction: string;
  formData: Record<string, any>;
  selectedSubAction: string;
  waitFields: FormField[];
  onInputChange: (fieldName: string, value: string) => void;
  onAddField: () => void;
  onRemoveField: (idx: number) => void;
  onUpdateField: (idx: number, key: keyof FormField, value: string) => void;
}

export const ActionContent: React.FC<ActionContentProps> = ({
  config,
  selectedAction,
  formData,
  selectedSubAction,
  waitFields,
  onInputChange,
  onAddField,
  onRemoveField,
  onUpdateField
}) => {
  const [activeTab, setActiveTab] = useState('parameters');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedSubAction === "sendAndWait") {
      setOpen(true);
    }
  }, [selectedSubAction]);

  return (
    <>
      <div className="flex-1 overflow-y-auto p-6 pb-24" style={{ maxHeight: 'calc(90vh - 140px)' }}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-border mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="parameters">Configuration</TabsTrigger>
              <TabsTrigger value="docs">Documentation</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="parameters" className="space-y-6">
            <ConfigurationTab
              config={config}
              formData={formData}
              selectedSubAction={selectedSubAction}
              waitFields={waitFields}
              onInputChange={onInputChange}
              onAddField={onAddField}
              onRemoveField={onRemoveField}
              onUpdateField={onUpdateField}
            />
          </TabsContent>

          <TabsContent value="docs" className="space-y-4">
            <DocumentationTab config={config} selectedAction={selectedAction} />
          </TabsContent>
        </Tabs>
      </div>
      
      <SendAndWaitInfoDialog open={open} onOpenChange={setOpen} />
    </>
  );
};