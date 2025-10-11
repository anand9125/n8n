import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Mail, MessageCircle, Database, Globe, Zap, Plus, Trash2, ChartNoAxesColumnDecreasing } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { userFormStore, userResponseStore } from '@/store/formData';
import { DragableToken } from './DragableToken';
import { DroppableInput } from './DroppableInput';
import SendAndWaitInfoDialog from './DiscriptionDialog';
import { NodeConfiguration } from './NodeConfigure';

interface FormField {
  label: string;
  type: string;
  key?: string;
}

interface ActionDialogsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (actionData: any) => void;
  selectedAction: string;
}

const actionConfigs = {
  telegram: {
    icon: Send,
    color: 'blue',
    title: 'Telegram Bot',
    description: 'Send messages via Telegram Bot',
    fields: [
      { name: 'botToken', label: 'Bot Token', type: 'password', placeholder: 'Enter your bot token', required: true },
      { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Enter your message...', required: true },
      { name: 'parseMode', label: 'Parse Mode', type: 'select', options: ['HTML', 'Markdown', 'None'], defaultValue: 'None' }
    ]
  },
  resend: {
    icon: Mail,
    color: 'green',
    title: 'Email',
    description: 'Send email notifications',
    fields: [
      { name: 'resendApi', label: 'Resend_API', type: 'text', placeholder: 're_xxxxxxxxx', required: true },
      { name: 'fromEmail', label: 'From Email', type: 'email', placeholder: 'Sender Email' ,required:true},
      { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Email subject', required: true },
      { name: 'body', label: 'Body', type: 'textarea', placeholder: 'Email content...', required: true },
    ]
  }
};

export const ActionDialogs: React.FC<ActionDialogsProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedAction,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState('parameters');
  const fields = userFormStore.getState().fields;
  const config = actionConfigs[selectedAction as keyof typeof actionConfigs];
  const IconComponent = config?.icon || Zap;
  const [selectedSubAction, setSelectedSubAction] = useState("");
  const [waitFields, setWaitFields] = useState<FormField[]>([]);
  const [open, setOpen] = useState(false)
  const [showConfig, setShowConfig] = useState(false);
  const[saveConfiguration,setSaveConfiguration] = useState("");
  const userResponseFieldStore = userResponseStore.getState().setFields;
  const userResonseField = userResponseStore.getState().fields;
  console.log(userResonseField,"this is user response field")
  useEffect(() => {
    // Initialize form data with default values
    if (config) {
      const initialData: Record<string, any> = {};
      config.fields.forEach(field => {
        if (field.defaultValue) {
          initialData[field.name] = field.defaultValue;
        } else {
          initialData[field.name] = '';
        }
      });
      setFormData(initialData);
    }
    if(selectedAction === "telegram" || selectedAction === "resend"){
      setSelectedSubAction("send");
    }
  }, [selectedAction, config]);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };
  useEffect(() => {
    if (selectedSubAction === "sendAndWait") {
      setOpen(true);
    }
  }, [selectedSubAction]);

  // Field management functions (extracted from FormBuilderDialog)
  const addField = () =>
    setWaitFields((prev) => [...prev, { label: "", type: "text" }]);

  const removeField = (idx: number) =>
    setWaitFields((prev) => prev.filter((_, i) => i !== idx));

  const updateField = (idx: number, key: keyof FormField, value: string) => {
    setWaitFields((prev) => {
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
    const actionData = {
      actionType: selectedAction,
      config: formData,
      timestamp: new Date().toISOString(),
      selectedAction: selectedSubAction,
      waitFields: selectedSubAction === "sendAndWait" ? waitFields : undefined,
      configurationMessage: saveConfiguration
    };
    onSave(actionData);
    userResponseFieldStore(waitFields)
    

    onClose(); // Close the dialog after saving
  };

  const isFormValid = () => {
    if (!config) return false;
    const basicFieldsValid = config.fields
      .filter(field => field.required)
      .every(field => formData[field.name] && formData[field.name].trim() !== '');
    
    if (selectedSubAction === "sendAndWait") {
      const waitFieldsValid = waitFields.length > 0 && 
        waitFields.every(f => f.label.trim() && f.type);
      return basicFieldsValid && waitFieldsValid;
    }
    
    return basicFieldsValid;
  };

  if (!config) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Action not found</DialogTitle>
          </DialogHeader>
          <p>The selected action "{selectedAction}" is not supported.</p>
          <Button onClick={onClose}>Close</Button>
        </DialogContent>
      </Dialog>
    );
  }

  const renderField = (field: any) => {
    switch (field.type) {
      case 'textarea':
        return (
          <DroppableInput
            id={field.name}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(val) => handleInputChange(field.name,val)}
            placeholder={field.placeholder}
            className="min-h-[100px]"
          />
        );
      case 'select':
        return (
          <Select 
            value={formData[field.name] || field.defaultValue} 
            onValueChange={(value) => handleInputChange(field.name, value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <DroppableInput
            id={field.name}
            type={field.type}
            value={formData[field.name] || ""}
            onChange={(val) => handleInputChange(field.name, val)}
            placeholder={field.placeholder}
            className={field.type === "password" ? "font-mono text-sm" : ""}
          />
        );
    }
  };
  

  const handleAvailbeResponse = (userResonseField:any)=>{
   
  }

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
                <div className={`w-10 h-10 rounded-lg bg-${config.color}-100 flex items-center justify-center`}>
                  <IconComponent className={`w-5 h-5 text-${config.color}-600`} />
                </div>
                <div>
                  <h3 className="font-medium">{config.title}</h3>
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </div>
              </div>
              <Button className="w-full" size="sm" disabled={!isFormValid()}>
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
              {fields.map((f,idx)=>(
                <DragableToken key={idx} field={f}></DragableToken>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col relative">
            <DialogHeader className="p-6 border-b border-border">
              <DialogTitle className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-${config.color}-100 flex items-center justify-center`}>
                  <IconComponent className={`w-4 h-4 text-${config.color}-600`} />
                </div>
                {config.title}
                <Badge variant="outline" className="ml-2">Action</Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-6 pb-24" style={{ maxHeight: 'calc(90vh - 140px)' }}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b border-border mb-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="parameters">Configuration</TabsTrigger>
                    <TabsTrigger value="docs">Documentation</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="parameters" className="space-y-6">
                  <div className="grid gap-6">
                    {config.fields.map(field => (
                      <div key={field.name}>
                        <Label htmlFor={field.name} className="text-sm font-medium mb-2 block">
                          {field.label}
                          
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {renderField(field)}
                        {field.name === 'botToken' && (
                          <p className="text-xs text-muted-foreground  mt-1">
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

                    {/* Wait Fields Section - Only show when sendAndWait is selected */}
                    {selectedSubAction === "sendAndWait" && (
                      <div className=''>
                        <div className="flex justify-between items-center mb-4 ">
                          <Label className="text-sm font-medium">
                            Response Fields ({waitFields.length})
                            <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Button variant="outline" size="sm" onClick={addField}>
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
                                    placeholder="Field Label (e.g., User Response)"
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
                                 
                                    <option value="approval/disapproval">Approval (Approve/Disapprove)</option>
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
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="docs" className="space-y-4">
                  <h3 className="font-medium">{config.title} Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    {config.description}
                  </p>
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium mb-2">Setup Instructions:</h4>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      {selectedAction === 'telegram' && (
                        <>
                          <li>Create a bot using @BotFather on Telegram</li>
                          <li>Copy the bot token provided</li>
                          <li>Get the chat ID where you want to send messages</li>
                          <li>Configure the message content and formatting</li>
                        </>
                      )}
                      {selectedAction === 'resend' && (
                        <>
                          <li>Configure your SMTP server credentials</li>
                          <li>Set the sender and recipient email addresses</li>
                          <li>Write your email subject and content</li>
                          <li>Choose between plain text or HTML format</li>
                        </>
                      )}
                    </ol>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="border-t border-border bg-background px-6 py-4 absolute bottom-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {isFormValid() ? "Ready to save" : "Please fill all required fields"}
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
                    Save Action
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
              </div>
            </div>
            <div className="p-4 space-y-4">
              {/* {selectedAction === 'telegram' && formData.message && (
                <div className="bg-card rounded-lg p-3 border">
                  <div className="text-xs text-muted-foreground mb-1">Telegram Message Preview</div>
                  <div className="text-sm">{formData.message}</div>
                </div>
              )}
              {selectedAction === 'resend' && (formData.subject || formData.body) && (
                <div className="bg-card rounded-lg p-3 border ">
                  <div className="text-xs text-muted-foreground mb-1">Email Preview</div>
                  {formData.subject && <div className="font-medium text-sm mb-1">{formData.subject}</div>}
                  {formData.body && <div className="text-sm text-muted-foreground">{formData.body}</div>}
                </div>
              )} */}

              {/* Wait Fields Preview */}
              {/* {selectedSubAction === "sendAndWait" && waitFields.length > 0 && (
                <div className="bg-card rounded-lg p-3 border">
                  <div className="text-xs text-muted-foreground mb-2">Response Fields</div>
                  <div className="space-y-2">
                    {waitFields.map((field, idx) => (
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
               */}
              
              {!formData.message && !formData.subject && waitFields.length === 0 && (
                <div className="text-center text-muted-foreground text-sm">
                  Fill in the configuration to see a preview
                </div>
              )}
            </div>
            <div className='pl-4'>
               {selectedAction === 'telegram' && (
              <div className="p-4  border rounded-lg bg-card shadow-sm space-y-4">
                <h2 className="text-sm font-semibold text-foreground border-b pb-2">
                  Telegram Actions
                </h2>

                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="telegramAction"
                          value="send"
                          checked={selectedSubAction === "send"}
                          onChange={(e)=>setSelectedSubAction(e.target.value)}
                          className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          
                        />
                        <span className="text-xs text-foreground">Send Message</span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="telegramAction"
                          value="sendAndWait"
                           checked={selectedSubAction === "sendAndWait"}
                          onChange={(e)=>setSelectedSubAction(e.target.value)}
                          className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-xs text-foreground">
                          Send Message and Wait for Response
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              {selectedAction === 'resend' && (
              <div className="p-4 border  rounded-lg bg-card shadow-sm space-y-3 ">
                <h2 className="text-sm font-semibold text-foreground border-b pb-2">
                  Email Actions
                </h2>

                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="emailAction"
                          value="send"
                           checked={selectedSubAction === "send"}
                          onChange={(e)=>setSelectedSubAction(e.target.value)}
                          className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-xs text-foreground">Send Email</span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="emailAction"
                          value="sendAndWait"
                           checked={selectedSubAction === "sendAndWait"}
                          onChange={(e)=>setSelectedSubAction(e.target.value)}
                          className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-xs text-foreground">
                          Send Email and Wait for Response
                        </span>
                      </label>
                    </div>
                  </div>
                )}
                {
                userResonseField.length > 0 && (
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
                        userResponseFields={userResonseField}
                        onSaveConfiguration={(config: any) => {
                          console.log(config.conditionalMessages);
                           setSaveConfiguration(config.conditionalMessages)
                          setShowConfig(false); // hide after saving
                        }}
                      />
                    )}
                  </div>
                )
              }
              </div>
               <SendAndWaitInfoDialog open={open} onOpenChange={setOpen} />
          </div>
        </div>
        

      </DialogContent>
    </Dialog>
  );
};