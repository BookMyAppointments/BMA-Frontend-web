'use client';
import { useParams } from 'next/navigation';
import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TestCategories from "@/components/dash/tests/TestCategories";
import TestList from '@/components/dash/tests/TestList';
import { FacilityBanner } from "@/components/dash/hospital/FacilityBanner";
import { API_BASE_URL } from "@/services/api";

const LabDetails: FC = () => {
    const { labId } = useParams();
    const labIdString = labId || '';
    const [selectedCategory, setSelectedCategory] = useState<string>('Biochemistry');

    // Query for lab data - Transform the data for FacilityBanner
    const { data: labData, isLoading: isLabLoading, error: labError } = useQuery({
        queryKey: ['lab', labIdString],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/labs/get/${labIdString}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            console.log("Raw lab data:", data);
            
            // Transform the data to match FacilityBanner props
            const transformedData = {
                name: data.name,
                description: data.description || `${data.name} provides comprehensive diagnostic services with state-of-the-art technology and experienced technicians.`,
                bannerImage: data.banner || '/banners/banner3.jpg',
                metrics: {
                    rating: 4.8, // Default rating since it's not in your lab data
                    patientsCount: data.noOfPatients?.toString() + '+' || '500+',
                    doctorsCount: '25+', // You can replace with actual technician count
                    testsCount: data.services?.length?.toString() + '+' || '50+'
                }
            };
            
            console.log("Transformed lab data:", transformedData);
            return transformedData;
        },
        enabled: !!labIdString
    });

    // Query for tests data for this specific lab
    const { data: tests = [], isLoading: isTestsLoading, error: testsError } = useQuery({
        queryKey: ['tests', labIdString],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/tests/lab/${labIdString}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const testsData = await res.json();
            console.log("Tests data:", testsData);
            return testsData;
        },
        enabled: !!labIdString
    });

    // Query for test categories
    const { data: categories = [] } = useQuery({
        queryKey: ['testCategories'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/tests/categories/all`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return await res.json();
        }
    });

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    console.log("Current state - labData:", labData, "tests:", tests, "categories:", categories);

    const isLoading = isLabLoading || isTestsLoading;
    const error = labError || testsError;

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

    if (error) {
        return (
            <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
                <main className="flex-1 w-full">
                    <div className="text-center py-8">
                        <div className="text-red-500 text-lg mb-2">⚠️</div>
                        <p className="text-gray-600">{error instanceof Error ? error.message : 'Something went wrong'}</p>
                        <button
                            onClick={() => window.location.reload()}
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
                {labData && (
                    <FacilityBanner 
                        name={labData.name}
                        description={labData.description}
                        bannerImage={labData.bannerImage}
                        metrics={labData.metrics}
                    />
                )}
                <div className="">
                    <div className="">
                        <TestCategories
                            onCategoryChange={handleCategoryChange}
                            initialCategory={selectedCategory}
                            categories={categories}
                        />
                    </div>
                    <div className="">
                        <TestList 
                            selectedCategory={selectedCategory}
                            tests={tests}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LabDetails;