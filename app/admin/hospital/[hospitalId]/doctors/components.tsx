import { useState } from "react";
import { DoctorArraySectionProps, DoctorBasicInfoSectionProps, DoctorDataRequest, AvailabilitySlot } from "./types";
import { User, Plus, X, DollarSign, FileText, Mail, Phone, Clock, Calendar } from "lucide-react";

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

export const DoctorAvailabilitySection: React.FC<{
    availability: AvailabilitySlot[];
    setFormData: React.Dispatch<React.SetStateAction<DoctorDataRequest>>;
    error?: string;
}> = ({ availability, setFormData, error }) => {
    const [selectedDay, setSelectedDay] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const daysOfWeek = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];

    const addAvailabilitySlot = () => {
        if (selectedDay && startTime && endTime) {
            // Check if this day already exists
            const existingSlotIndex = availability.findIndex(slot => slot.day === selectedDay);
            
            const newSlot: AvailabilitySlot = {
                day: selectedDay,
                startTime,
                endTime
            };

            let updatedAvailability;
            if (existingSlotIndex >= 0) {
                // Update existing slot
                updatedAvailability = availability.map((slot, index) => 
                    index === existingSlotIndex ? newSlot : slot
                );
            } else {
                // Add new slot
                updatedAvailability = [...availability, newSlot];
            }

            setFormData(prev => ({
                ...prev,
                availability: updatedAvailability
            }));

            // Reset form
            setSelectedDay('');
            setStartTime('');
            setEndTime('');
        }
    };

    const removeAvailabilitySlot = (index: number) => {
        setFormData(prev => ({
            ...prev,
            availability: availability.filter((_, i) => i !== index)
        }));
    };

    // Sort availability by day order
    const sortedAvailability = [...availability].sort((a, b) => {
        return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
    });

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="text-blue-600" size={20} />
                Doctor Availability *
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Day of Week
                    </label>
                    <select
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select Day</option>
                        {daysOfWeek.map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                    </label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                    </label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="flex items-end">
                    <button
                        type="button"
                        onClick={addAvailabilitySlot}
                        disabled={!selectedDay || !startTime || !endTime}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Plus size={16} />
                        Add Slot
                    </button>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <Clock size={16} />
                    Weekly Schedule
                </h3>
                {sortedAvailability.length === 0 ? (
                    <p className="text-gray-500 italic">No availability slots added yet</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {sortedAvailability.map((slot, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                            >
                                <div>
                                    <span className="font-medium text-gray-800">{slot.day}</span>
                                    <p className="text-sm text-gray-600">
                                        {slot.startTime} - {slot.endTime}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeAvailabilitySlot(index)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
