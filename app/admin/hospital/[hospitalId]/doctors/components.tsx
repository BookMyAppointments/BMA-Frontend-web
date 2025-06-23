import { useState } from "react";
import { DoctorArraySectionProps, DoctorBasicInfoSectionProps, DoctorDataRequest } from "./types";
import { User, Plus, X, DollarSign, FileText, Mail, Phone } from "lucide-react";

export const DoctorArraySection: React.FC<DoctorArraySectionProps> = ({ title, icon, items, onItemsChange, placeholder, error }) => {
    const [inputValue, setInputValue] = useState('');

    const addItem = () => {
        if (inputValue.trim() && !items.includes(inputValue.trim())) {
            onItemsChange([...items, inputValue.trim()]);
            setInputValue('');
        }
    };

    const removeItem = (index: number) => {
        onItemsChange(items.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addItem();
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                {icon}
                {title} *
            </h2>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={addItem}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add
                </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex flex-wrap gap-2">
                {items.map((item: string, index: number) => (
                    <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                    >
                        {item}
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
};

export const DoctorBasicInfoSection: React.FC<DoctorBasicInfoSectionProps> = ({ formData, setFormData, errors }) => (
    <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <User className="text-blue-600" size={20} />
            Doctor Information
        </h2>

        <div>
            <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                <User size={16} />
                Full Name *
            </label>
            <input
                type="text"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: DoctorDataRequest) => ({
                    ...prev,
                    name: e.target.value
                }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                placeholder="Enter doctor's full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
            <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                <Mail size={16} />
                Email Address *
            </label>
            <input
                type="email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: DoctorDataRequest) => ({
                    ...prev,
                    email: e.target.value
                }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                placeholder="Enter doctor's email address"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
            <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                <Phone size={16} />
                Phone Number *
            </label>
            <input
                type="tel"
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: DoctorDataRequest) => ({
                    ...prev,
                    phone: e.target.value
                }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                placeholder="Enter doctor's phone number"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
            <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                <DollarSign size={16} />
                Consultation Price *
            </label>
            <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: DoctorDataRequest) => ({
                    ...prev,
                    price: e.target.value === '' ? '' : Number(e.target.value)
                }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                placeholder="Enter consultation price"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>        <div>
            <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                <FileText size={16} />
                About Doctor
            </label>
            <textarea
                value={formData.about}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((prev: DoctorDataRequest) => ({
                    ...prev,
                    about: e.target.value
                }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.about ? 'border-red-500' : 'border-gray-300'
                    }`}
                placeholder="Tell us about the doctor's experience and expertise..."
                rows={4}
            />
            {errors.about && <p className="text-red-500 text-sm mt-1">{errors.about}</p>}
        </div>
    </div>
);
