import { useState } from "react";
import { LabArraySectionProps, LabBasicInfoSectionProps, LabDataRequest, LabLocationSectionProps, OperatingHours } from "./types";
import { Building, MapPin, Plus, X, Clock, Calendar } from "lucide-react";

export const LabArraySection: React.FC<LabArraySectionProps> = ({ title, icon, items, onItemsChange, placeholder, error }) => {
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
                {title} {title === 'Services' && '*'}
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

export const LabLocationSection: React.FC<LabLocationSectionProps> = ({ formData, setFormData, errors }) => (
    <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <MapPin className="text-green-600" size={20} />
            Location Details
        </h2>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
            </label>
            <textarea
                value={formData.location.address}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((prev: LabDataRequest) => ({
                    ...prev,
                    location: { ...prev.location, address: e.target.value }
                }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                placeholder="Enter full address"
                rows={3}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude *
                </label>
                <input
                    type="number"
                    step="any"
                    value={formData.location.lat}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: LabDataRequest) => ({
                        ...prev,
                        location: { ...prev.location, lat: e.target.value }
                    }))}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.coordinates ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="e.g., 26.9124"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude *
                </label>
                <input
                    type="number"
                    step="any"
                    value={formData.location.lng}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: LabDataRequest) => ({
                        ...prev,
                        location: { ...prev.location, lng: e.target.value }
                    }))}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.coordinates ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="e.g., 75.7873"
                />
            </div>
        </div>
        {errors.coordinates && <p className="text-red-500 text-sm">{errors.coordinates}</p>}
    </div>
);

export const LabBasicInfoSection: React.FC<LabBasicInfoSectionProps> = ({ formData, setFormData, errors }) => (
    <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Building className="text-blue-600" size={20} />
            Basic Information
        </h2>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Lab Name *
            </label>
            <input
                type="text"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: LabDataRequest) => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                placeholder="Enter lab name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
            </label>
            <textarea
                value={formData.description || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((prev: LabDataRequest) => ({ ...prev, description: e.target.value }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                placeholder="Enter lab description (optional)"
                rows={3}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
    </div>
);

export const LabOperatingHoursSection: React.FC<{
    hours: OperatingHours[];
    setFormData: React.Dispatch<React.SetStateAction<LabDataRequest>>;
    error?: string;
}> = ({ hours, setFormData, error }) => {
    const [selectedDay, setSelectedDay] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const daysOfWeek = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];

    const addOperatingHour = () => {
        if (selectedDay && startTime && endTime) {
            // Check if this day already exists
            const existingSlotIndex = hours.findIndex(slot => slot.day === selectedDay);
            
            const newSlot: OperatingHours = {
                day: selectedDay,
                startTime,
                endTime
            };

            let updatedHours;
            if (existingSlotIndex >= 0) {
                // Update existing slot
                updatedHours = hours.map((slot, index) => 
                    index === existingSlotIndex ? newSlot : slot
                );
            } else {
                // Add new slot
                updatedHours = [...hours, newSlot];
            }

            setFormData(prev => ({
                ...prev,
                hours: updatedHours
            }));

            // Reset form
            setSelectedDay('');
            setStartTime('');
            setEndTime('');
        }
    };

    const removeOperatingHour = (index: number) => {
        setFormData(prev => ({
            ...prev,
            hours: hours.filter((_, i) => i !== index)
        }));
    };

    // Sort hours by day order
    const sortedHours = [...hours].sort((a, b) => {
        return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
    });

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="text-blue-600" size={20} />
                Operating Hours
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
                        onClick={addOperatingHour}
                        disabled={!selectedDay || !startTime || !endTime}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Plus size={16} />
                        Add Hours
                    </button>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <Clock size={16} />
                    Weekly Schedule
                </h3>
                {sortedHours.length === 0 ? (
                    <p className="text-gray-500 italic">No operating hours added yet</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {sortedHours.map((slot, index) => (
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
                                    onClick={() => removeOperatingHour(index)}
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