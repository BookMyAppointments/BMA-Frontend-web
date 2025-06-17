'use client';
import { toast } from 'react-toastify';
import React, { useCallback, useEffect, useState } from 'react';
import { Building, Users, Wrench, Heart, Save, Loader2, Delete } from 'lucide-react';
import { HospitalFormErrors, HospitalDataRequest } from '../create/types';
import { ArraySection, BasicInfoSection, HoursSection, LocationSection } from '../components';

const HospitalUpdateForm = ({ id }: { id: string }) => {
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
    const [isDeleting, setIsDeleting] = useState(false);

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
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hospitals/update/${id}`, {
                method: 'PUT',
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
                throw new Error(data.message || 'Failed to update hospital');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!window.confirm('Are you sure you want to delete this hospital? This action cannot be undone.')) {
            return;
        }
        try {
            setIsDeleting(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hospitals/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete hospital');
            }
            toast.success('Hospital deleted successfully');
        } catch (error) {
            console.error('Error deleting hospital:', error);
            toast.error('Failed to delete hospital. Please try again later.');
        } finally {
            setIsDeleting(false);
        }
    }

    const getHostpitalData = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hospitals/get/${id}`, {
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (!response.ok) {
                toast.error('Failed to fetch hospital data. Please check the ID and try again.');
                return;
            }
            const data = await response.json();
            setFormData(data);
        } catch (error) {
            console.error('Error fetching hospital data:', error);
            toast.error('Failed to fetch hospital data. Please try again later.');
        }
    }, [id]);

    useEffect(() => {
        getHostpitalData();
    }, [getHostpitalData]);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="border-b border-gray-200 pb-6 mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Building className="text-blue-600" size={32} />
                            Create New Hospital
                        </h1>
                        <p className="text-gray-600 mt-2">Add a new hospital to the system with all required details</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <BasicInfoSection
                            formData={formData}
                            setFormData={setFormData}
                            errors={errors}
                        />

                        <LocationSection
                            formData={formData}
                            setFormData={setFormData}
                            errors={errors}
                        />
                        <ArraySection
                            title="Departments"
                            icon={<Users className="text-green-600" size={20} />}
                            items={formData.departments}
                            onItemsChange={(departments: string[]) => setFormData(prev => ({ ...prev, departments }))}
                            placeholder="Enter department name"
                            error={errors.departments}
                        />
                        <ArraySection
                            title="Facilities"
                            icon={<Wrench className="text-purple-600" size={20} />}
                            items={formData.facilities}
                            onItemsChange={(facilities: string[]) => setFormData(prev => ({ ...prev, facilities }))}
                            placeholder="Enter facility name"
                            error={undefined}
                        />

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
                                        Update Hospital
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="pt-6 border-t border-gray-200">
                            <button
                                disabled={isDeleting}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                onClick={handleDelete}
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Deleting Hospital...
                                    </>
                                ) : (
                                    <>
                                        <Delete size={20} />
                                        Delete Hospital
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

export default HospitalUpdateForm;