import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { VariableSelector } from "./VariableSelector";
import { CheckCircle2, XCircle, FileText } from "lucide-react";
import { Field } from "../store/formData";

interface ConditionalMessageEditorProps {
  message: string;
  onMessageChange: (message: string) => void;
  onConditionalMessagesChange?: (messages: {
    default: string;
    approved: string;
    disapproved: string;
  }) => void;
  hasApprovalFields: boolean;
}

export const ConditionalMessageEditor = ({
  message,
  onMessageChange,
  onConditionalMessagesChange,
  hasApprovalFields,
}: ConditionalMessageEditorProps) => {
  const [approvedMessage, setApprovedMessage] = useState("");
  const [disapprovedMessage, setDisapprovedMessage] = useState("");
  const [activeTab, setActiveTab] = useState("default");

  // Send all messages back whenever any of them change
  useEffect(() => {
    if (onConditionalMessagesChange) {
      onConditionalMessagesChange({
        default: message,
        approved: approvedMessage,
        disapproved: disapprovedMessage,
      });
    }
  }, [message, approvedMessage, disapprovedMessage, onConditionalMessagesChange]);

  const insertVariable = (variable: string, tabType: string) => {
    const placeholder = `{{${variable}}}`;

    if (tabType === "approved") {
      setApprovedMessage((prev) => prev + placeholder);
    } else if (tabType === "disapproved") {
      setDisapprovedMessage((prev) => prev + placeholder);
    } else {
      onMessageChange(message + placeholder);
    }
  };

  if (!hasApprovalFields) {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="message" className="text-base font-semibold">
            Message
          </Label>
          <p className="text-sm text-muted-foreground mb-3">
            Use variables by clicking on them below
          </p>
        </div>

        <Textarea
          id="message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Enter your message... Use {{variable}} syntax for dynamic content"
          className="min-h-[150px] font-mono text-sm"
        />

        {/* {availableFields.length > 0 && (
          <VariableSelector
            fields={availableFields}
            onInsert={(variable) => insertVariable(variable, "default")}
          />
        )} */}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">Conditional Message</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Configure different messages based on approval response
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="default" className="gap-2">
            <FileText className="w-4 h-4" />
            Default
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Approved
          </TabsTrigger>
          <TabsTrigger value="disapproved" className="gap-2">
            <XCircle className="w-4 h-4" />
            Disapproved
          </TabsTrigger>
        </TabsList>

        {/* Default */}
        <TabsContent value="default" className="space-y-4">
          <Card className="p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              This message will be sent when no approval response is detected
            </p>
          </Card>
          <Textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Default message when no approval response..."
            className="min-h-[120px] font-mono text-sm"
          />
          {/* {availableFields.length > 0 && (
            <VariableSelector
              fields={availableFields}
              onInsert={(variable) => insertVariable(variable, "default")}
            />
          )} */}
        </TabsContent>

        {/* Approved */}
        <TabsContent value="approved" className="space-y-4">
          <Card className="p-4 bg-success/5 border-success/20">
            <p className="text-sm text-success flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              This message will be sent when user approves
            </p>
          </Card>
          <Textarea
            value={approvedMessage}
            onChange={(e) => setApprovedMessage(e.target.value)}
            placeholder="Message to send when approved... e.g., 'Great! Your request has been approved.'"
            className="min-h-[120px] font-mono text-sm"
          />
          {/* {availableFields.length > 0 && (
            <VariableSelector
              fields={availableFields}
              onInsert={(variable) => insertVariable(variable, "approved")}
            />
          )} */}
        </TabsContent>

        {/* Disapproved */}
        <TabsContent value="disapproved" className="space-y-4">
          <Card className="p-4 bg-destructive/5 border-destructive/20">
            <p className="text-sm text-destructive flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              This message will be sent when user disapproves
            </p>
          </Card>
          <Textarea
            value={disapprovedMessage}
            onChange={(e) => setDisapprovedMessage(e.target.value)}
            placeholder="Message to send when disapproved... e.g., 'We understand. Your request has been declined.'"
            className="min-h-[120px] font-mono text-sm"
          />
          {/* {availableFields.length > 0 && (
            <VariableSelector
              fields={availableFields}
              onInsert={(variable) => insertVariable(variable, "disapproved")}
            />
          )} */}
        </TabsContent>
      </Tabs>
    </div>
  );
};
