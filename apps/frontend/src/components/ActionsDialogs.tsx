import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Mail, MessageCircle, Database, Globe, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

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

  const config = actionConfigs[selectedAction as keyof typeof actionConfigs];
  const IconComponent = config?.icon || Zap;

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
  }, [selectedAction, config]);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSave = () => {
    const actionData = {
      actionType: selectedAction,
      config: formData,
      timestamp: new Date().toISOString()
    };
    onSave(actionData);
    onClose(); // Close the dialog after saving
  };

  const isFormValid = () => {
    if (!config) return false;
    return config.fields
      .filter(field => field.required)
      .every(field => formData[field.name] && formData[field.name].trim() !== '');
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
          <Textarea
            id={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
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
          <Input
            id={field.name}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={field.type === 'password' ? 'font-mono text-sm' : ''}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-5xl h-[90vh] p-0">
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
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            <DialogHeader className="p-6 border-b border-border">
              <DialogTitle className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-${config.color}-100 flex items-center justify-center`}>
                  <IconComponent className={`w-4 h-4 text-${config.color}-600`} />
                </div>
                {config.title}
                <Badge variant="outline" className="ml-2">Action</Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-6 border-b border-border">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="parameters">Configuration</TabsTrigger>

                  </TabsList>
                </div>

                <TabsContent value="parameters" className="p-6 space-y-6">
                  <div className="grid gap-6">
                    {config.fields.map(field => (
                      <div key={field.name}>
                        <Label htmlFor={field.name} className="text-sm font-medium mb-2 block">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {renderField(field)}
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
                  </div>
                </TabsContent>

                <TabsContent value="docs" className="p-6">
                  <div className="space-y-4">
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
                        {selectedAction === 'resned' && (
                          <>
                            <li>Configure your SMTP server credentials</li>
                            <li>Set the sender and recipient email addresses</li>
                            <li>Write your email subject and content</li>
                            <li>Choose between plain text or HTML format</li>
                          </>
                        )}
                      </ol>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="border-t border-border ">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {isFormValid() ? 'Ready to save' : 'Please fill all required fields'}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={!isFormValid()}>
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
                <Button variant="ghost" size="icon">
                  <div className="w-4 h-4 border border-current" />
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {selectedAction === 'telegram' && formData.message && (
                <div className="bg-card rounded-lg p-3 border">
                  <div className="text-xs text-muted-foreground mb-1">Telegram Message Preview</div>
                  <div className="text-sm">{formData.message}</div>
                </div>
              )}
              {selectedAction === 'resend' && (formData.subject || formData.body) && (
                <div className="bg-card rounded-lg p-3 border">
                  <div className="text-xs text-muted-foreground mb-1">Email Preview</div>
                  {formData.subject && <div className="font-medium text-sm mb-1">{formData.subject}</div>}
                  {formData.body && <div className="text-sm text-muted-foreground">{formData.body}</div>}
                </div>
              )}
              {!formData.message && !formData.subject && (
                <div className="text-center text-muted-foreground text-sm">
                  Fill in the configuration to see a preview
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};