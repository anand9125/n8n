
import { useState, useEffect } from 'react';
import { FormField, ActionConfig } from '../types';

export const useActionForm = (selectedAction: string, config: ActionConfig | null) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedSubAction, setSelectedSubAction] = useState("");
  const [waitFields, setWaitFields] = useState<FormField[]>([]);

  useEffect(() => {
    if (config) {
      const initialData: Record<string, any> = {};
      config.fields.forEach(field => {
        initialData[field.name] = field.defaultValue || '';
      });
      setFormData(initialData);
    }
    if (selectedAction === "telegram" || selectedAction === "resend") {
      setSelectedSubAction("send");
    }
  }, [selectedAction, config]);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

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

  return {
    formData,
    selectedSubAction,
    setSelectedSubAction,
    waitFields,
    handleInputChange,
    addField,
    removeField,
    updateField
  };
};