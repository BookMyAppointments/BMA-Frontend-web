import { useState, useEffect } from 'react'
import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import MobileNavbar from '../../components/Navbar/MobileNavbar'
import Footer from '../../components/Footer/Footer'
import TestBookingForm from '../../components/TestBookingForm/TestBookingForm'
import { API_BASE_URL } from '../../services/api'

interface Lab {
    id: string;
    name: string;
    location: {
        address: string;
        lat: number;
        lng: number;
    };
    tests: Test[];
}

interface Test {
    id: string;
    name: string;
    category: string;
    price: number;
    homeSample: boolean;
    labId: string;
}

const TestBooking: FC = () => {
    const navigate = useNavigate();
    const [labs, setLabs] = useState<Lab[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTest, setSelectedTest] = useState<{ test: Test; lab: Lab } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchLabsAndTests = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${API_BASE_URL}/labs/all`);
                if (!response.ok) {
                    throw new Error('Failed to fetch labs');
                }
                const labsData = await response.json();

                // Fetch tests for each lab
                const labsWithTests = await Promise.all(
                    labsData.map(async (lab: Lab) => {
                        const testsResponse = await fetch(`${API_BASE_URL}/tests/lab/${lab.id}`);
                        if (!testsResponse.ok) {
                            throw new Error(`Failed to fetch tests for lab ${lab.name}`);
                        }
                        const testsData = await testsResponse.json();
                        return { ...lab, tests: testsData };
                    })
                );

                setLabs(labsWithTests);
            } catch (err) {
                console.error('Error fetching labs and tests:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch labs and tests');
            } finally {
                setLoading(false);
            }
        };

        fetchLabsAndTests();
    }, []);

    const handleTestSelect = (test: Test, lab: Lab) => {
        setSelectedTest({ test, lab });
    };

    const filteredLabs = labs.filter(lab => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            lab.name.toLowerCase().includes(searchTerm) ||
            lab.tests.some(test => 
                test.name.toLowerCase().includes(searchTerm) ||
                test.category.toLowerCase().includes(searchTerm)
            )
        );
    });

    if (selectedTest) {
        return (
            <div className="min-h-screen flex flex-col">
                <div className="hidden lg:block">
                    <Navbar />
                </div>
                <div className="block lg:hidden sticky top-0 z-30 bg-white">
                    <MobileNavbar />
                </div>
                
                <div className="flex-1">
                    <div className="w-[97%] mx-auto mt-6 mb-4">
                        <button
                            onClick={() => setSelectedTest(null)}
                            className="flex items-center text-blue-600 hover:text-blue-700"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Labs
                        </button>
                    </div>
                    <TestBookingForm testId={selectedTest.test.id} labId={selectedTest.lab.id} />
                </div>
                <Footer />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <div className="hidden lg:block">
                    <Navbar />
                </div>
                <div className="block lg:hidden sticky top-0 z-30 bg-white">
                    <MobileNavbar />
                </div>
                <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <div className="hidden lg:block">
                    <Navbar />
                </div>
                <div className="block lg:hidden sticky top-0 z-30 bg-white">
                    <MobileNavbar />
                </div>
                <div className="flex-1 flex justify-center items-center">
                    <div className="text-center">
                        <div className="text-red-500 text-2xl mb-4">⚠️</div>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="hidden lg:block">
                <Navbar />
            </div>
            <div className="block lg:hidden sticky top-0 z-30 bg-white">
                <MobileNavbar />
            </div>
            
            <div className="flex-1">
                <div className="w-[97%] mx-auto mt-6">
                    <div className="bg-white rounded-lg p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">Available Tests</h2>

                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Search tests or labs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                                <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {filteredLabs.map(lab => (
                                <div key={lab.id} className="border border-gray-100 rounded-lg p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{lab.name}</h3>
                                            <p className="text-gray-500 text-sm">{lab.location.address}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {lab.tests.map(test => (
                                            <div 
                                                key={test.id}
                                                className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 cursor-pointer transition-colors"
                                                onClick={() => handleTestSelect(test, lab)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-medium text-gray-800">{test.name}</h4>
                                                        <p className="text-sm text-gray-500">{test.category}</p>
                                                    </div>
                                                    <div className="text-blue-600 font-semibold">
                                                        ₹{test.price}
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    {test.homeSample && (
                                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                            Home Collection Available
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {filteredLabs.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No labs or tests found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default TestBooking