
import React from 'react';

interface ActionTypeSelectorProps {
  selectedAction: string;
  selectedSubAction: string;
  onSubActionChange: (value: string) => void;
}

export const ActionTypeSelector: React.FC<ActionTypeSelectorProps> = ({
  selectedAction,
  selectedSubAction,
  onSubActionChange
}) => {
  if (selectedAction === 'telegram') {
    return (
      <div className="p-4 border rounded-lg bg-card shadow-sm space-y-4">
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
              onChange={(e) => onSubActionChange(e.target.value)}
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
              onChange={(e) => onSubActionChange(e.target.value)}
              className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-xs text-foreground">
              Send Message and Wait for Response
            </span>
          </label>
        </div>
      </div>
    );
  }

  if (selectedAction === 'resend') {
    return (
      <div className="p-4 border rounded-lg bg-card shadow-sm space-y-3">
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
              onChange={(e) => onSubActionChange(e.target.value)}
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
              onChange={(e) => onSubActionChange(e.target.value)}
              className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-xs text-foreground">
              Send Email and Wait for Response
            </span>
          </label>
        </div>
      </div>
    );
  }

  return null;
};