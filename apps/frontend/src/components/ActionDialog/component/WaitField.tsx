
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField } from '../types';

interface WaitFieldsSectionProps {
  waitFields: FormField[];
  onAddField: () => void;
  onRemoveField: (idx: number) => void;
  onUpdateField: (idx: number, key: keyof FormField, value: string) => void;
}

export const WaitFieldsSection: React.FC<WaitFieldsSectionProps> = ({
  waitFields,
  onAddField,
  onRemoveField,
  onUpdateField
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Label className="text-sm font-medium">
          Response Fields ({waitFields.length})
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Button variant="outline" size="sm" onClick={onAddField}>
          <Plus className="h-4 w-4 mr-2" /> Add Field
        </Button>
      </div>

      {waitFields.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-gray-200 rounded-lg">
          No response fields added yet. Click "Add Field" to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {waitFields.map((field, idx) => (
            <div key={idx} className="p-4 border rounded-lg bg-card space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Field {idx + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveField(idx)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Field Label
                </Label>
                <Input
                  placeholder="Field Label (e.g., User Response)"
                  value={field.label}
                  onChange={(e) => onUpdateField(idx, "label", e.target.value)}
                  className="text-sm"
                />
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Field Type
                </Label>
                <select
                  value={field.type}
                  onChange={(e) => onUpdateField(idx, "type", e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select field type</option>
                  <option value="text">Text</option>
                  <option value="approval">Approval (Approve/Disapprove)</option>
                </select>
              </div>

              {field.label && (
                <div className="text-xs text-muted-foreground">
                  Key:{" "}
                  {field.key ||
                    field.label
                      .toLowerCase()
                      .replace(/\s+/g, "_")
                      .replace(/[^a-z0-9_]/g, "")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};