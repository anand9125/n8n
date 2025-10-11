import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionFooterProps {
  isFormValid: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const ActionFooter: React.FC<ActionFooterProps> = ({ isFormValid, onClose, onSave }) => {
  return (
    <div className="border-t border-border bg-background px-6 py-4 absolute bottom-0">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {isFormValid ? "Ready to save" : "Please fill all required fields"}
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
            onClick={onSave}
            disabled={!isFormValid}
            className="rounded-lg px-5 bg-blue-600 hover:bg-blue-700 text-white shadow"
          >
            Save Action
          </Button>
        </div>
      </div>
    </div>
  );
};
