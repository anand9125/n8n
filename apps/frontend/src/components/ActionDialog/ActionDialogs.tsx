
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { userFormStore, userResponseStore } from '@/store/formData';
import { actionConfigs } from './constant';
import { ActionDialogsProps, ActionData } from './types';
import { useActionForm } from './hooks/useActionForm';
import { isFormValid } from './utils/validation';
import { ActionSidebar } from "./component/ActionSidebar";
import { ActionHeader } from './component/ActionHeader';
import { ActionContent } from './component/ActionContent';
import { ActionFooter } from './component/ActionFooter';
import { ActionPreview } from './component/ActionPreview';

export const ActionDialogs: React.FC<ActionDialogsProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedAction,
}) => {
  const fields = userFormStore.getState().fields;
  const config = actionConfigs[selectedAction as keyof typeof actionConfigs];
  const userResponseFieldStore = userResponseStore.getState().setFields;
  const userResponseFields = userResponseStore.getState().fields;

  const {
    formData,
    selectedSubAction,
    setSelectedSubAction,
    waitFields,
    handleInputChange,
    addField,
    removeField,
    updateField
  } = useActionForm(selectedAction, config);

  const formValid = isFormValid(config, formData, selectedSubAction, waitFields);

  const handleSave = () => {
    const actionData: ActionData = {
      actionType: selectedAction,
      config: formData,
      timestamp: new Date().toISOString(),
      selectedAction: selectedSubAction,
      waitFields: selectedSubAction === "sendAndWait" ? waitFields : undefined
    };
    onSave(actionData);
    userResponseFieldStore(waitFields);
    onClose();
  };

  if (!config) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <DialogContent className="max-w-md">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-2">Action not found</h2>
            <p className="text-muted-foreground mb-4">
              The selected action "{selectedAction}" is not supported.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <div className="flex h-full">
          <ActionSidebar
            config={config}
            formData={formData}
            selectedSubAction={selectedSubAction}
            waitFields={waitFields}
            fields={fields}
            onClose={onClose}
            isFormValid={formValid}
          />

          <div className="flex-1 flex flex-col relative">
            <ActionHeader config={config} />
            
            <ActionContent
              config={config}
              selectedAction={selectedAction}
              formData={formData}
              selectedSubAction={selectedSubAction}
              waitFields={waitFields}
              onInputChange={handleInputChange}
              onAddField={addField}
              onRemoveField={removeField}
              onUpdateField={updateField}
            />

            <ActionFooter
              isFormValid={formValid}
              onClose={onClose}
              onSave={handleSave}
            />
          </div>

          <ActionPreview
            selectedAction={selectedAction}
            selectedSubAction={selectedSubAction}
            formData={formData}
            waitFields={waitFields}
            userResponseFields={userResponseFields}
            onSubActionChange={setSelectedSubAction}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
