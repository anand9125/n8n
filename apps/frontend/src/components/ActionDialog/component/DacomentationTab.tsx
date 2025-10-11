
import React from 'react';
import { ActionConfig } from '../types';

interface DocumentationTabProps {
  config: ActionConfig;
  selectedAction: string;
}

export const DocumentationTab: React.FC<DocumentationTabProps> = ({ config, selectedAction }) => {
  return (
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
    </div>
  );
};