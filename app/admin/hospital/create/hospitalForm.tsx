'use client';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { Plus, X, MapPin, Clock, Building, Users, Wrench, Heart, Save, Loader2 } from 'lucide-react';
import { HospitalFormErrors, HospitalDataRequest, BasicInfoSectionProps, LocationSectionProps, ArraySectionProps, HoursSectionProps } from './types';

const HospitalForm = () => {
    const [errors, setErrors] = useState<HospitalFormErrors>({});
    const [formData, setFormData] = useState<HospitalDataRequest>({
        name: '',
        location: {
            lat: '',
            lng: '',
            address: ''
        },
        departments: [] as string[],
        facilities: [] as string[],
        services: [] as string[],
        hours: {
            monday: { open: '', close: '', closed: false },
            tuesday: { open: '', close: '', closed: false },
            wednesday: { open: '', close: '', closed: false },
            thursday: { open: '', close: '', closed: false },
            friday: { open: '', close: '', closed: false },
            saturday: { open: '', close: '', closed: false },
            sunday: { open: '', close: '', closed: false }
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors: HospitalFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Hospital name is required';
        }

        if (!formData.location.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.location.lat || !formData.location.lng) {
            newErrors.coordinates = 'Latitude and longitude are required';
        }

        if (formData.departments.length === 0) {
            newErrors.departments = 'At least one department is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            console.log('Submitting hospital data:', formData);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hospitals/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log('Response from server:', data);

            if (response.ok) {
                toast.success('Hospital created successfully!');
                // Reset form
                setFormData({
                    name: '',
                    location: { lat: '', lng: '', address: '' },
                    departments: [],
                    facilities: [],
                    services: [],
                    hours: {
                        monday: { open: '', close: '', closed: false },
                        tuesday: { open: '', close: '', closed: false },
                        wednesday: { open: '', close: '', closed: false },
                        thursday: { open: '', close: '', closed: false },
                        friday: { open: '', close: '', closed: false },
                        saturday: { open: '', close: '', closed: false },
                        sunday: { open: '', close: '', closed: false }
                    }
                });
            } else {
                throw new Error(data.message || 'Failed to create hospital');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {/* Header */}
                    <div className="border-b border-gray-200 pb-6 mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Building className="text-blue-600" size={32} />
                            Create New Hospital
                        </h1>
                        <p className="text-gray-600 mt-2">Add a new hospital to the system with all required details</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <BasicInfoSection
                            formData={formData}
                            setFormData={setFormData}
                            errors={errors}
                        />

                        {/* Location Section */}
                        <LocationSection
                            formData={formData}
                            setFormData={setFormData}
                            errors={errors}
                        />                        {/* Departments Section */}
                        <ArraySection
                            title="Departments"
                            icon={<Users className="text-green-600" size={20} />}
                            items={formData.departments}
                            onItemsChange={(departments: string[]) => setFormData(prev => ({ ...prev, departments }))}
                            placeholder="Enter department name"
                            error={errors.departments}
                        />                        {/* Facilities Section */}
                        <ArraySection
                            title="Facilities"
                            icon={<Wrench className="text-purple-600" size={20} />}
                            items={formData.facilities}
                            onItemsChange={(facilities: string[]) => setFormData(prev => ({ ...prev, facilities }))}
                            placeholder="Enter facility name"
                            error={undefined}
                        />

                        {/* Services Section */}
                        <ArraySection
                            title="Services"
                            icon={<Heart className="text-red-600" size={20} />}
                            items={formData.services}
                            onItemsChange={(services: string[]) => setFormData(prev => ({ ...prev, services }))}
                            placeholder="Enter service name"
                            error={undefined}
                        />

                        {/* Hours Section */}
                        <HoursSection
                            formData={formData}
                            setFormData={setFormData}
                        />

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Creating Hospital...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Create Hospital
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ formData, setFormData, errors }) => (
    <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Building className="text-blue-600" size={20} />
            Basic Information
        </h2>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Hospital Name *
            </label>
            <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev: HospitalDataRequest) => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                placeholder="Enter hospital name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
    </div>
);

const LocationSection: React.FC<LocationSectionProps> = ({ formData, setFormData, errors }) => (
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
                value={formData.location.address} onChange={(e) => setFormData((prev: HospitalDataRequest) => ({
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
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: { ...prev.location, lat: parseFloat(e.target.value) || '' }
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
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: { ...prev.location, lng: parseFloat(e.target.value) || '' }
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

const ArraySection: React.FC<ArraySectionProps> = ({ title, icon, items, onItemsChange, placeholder, error }) => {
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
                {title} {title === 'Departments' && '*'}
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

const HoursSection: React.FC<HoursSectionProps> = ({ formData, setFormData }) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    const updateHours = (day: string, field: string, value: string | boolean) => {
        setFormData((prev: HospitalDataRequest) => ({
            ...prev,
            hours: {
                ...prev.hours,
                [day]: {
                    ...prev.hours[day],
                    [field]: value
                }
            }
        }));
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="text-orange-600" size={20} />
                Operating Hours
            </h2>
            <div className="space-y-3">
                {days.map(day => (
                    <div key={day} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-24 font-medium text-gray-700 capitalize">
                            {day}
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.hours[day].closed}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateHours(day, 'closed', e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label className="text-sm text-gray-600">Closed</label>
                        </div>
                        {!formData.hours[day].closed && (
                            <>
                                <input
                                    type="time"
                                    value={formData.hours[day].open}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateHours(day, 'open', e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                    type="time"
                                    value={formData.hours[day].close}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateHours(day, 'close', e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HospitalForm;