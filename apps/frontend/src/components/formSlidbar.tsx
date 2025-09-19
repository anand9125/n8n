import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Trash2, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { userFormStore } from '@/store/formData';

interface FormField {
  label: string;
  type: string;
  key?: string;
}

interface FormBuilderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formNode: any) => void;
}

export const FormBuilderDialog: React.FC<FormBuilderDialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formName, setFormName] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const setformData = userFormStore.getState().setFields;

  const addField = () =>
    setFields((prev) => [...prev, { label: "", type: "text" }]);

  const removeField = (idx: number) =>
    setFields((prev) => prev.filter((_, i) => i !== idx));

  const updateField = (idx: number, key: keyof FormField, value: string) => {
    setFields((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [key]: value };

      if (key === "label" && value.trim()) {
        updated[idx].key = value
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, "");
      }
      return updated;
    });
  };

  const handleSave = () => {
    if (!formName.trim()) {
      alert("Form name is required");
      return;
    }

    if (fields.length === 0) {
      alert("At least one field is required");
      return;
    }

    const invalid = fields.some((f) => !f.label.trim() || !f.type);
    if (invalid) {
      alert("All fields must have a label and type");
      return;
    }

    const processedFields = fields.map((f, i) => ({
      label: f.label.trim(),
      type: f.type,
      key:
        f.key ||
        f.label
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, "") ||
        `field_${i}`,
    }));

    const formNode = {
      id: `form-${Date.now()}`,
      name: formName.trim(),
      type: "form-builder",
      icon: "FileText",
      color: "from-blue-500 to-indigo-600",
      data: {
        form_name: formName.trim(),
        fields: processedFields,
      },
    };

    onSave(formNode);
    if(formNode.data.fields){
       const extracted = formNode.data.fields.map(field => {
        return {
          label: field.label,
          type: field.type,
          key: field.key
        }
      })
      setformData(extracted);
    }
    
    console.log(formNode,"this is form node and this will help you a lopt");
    // Reset form and close dialog
    setFormName("");
    setFields([]);
    onClose();
  };

  const isFormValid = () => {
    return formName.trim() && 
           fields.length > 0 && 
           fields.every(f => f.label.trim() && f.type);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <div className="flex h-full">
          {/* Left sidebar */}
          <div className="w-80 bg-muted/30 p-6 border-r border-border">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">Back to canvas</span>
            </div>

            <div className="bg-card rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Form Builder</h3>
                  <p className="text-xs text-muted-foreground">Create custom forms</p>
                </div>
              </div>
              <Button className="w-full" size="sm" disabled={!isFormValid()}>
                Test Form
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Configure your form settings and test before saving.
                <a href="#" className="text-primary hover:underline ml-1">Learn more</a>
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground mb-2">REQUIRED FIELDS</div>
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${formName.trim() ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-muted-foreground">Form Name</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${fields.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-muted-foreground">Form Fields ({fields.length})</span>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col relative ">
            <DialogHeader className="p-6 border-b border-border ">
              <DialogTitle className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                Form Builder
                <Badge variant="outline" className="ml-2">Node</Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto  p-6 pb-24" style={{ maxHeight: 'calc(90vh - 140px)' }}>
              <div className="space-y-6">
                {/* Form Name */}
                <div>
                  <Label htmlFor="formName" className="text-sm font-medium mb-2 block">
                    Form Name
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="formName"
                    placeholder="Enter form name (e.g., Contact Form)"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>

                {/* Form Fields */}
                <div className=''>
                  <div className="flex justify-between items-center mb-4 ">
                    <Label className="text-sm font-medium">
                      Form Fields ({fields.length})
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Button variant="outline" size="sm" onClick={addField}>
                      <Plus className="h-4 w-4 mr-2" /> Add Field
                    </Button>
                  </div>

                  {fields.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-gray-200 rounded-lg">
                      No fields added yet. Click "Add Field" to get started.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {fields.map((field, idx) => (
                        <div
                          key={idx}
                          className="p-4 border rounded-lg bg-card space-y-3"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">
                              Field {idx + 1}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeField(idx)}
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
                              placeholder="Field Label (e.g., Email Address)"
                              value={field.label}
                              onChange={(e) => updateField(idx, "label", e.target.value)}
                              className="text-sm"
                            />
                          </div>

                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">
                              Field Type
                            </Label>
                            <select
                              value={field.type}
                              onChange={(e) => updateField(idx, "type", e.target.value)}
                              className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                              <option value="">Select field type</option>
                              <option value="text">Text</option>
                              <option value="email">Email</option>
                              <option value="number">Number</option>
                              <option value="tel">Phone</option>
                              <option value="password">Password</option>
                              <option value="textarea">Textarea</option>
                              <option value="select">Select Dropdown</option>
                              <option value="checkbox">Checkbox</option>
                              <option value="radio">Radio Button</option>
                              <option value="date">Date</option>
                              <option value="time">Time</option>
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
              </div>
            </div>
            <div className="border-t border-border bg-background px-6 py-4 absolute bottom-0 ">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {isFormValid() ? " Ready to save" : " Please fill all required fields"}
                </span>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="rounded-lg px-5"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!isFormValid()}
                    className="rounded-lg px-5 bg-blue-600 hover:bg-blue-700 text-white shadow"
                  >
                    Save Form ({fields.length} fields)
                  </Button>
                </div>
              </div>
           </div>

          </div>

          {/* Right sidebar - Preview */}
          <div className="w-80 bg-muted/30 border-l border-border">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">PREVIEW</h3>
                <Button variant="ghost" size="icon">
                  <div className="w-4 h-4 border border-current" />
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {formName && (
                <div className="bg-card rounded-lg p-3 border">
                  <div className="text-xs text-muted-foreground mb-1">Form Name</div>
                  <div className="font-medium text-sm">{formName}</div>
                </div>
              )}
              
              {fields.length > 0 && (
                <div className="bg-card rounded-lg p-3 border">
                  <div className="text-xs text-muted-foreground mb-2">Form Fields</div>
                  <div className="space-y-2">
                    {fields.map((field, idx) => (
                      field.label && (
                        <div key={idx} className="text-sm flex justify-between">
                          <span>{field.label}</span>
                          <span className="text-muted-foreground text-xs">{field.type}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
              
              {!formName && fields.length === 0 && (
                <div className="text-center text-muted-foreground text-sm">
                  Fill in the form details to see a preview
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Example usage component
const App = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (formNode: any) => {
    console.log('Form saved:', formNode);
    // Handle the saved form data here
  };

  return (
    <div className="p-8">
      <Button onClick={() => setIsDialogOpen(true)}>
        Open Form Builder
      </Button>
      
      <FormBuilderDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

