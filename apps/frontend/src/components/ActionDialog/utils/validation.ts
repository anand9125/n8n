
import { ActionConfig, FormField } from '../types';

export const isFormValid = (
  config: ActionConfig | null,
  formData: Record<string, any>,
  selectedSubAction: string,
  waitFields: FormField[]
): boolean => {
  if (!config) return false;
  
  const basicFieldsValid = config.fields
    .filter(field => field.required)
    .every(field => formData[field.name] && formData[field.name].trim() !== '');
  
  if (selectedSubAction === "sendAndWait") {
    const waitFieldsValid = waitFields.length > 0 && 
      waitFields.every(f => f.label.trim() && f.type);
    return basicFieldsValid && waitFieldsValid;
  }
}