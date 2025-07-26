import { useState, useEffect, useMemo, type FC } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';

interface Test {
    id: string;
    name: string;
    category: string;
    price: number;
    homeSample: boolean;
    lab?: {
        id: string;
        name: string;
        location?: {
            address: string;
            lat: number;
            lng: number;
        };
    };
}

interface TestListProps {
    selectedCategory?: string;
    tests?: Test[];
    labId?: string;
}

interface PageData {
    items: Test[];
    nextPage: number | undefined;
}

const TestList: FC<TestListProps> = ({ selectedCategory = 'Biochemistry', tests = [], labId }) => {
    const [userLocation, setUserLocation] = useState({ lat: 0, long: 0 });
    const [distances, setDistances] = useState<{ [key: string]: string }>({});
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchLocation = () => navigator.geolocation.getCurrentPosition((position) => {
            setUserLocation({
                lat: position.coords.latitude,
                long: position.coords.longitude
            });
        });
        fetchLocation();
    }, []);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error
    } = useInfiniteQuery<PageData>({
        queryKey: ['tests', selectedCategory, labId],
        queryFn: async ({ pageParam = 1 }) => {
            const start = ((pageParam as number) - 1) * itemsPerPage;
            const end = start + itemsPerPage;

            // Filter tests by category if provided
            const filteredTests = selectedCategory && selectedCategory !== 'All' 
                ? tests.filter(test => test?.category === selectedCategory)
                : tests;

            return {
                items: filteredTests.slice(start, end),
                nextPage: end < filteredTests.length ? (pageParam as number) + 1 : undefined
            };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
        enabled: !!tests.length,
        initialPageParam: 1
    });

    // Calculate distances whenever data or userLocation changes
    useEffect(() => {
        if (!data?.pages || !userLocation.lat || !userLocation.long) return;

        const newDistances: { [key: string]: string } = {};
        data.pages.forEach(page => {
            page.items.forEach((test: Test) => {
                if (test?.lab?.location?.lat && test?.lab?.location?.lng) {
                    const distance = calculateDistance(
                        userLocation.lat,
                        userLocation.long,
                        test.lab.location.lat,
                        test.lab.location.lng
                    );
                    newDistances[test.id] = distance;
                }
            });
        });
        setDistances(newDistances);
    }, [data, userLocation]);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return `${distance.toFixed(1)} Kms`;
    };

    const transformedTests = useMemo(() =>
        data?.pages.flatMap(page =>
            page.items
                .filter(test => test && test.id) // Filter out null/undefined tests
                .map((test: Test) => ({
                    id: test.id,
                    name: test.name || 'Unknown Test',
                    category: test.category || 'General',
                    price: test.price || 0,
                    homeSample: test.homeSample || false,
                    labName: test.lab?.name || 'Lab Name Not Available',
                    labId: test.lab?.id || labId || 'unknown',
                    distance: distances[test.id] || 'Calculating...',
                    address: test.lab?.location?.address || 'Address not available'
                }))
        ) || [], [data, distances, labId]);

    console.log("TestList debug:", { tests, selectedCategory, transformedTests, data });

    if (isLoading) {
        return (
            <div className="w-full p-3 lg:p-6 flex justify-center items-center min-h-[200px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading Tests...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-3 lg:p-6 flex justify-center items-center min-h-[200px]">
                <div className="text-center">
                    <p className="text-red-600">Failed to fetch tests. Please try again.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-3 lg:p-6">
            <div className="flex flex-col items-center gap-4 lg:gap-6">
                {transformedTests.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">No tests found for the selected category.</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Selected: {selectedCategory} | Total tests: {tests.length}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4 lg:gap-6 w-full max-w-[400px] lg:max-w-none lg:grid-cols-3">
                            {transformedTests.map((test) => (
                                <div key={test.id} className="bg-white rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-sm border border-gray-100 w-full">
                                    <div className="flex gap-2 lg:gap-3">
                                        <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <Image
                                                width={24}
                                                height={24}
                                                unoptimized
                                                src="/icons/cat.png"
                                                alt="Test Icon"
                                                className="w-6 h-6"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 text-sm lg:text-base line-clamp-1">{test.name}</h3>
                                            <p className="text-gray-500 text-xs lg:text-sm">{test.labName}</p>
                                            <p className="text-blue-600 font-semibold text-sm lg:text-base">₹{test.price}</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 lg:mt-4 flex flex-wrap items-center gap-1 lg:gap-1.5">
                                        <span className="px-1.5 lg:px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs whitespace-nowrap">
                                            {test.category}
                                        </span>
                                        {test.homeSample && (
                                            <span className="px-1.5 lg:px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-xs whitespace-nowrap">
                                                Home Sample
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-3 lg:mt-4 pb-2 flex flex-wrap items-center gap-2 lg:gap-4 text-xs lg:text-sm">
                                        <div className="flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {test.distance}
                                        </div>
                                    </div>

                                    <Link
                                        href={`/test/${test.id}`}
                                        className="inline-block w-full text-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs lg:text-sm"
                                    >
                                        Book Test
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {hasNextPage && (
                            <button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TestList;