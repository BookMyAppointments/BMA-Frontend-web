'use client';
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Building, Plus, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import { Lab } from "@/types/doctor";

export default function LabsPage() {
    const { hospitalId } = useParams<{ hospitalId: string }>();
    const [labs, setLabs] = useState<Lab[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLabs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/labs/get/${hospitalId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.ok) {
                toast.error('Failed to fetch labs');
                return;
            }

            const data = await response.json();
            setLabs(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch labs';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [hospitalId]);

    useEffect(() => {
        fetchLabs();
    }, [fetchLabs]);

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
                                <Building className="text-blue-600" size={24} />
                                Laboratory Management
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage all laboratories associated with this hospital
                            </p>
                        </div>
                        <Link
                            href={`/admin/hospital/${hospitalId}/labs/create`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Add New Lab
                        </Link>
                    </div>

                    {labs.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <Building className="mx-auto text-gray-400 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Labs Found</h3>
                            <p className="text-gray-600">Start by adding a new laboratory to this hospital.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {labs.map((lab) => (
                                <Link
                                    href={`/admin/hospital/${hospitalId}/labs/${lab.id}`}
                                    key={lab.id}
                                    className="block border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {lab.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4">
                                                {lab.location.address}
                                            </p>
                                        </div>
                                        <Building className="text-blue-600" size={20} />
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Services</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {lab.services.slice(0, 3).map((service, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                                >
                                                    {service}
                                                </span>
                                            ))}
                                            {lab.services.length > 3 && (
                                                <span className="inline-block px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                                                    +{lab.services.length - 3} more
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