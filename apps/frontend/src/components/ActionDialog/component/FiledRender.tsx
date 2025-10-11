
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DroppableInput } from '../../DroppableInput';
import { ActionField } from '../types';

interface FieldRendererProps {
  field: ActionField;
  value: string;
  onChange: (value: string) => void;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, onChange }) => {
  switch (field.type) {
    case 'textarea':
      return (
        <DroppableInput
          id={field.name}
          type={field.type}
          value={value || ''}
          onChange={onChange}
          placeholder={field.placeholder}
          className="min-h-[100px]"
        />
      );
    case 'select':
      return (
        <Select value={value || field.defaultValue} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option: string) => (
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
          value={value || ""}
          onChange={onChange}
          placeholder={field.placeholder}
          className={field.type === "password" ? "font-mono text-sm" : ""}
        />
      );
  }
};

