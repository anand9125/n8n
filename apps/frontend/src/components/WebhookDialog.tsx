import React, { useState } from 'react';
import { ArrowLeft, Copy, Webhook } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface WebhookDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (webhookData: any) => void;
}

export const WebhookDialog: React.FC<WebhookDialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [httpMethod, setHttpMethod] = useState('GET');
  const [path, setPath] = useState('978d3195-edce-499b-8d50-daaf31a9625c');
  const [authentication, setAuthentication] = useState('None');
  const [respond, setRespond] = useState('Immediately');

  const testUrl = 'https://ananpad.app.n8n.cloud/webhook-test/';
  const productionUrl = 'https://ananpad.app.n8n.cloud/webhook/';

  const handleSave = () => {
    const webhookData = {
      httpMethod,
      path,
      authentication,
      respond,
      testUrl: testUrl + path,
      productionUrl: productionUrl + path,
    };
    onSave(webhookData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-4xl h-[90vh] p-0">
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
              <h3 className="font-medium mb-2">Pull in events from Webhook</h3>
              <Button className="w-full" size="sm">
                Listen for test event
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Once you've finished building your workflow, run it without having to click this button by using the production webhook URL. 
                <a href="#" className="text-primary hover:underline ml-1">More info</a>
              </p>
            </div>

            <div className="text-xs text-muted-foreground">
              When will this node trigger my flow?
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            <DialogHeader className="p-6 border-b border-border">
              <DialogTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Webhook className="w-4 h-4 text-orange-600" />
                </div>
                Webhook
                <Button size="sm" className="ml-auto">
                  Listen for test event
                </Button>
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto">
              <Tabs defaultValue="parameters" className="w-full">
                <div className="px-6 border-b border-border">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="parameters">Parameters</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="docs">Docs</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="parameters" className="p-6 space-y-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block text-orange-600">
                      Webhook URLs
                    </Label>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">Test URL</Badge>
                          <Badge variant="outline" className="text-xs">Production URL</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-md p-2 text-sm font-mono text-muted-foreground break-all">
                            {testUrl}{path}
                          </div>
                          <Button variant="outline" size="sm">
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="http-method" className="text-sm font-medium mb-2 block">
                      HTTP Method
                    </Label>
                    <Select value={httpMethod} onValueChange={setHttpMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="path" className="text-sm font-medium mb-2 block">
                      Path
                    </Label>
                    <Input
                      id="path"
                      value={path}
                      onChange={(e) => setPath(e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="authentication" className="text-sm font-medium mb-2 block">
                      Authentication
                    </Label>
                    <Select value={authentication} onValueChange={setAuthentication}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Basic">Basic Auth</SelectItem>
                        <SelectItem value="Bearer">Bearer Token</SelectItem>
                        <SelectItem value="API Key">API Key</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="respond" className="text-sm font-medium mb-2 block">
                      Respond
                    </Label>
                    <Select value={respond} onValueChange={setRespond}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Immediately">Immediately</SelectItem>
                        <SelectItem value="When Workflow Finishes">When Workflow Finishes</SelectItem>
                        <SelectItem value="Using Respond to Webhook Node">Using Respond to Webhook Node</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-sm text-orange-800">
                      If you are sending back a response, add a "Content-Type" response header with the appropriate value to avoid unexpected behavior
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Options</Label>
                    <div className="text-sm text-muted-foreground">No properties</div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Add option
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="p-6">
                  <div className="text-center text-muted-foreground">
                    Settings content would go here
                  </div>
                </TabsContent>

                <TabsContent value="docs" className="p-6">
                  <div className="text-center text-muted-foreground">
                    Documentation content would go here
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="border-t border-border p-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  I wish this node would...
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar - Output */}
          <div className="w-80 bg-muted/30 border-l border-border">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">OUTPUT</h3>
                <Button variant="ghost" size="icon">
                  <div className="w-4 h-4 border border-current" />
                </Button>
              </div>
            </div>
            <div className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Execute this node to view data
              </p>
              <p className="text-xs text-muted-foreground">
                or <a href="#" className="text-primary hover:underline">set mock data</a>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};