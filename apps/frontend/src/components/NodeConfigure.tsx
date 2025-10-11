import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { ConditionalMessageEditor } from "./ConditionalMessageEditor";
import { Card } from "./ui/card";

export type Field = {
  label: string;
  type: string;
  key?: string;
};

interface NodeConfigurationProps {
  userResponseFields: Field[];
  onSaveConfiguration: (config: any) => void;
  onClose?: () => void; // optional close handler
}

export const NodeConfiguration = ({
  userResponseFields,
  onSaveConfiguration,
  onClose,
}: NodeConfigurationProps) => {
  const [message, setMessage] = useState("");
  const [conditionalMessages, setConditionalMessages] = useState({
    default: "",
    approved: "",
    disapproved: "",
  });

  const availableFields = userResponseFields.map((field) => ({
    fieldId: field.key ?? field.label,
    fieldLabel: field.label,
    fieldType: field.type,
  }));

  const hasApprovalFields = availableFields.some(
    (field) => field.fieldType === "approval"
  );

  const handleSave = () => {
    onSaveConfiguration({
      message,
      selectedFields: availableFields,
      conditionalMessages,
    });
  };

 return (
  <div className="fixed top-0 right-0 h-full w-[400px] border-l border-border bg-card shadow-xl flex flex-col z-50">
    {/* Header */}
    <div className="p-6 border-b border-border flex items-center justify-between">
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground">Configure action settings</p>
      </div>
      {onClose && (
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      )}
    </div>

    {/* Body */}
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {availableFields.length > 0 && (
        <Card className="p-4 bg-workflow-node border-workflow-border">
          <h3 className="font-medium text-sm text-foreground mb-3">
            Available Fields
          </h3>
          <div className="space-y-2">
            {availableFields.map((field) => (
              <div
                key={field.fieldId}
                className="flex items-center gap-2 p-2 rounded bg-background"
              >
                <span className="text-xs font-medium px-2 py-1 rounded bg-variable-bg text-variable-text border border-variable-border">
                  {field.fieldLabel}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded font-medium ${
                    field.fieldType === "approval"
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {field.fieldType}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <ConditionalMessageEditor
        message={message}
        onMessageChange={setMessage}
        onConditionalMessagesChange={setConditionalMessages}
        hasApprovalFields={hasApprovalFields}
      />

    </div>

    {/* Footer */}
    <div className="p-6 border-t border-border flex gap-3">
      {onClose && (
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
      )}
      <Button className="flex-1" onClick={handleSave}>
        Save Configuration
      </Button>
    </div>
  </div>
);

};
