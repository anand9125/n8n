import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Code2, Plus } from "lucide-react";

interface AvailableField {
  nodeId: string;
  nodeLabel: string;
  fieldId: string;
  fieldLabel: string;
  fieldType: "text" | "approval";
}

interface VariableSelectorProps {
  fields: AvailableField[];
  onInsert: (variable: string) => void;
}

export const VariableSelector = ({ fields, onInsert }: VariableSelectorProps) => {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Code2 className="w-4 h-4" />
        Insert Variables
      </div>
      <div className="flex flex-wrap gap-2">
        {fields.map((field) => {
          const variableName = `${field.nodeLabel.toLowerCase().replace(/\s+/g, "_")}.${field.fieldLabel.toLowerCase().replace(/\s+/g, "_")}`;
          
          return (
            <Button
              key={`${field.nodeId}-${field.fieldId}`}
              variant="outline"
              size="sm"
              onClick={() => onInsert(variableName)}
              className="gap-2 font-mono text-xs hover:bg-variable-bg hover:text-variable-text hover:border-variable-border"
            >
              <Plus className="w-3 h-3" />
              {`{{${variableName}}}`}
            </Button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Click to insert dynamic values from previous nodes into your message
      </p>
    </Card>
  );
};
