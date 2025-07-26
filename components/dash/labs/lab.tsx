'use client';
import { useState, useEffect } from 'react'
import { FacilityBanner } from '../hospital/FacilityBanner'
import Categories from '../hospital/Categories'
import LabsList from './LabsList'
import { useLabById } from '@/hooks/useLabs'
import { fetchLabs } from '@/services/api'
import type { Lab } from '@/types/doctor'
import { useParams } from 'next/navigation'

export default function LabDetails() {
    const { labId } = useParams<{ labId?: string }>();
    const [selectedService, setSelectedService] = useState<string>('Blood Test');
    const { lab: selectedLab, loading: singleLabLoading } = useLabById(labId || '');
    const [labs, setLabs] = useState<Lab[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadLabs = async (service?: string) => {
        try {
            setLoading(true);
            setError(null);
            const fetchedLabs = await fetchLabs(service);
            setLabs(fetchedLabs);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch labs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!labId) {
            loadLabs(selectedService);
        }
    }, [labId, selectedService]);

    const handleCategoryChange = (category: string) => {
        setSelectedService(category);
        if (!labId) {
            loadLabs(category);
        }
    };

    const isLoading = labId ? singleLabLoading : loading;

    const labData = selectedLab ? {
        name: selectedLab.name,
        description: `${selectedLab.name} is Located at ${selectedLab.location.address}, we provide comprehensive diagnostic services with state-of-the-art technology and experienced technicians.`,
        bannerImage: selectedLab.banner || '/banners/banner2.jpg', // Use lab banner or fallback
        metrics: {
            rating: 4.8,
            patientsCount: '5000+',
            doctorsCount: '25+',
            testsCount: selectedLab.services.length.toString() + '+'
        }
    } : {
        name: 'All Diagnostic Centers',
        description: 'Find and book diagnostic tests from the best labs in your area. Compare prices, read reviews, and book appointments online.',
        bannerImage: '/banners/banner3.jpg', // Default fallback for all labs view
        metrics: {
            rating: 4.8,
            patientsCount: '5000+',
            doctorsCount: '25+',
            testsCount: '100+'
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen w-full overflow-x-hidden">

                <main className="flex-1 w-full">
                    <div className="animate-pulse">
                        <div className="h-64 bg-gray-200 mx-6 rounded-xl mb-6"></div>
                        <div className="p-6">
                            <div className="h-20 bg-gray-200 rounded mb-4"></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-40 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (error && !labId) {
        return (
            <div className="flex flex-col min-h-screen w-full overflow-x-hidden">

                <main className="flex-1 w-full">
                    <div className="text-center py-8">
                        <div className="text-red-500 text-lg mb-2">⚠️</div>
                        <p className="text-gray-600">{error}</p>
                        <button
                            onClick={() => loadLabs(selectedService)}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden">


            <main className="flex-1 w-full">
                <FacilityBanner {...labData} />

                <div className="">
                    <div className="">
                        <Categories
                            onCategoryChange={handleCategoryChange}
                            initialCategory={selectedService}
                        />
                    </div>

                    <div className="">
                        {labId ? (
                            <LabsList selectedService={selectedService} labId={labId} />
                        ) : (
                            <LabsList selectedService={selectedService} labs={labs} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}