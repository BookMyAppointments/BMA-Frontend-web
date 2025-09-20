'use client';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { Building, Heart, Save, Loader2 } from 'lucide-react';
import { LabDataRequest, LabFormErrors } from '../types';
import { LabArraySection, LabBasicInfoSection, LabLocationSection, LabOperatingHoursSection } from '../components';

interface LabCreateFormProps {
    hospitalId?: string;
}

export default function LabCreateForm({ hospitalId }: LabCreateFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<LabFormErrors>({});
    const [formData, setFormData] = useState<LabDataRequest>({
        name: '',
        description: '',
        location: {
            lat: '',
            lng: '',
            address: ''
        },
        services: [] as string[],
        hours: []
    });

    const validateForm = () => {
        const newErrors: LabFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Lab name is required';
        }

        if (!formData.location.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.location.lat || !formData.location.lng) {
            newErrors.coordinates = 'Latitude and longitude are required';
        }

        if (formData.services.length === 0) {
            newErrors.services = 'At least one service is required';
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
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/labs/create?hospitalId=${hospitalId}`

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Lab created successfully!');
                setFormData({
                    name: '',
                    description: '',
                    location: { lat: '', lng: '', address: '' },
                    services: [],
                    hours: []
                });
            } else {
                throw new Error(data.message || 'Failed to create lab');
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
                    <div className="border-b border-gray-200 pb-6 mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Building className="text-blue-600" size={32} />
                            Create New Lab
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {hospitalId
                                ? "Add a new lab to the hospital with all required details"
                                : "Create a new standalone lab with all required details"
                            }
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <LabBasicInfoSection
                            formData={formData}
                            setFormData={setFormData}
                            errors={errors}
                        />

                        <LabLocationSection
                            formData={formData}
                            setFormData={setFormData}
                            errors={errors}
                        />                        <LabArraySection
                            title="Services"
                            icon={<Heart className="text-red-600" size={20} />}
                            items={formData.services}
                            onItemsChange={(services: string[]) => setFormData(prev => ({ ...prev, services }))}
                            placeholder="Enter service name"
                            error={errors.services}
                        />

                        <LabOperatingHoursSection
                            hours={formData.hours || []}
                            setFormData={setFormData}
                            error={errors.hours}
                        />

                        <div className="pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Creating Lab...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Create Lab
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