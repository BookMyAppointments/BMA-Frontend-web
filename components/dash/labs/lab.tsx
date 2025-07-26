'use client';
import { useState, useEffect } from 'react'
import { FacilityBanner } from '../hospital/FacilityBanner'
import LabCategories from './LabCategories' // Changed from Categories to LabCategories
import LabsList from './LabsList'
import { useLabById } from '@/hooks/useLabs'
import { fetchLabs } from '@/services/api'
import type { Lab } from '@/types/doctor'

export default function LabDetails({ labId }: { labId?: string }) {
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

    const handleServiceChange = (service: string) => { // Changed from handleCategoryChange
        setSelectedService(service);
        if (!labId) {
            loadLabs(service);
        }
    };

    const isLoading = labId ? singleLabLoading : loading;

    // Updated lab data structure with proper lab-specific content
    const labData = selectedLab ? {
        name: selectedLab.name,
        description: `${selectedLab.name} is located at ${selectedLab.location?.address || 'your area'}. We provide comprehensive diagnostic services with state-of-the-art technology and experienced technicians.`,
        bannerImage: selectedLab.banner || '/banners/banner2.jpg',
        metrics: {
            rating: 4.8,
            patientsCount: selectedLab.noOfPatients?.toString() + '+' || '500+',
            doctorsCount: '25+', // You might want to get actual technician count
            testsCount: selectedLab.services?.length?.toString() + '+' || '50+'
        }
    } : {
        name: 'All Diagnostic Centers',
        description: 'Find and book diagnostic tests from the best labs in your area. Compare prices, read reviews, and book appointments online.',
        bannerImage: '/banners/banner3.jpg',
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

                <div className="space-y-4">
                    {/* Lab Categories */}
                    <LabCategories
                        onServiceChange={handleServiceChange}
                        initialService={selectedService}
                    />

                    {/* Labs List */}
                    <LabsList 
                        selectedService={selectedService}
                        {...(labId ? { labId } : { labs })}
                    />
                </div>
            </main>
        </div>
    );
}