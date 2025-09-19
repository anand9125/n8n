import { userFormStore } from "@/store/formData";
import { useState } from "react";
type Field = {
    label: string;
    type: string;
    key?: string;
}


export const DynamicForm = () => {
    const { fields } = userFormStore();
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (key: string, value: any) => {
        setFormValues(prev => ({
            ...prev,
            [key]: value
        }));
        
        // Clear error when user starts typing
        if (errors[key]) {
            setErrors(prev => ({
                ...prev,
                [key]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        fields.forEach(field => {
            const key = field.key || field.label.toLowerCase().replace(/\s+/g, '_');
            const value = formValues[key];
            
            if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
                newErrors[key] = 'Please enter a valid email address';
            } else if (!value || value.toString().trim() === '') {
                newErrors[key] = `${field.label} is required`;
            }
        });
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        
        if (validateForm()) {
            console.log('Form submitted:', formValues);
            alert('Form submitted successfully! Check console for data.');
            
        }
    };

    const renderField = (field: Field) => {
        const key = field.key || field.label.toLowerCase().replace(/\s+/g, '_');
        const value = formValues[key] || '';
        const error = errors[key];

        const baseClasses = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
        }`;

        switch (field.type.toLowerCase()) {
            case 'text':
            case 'email':
            case 'password':
                return (
                    <input
                        type={field.type}
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className={baseClasses}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                );
            
            case 'textarea':
                return (
                    <textarea
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className={`${baseClasses} min-h-[100px] resize-vertical`}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        rows={4}
                    />
                );
            
            case 'number':
                return (
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className={baseClasses}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                );
            
            case 'date':
                return (
                    <input
                        type="date"
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className={baseClasses}
                    />
                );
            
            case 'select':
                return (
                    <select
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className={baseClasses}
                    >
                        <option value="">Select {field.label.toLowerCase()}</option>
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                );
            
            case 'checkbox':
                return (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={value || false}
                            onChange={(e) => handleInputChange(key, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">Yes, I agree</span>
                    </div>
                );
            
            default:
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className={baseClasses}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                );
        }
    };

    if (fields.length === 0) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No Form Fields</h2>
                    <p className="text-gray-500">Add some fields to see the form here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Form</h1>
                
                <div className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={index} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                {field.label}
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            {renderField(field)}
                            {errors[field.key || field.label.toLowerCase().replace(/\s+/g, '_')] && (
                                <p className="text-red-500 text-sm">
                                    {errors[field.key || field.label.toLowerCase().replace(/\s+/g, '_')]}
                                </p>
                            )}
                        </div>
                    ))}
                    
                    <div className="pt-4">
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium"
                        >
                            Submit Form
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};