'use client';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { UserCheck, Stethoscope, GraduationCap, Save, Loader2 } from 'lucide-react';
import { DoctorDataRequest, DoctorFormErrors } from '../types';
import { DoctorArraySection, DoctorBasicInfoSection, DoctorAvailabilitySection } from '../components';

export default function DoctorCreateForm({ hospitalId }: { hospitalId: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<DoctorFormErrors>({});    const [formData, setFormData] = useState<DoctorDataRequest>({
        name: '',
        email: '',
        phone: '',
        specialization: [] as string[],
        qualifications: [] as string[],
        price: '',
        about: '',
        availability: []
    });

    const validateForm = () => {
        const newErrors: DoctorFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Doctor name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        if (formData.specialization.length === 0) {
            newErrors.specialization = 'At least one specialization is required';
        }

        if (formData.qualifications.length === 0) {
            newErrors.qualifications = 'At least one qualification is required';
        }

        if (!formData.price || Number(formData.price) <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }        if (!formData.about.trim()) {
            newErrors.about = 'About section is required';
        }

        if (formData.availability.length === 0) {
            newErrors.availability = 'At least one availability slot is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/create?hospitalId=${hospitalId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    specialization: formData.specialization,
                    qualifications: formData.qualifications,
                    price: Number(formData.price),
                    about: formData.about,
                    availability: formData.availability
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Doctor profile created successfully!');                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    specialization: [],
                    qualifications: [],
                    price: '',
                    about: '',
                    availability: []
                });
            } else {
                throw new Error(data.message || 'Failed to create doctor profile');
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
                            <UserCheck className="text-blue-600" size={32} />
                            Create Doctor Profile
                        </h1>
                        <p className="text-gray-600 mt-2">Add a new doctor profile with all required details</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <DoctorBasicInfoSection
                            formData={formData}
                            setFormData={setFormData}
                            errors={errors}
                        />

                        <DoctorArraySection
                            title="Specializations"
                            icon={<Stethoscope className="text-blue-600" size={20} />}
                            items={formData.specialization}
                            onItemsChange={(specialization: string[]) => setFormData(prev => ({ ...prev, specialization }))}
                            placeholder="Enter specialization (e.g., Cardiology, Neurology)"
                            error={errors.specialization}
                        />                        <DoctorArraySection
                            title="Qualifications"
                            icon={<GraduationCap className="text-green-600" size={20} />}
                            items={formData.qualifications}
                            onItemsChange={(qualifications: string[]) => setFormData(prev => ({ ...prev, qualifications }))}
                            placeholder="Enter qualification (e.g., MD, MBBS, MS)"
                            error={errors.qualifications}
                        />

                        <DoctorAvailabilitySection
                            availability={formData.availability}
                            setFormData={setFormData}
                            error={errors.availability}
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
                                        Creating Doctor Profile...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Create Doctor Profile
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
