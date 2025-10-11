export interface FormField {
  label: string;
  type: string;
  key?: string;
}

export interface ActionField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  options?: string[];
}

export interface ActionConfig {
  icon: any;
  color: string;
  title: string;
  description: string;
  fields: ActionField[];
}

export interface ActionDialogsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (actionData: any) => void;
  selectedAction: string;
}

export interface ActionData {
  actionType: string;
  config: Record<string, any>;
  timestamp: string;
  selectedAction: string;
  waitFields?: FormField[];
}