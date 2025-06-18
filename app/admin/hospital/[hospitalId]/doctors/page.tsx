'use client';
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Stethoscope, Plus, Loader2, Star } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { Doctor } from "@/types/doctor";

export default function DoctorsPage() {
    const { hospitalId } = useParams<{ hospitalId: string }>();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDoctors = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/hospitals/get/${hospitalId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.ok) {
                toast.error('Failed to fetch doctors');
                return;
            }            const data = await response.json();
            // Extract doctor objects from the nested structure
            const doctorData = data.doctors?.map((item: any) => item.doctor) || [];
            setDoctors(doctorData);
            console.log('Fetched doctors:', data.doctors);
            console.log('Mapped doctors:', doctorData);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch doctors';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [hospitalId]);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Stethoscope className="text-blue-600" size={24} />
                                Doctor Management
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage all doctors associated with this hospital
                            </p>
                        </div>
                        <Link
                            href={`/admin/hospital/${hospitalId}/doctors/create`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Add New Doctor
                        </Link>
                    </div>

                    {doctors.length === 0 ? (<div className="text-center py-12 bg-gray-50 rounded-lg">
                        <Stethoscope className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Doctors Found</h3>
                        <p className="text-gray-600">Start by adding a new doctor to this hospital.</p>
                    </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {doctors?.map((doctor) => (
                                <Link
                                    href={`/admin/hospital/${hospitalId}/doctors/${doctor.id}`}
                                    key={doctor.id}
                                    className="block border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            {doctor.user.profile ? (
                                                <Image
                                                    src={doctor.user.profile}
                                                    alt={doctor.user.name}
                                                    width={48}
                                                    height={48}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <Stethoscope className="text-blue-600" size={20} />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {doctor.user.name}
                                                </h3>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Star className="text-yellow-400 fill-current" size={16} />
                                                    <span className="text-sm text-gray-600">{doctor.ratings}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-gray-600 text-sm mb-2">
                                            Patients: {doctor.patientsCount}
                                        </p>
                                        <p className="text-green-600 font-semibold text-sm">
                                            ${doctor.price}/session
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Specializations</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {doctor.specialization.slice(0, 2).map((spec, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                                >
                                                    {spec}
                                                </span>
                                            ))}
                                            {doctor.specialization.length > 2 && (
                                                <span className="inline-block px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                                                    +{doctor.specialization.length - 2} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
