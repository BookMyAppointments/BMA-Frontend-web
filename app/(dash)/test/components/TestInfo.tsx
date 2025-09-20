import { useState } from 'react'
import type { FC } from 'react'

interface Test {
    id: string;
    name: string;
    category: string;
    price: number;
    homeSample: boolean;
    labId: string;
    description?: string;
    preparation?: string;
    reportTime?: string;
    lab?: {
        id: string;
        name: string;
        location: {
            address: string;
            lat: number;
            lng: number;
        };
    };
}

interface TestInfoProps {
    test: Test;
}

const TestInfo: FC<TestInfoProps> = ({ test }) => {
    const [activeTab, setActiveTab] = useState<'about' | 'preparation' | 'others'>('about');

    const navigate = (path: string) => {
        window.location.href = path;
    }
    const handleBookNow = () => {
        navigate(`/test-booking?testId=${test.id}&labId=${test.labId}`);
    };

    return (
        <div className="w-[97%] mx-auto mt-6">
            <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
                {/* Left Section */}
                <div className="lg:w-[70%]">
                    <div className="bg-white rounded-lg p-4">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveTab('about')}
                                className={`px-4 py-2 rounded-full ${activeTab === 'about'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                About
                            </button>
                            <button
                                onClick={() => setActiveTab('preparation')}
                                className={`px-4 py-2 rounded-full ${activeTab === 'preparation'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                Preparation
                            </button>
                            <button
                                onClick={() => setActiveTab('others')}
                                className={`px-4 py-2 rounded-full ${activeTab === 'others'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                Others
                            </button>
                        </div>

                        <div className="mt-6">
                            {activeTab === 'about' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">About Test</h3>
                                        <p className="mt-2 text-gray-600">
                                            {test.description || 'No description available'}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-md font-semibold text-gray-800">Category</h4>
                                        <p className="mt-2 text-gray-600">{test.category}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-md font-semibold text-gray-800">Price</h4>
                                        <p className="mt-2 text-gray-600">₹{test.price}</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'preparation' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">Test Preparation</h3>
                                        <p className="mt-2 text-gray-600">
                                            {test.preparation || 'No specific preparation required'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'others' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">Additional Information</h3>
                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <h4 className="font-medium text-gray-800">Report Delivery</h4>
                                                <p className="text-gray-600 mt-1">{test.reportTime || 'Within 24 hours'}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Sample Collection</h4>
                                                <p className="text-gray-600 mt-1">
                                                    {test.homeSample ? 'Available at Lab & Home' : 'Available at Lab only'}
                                                </p>
                                            </div>
                                            {test.lab && (
                                                <div>
                                                    <h4 className="font-medium text-gray-800">Lab Location</h4>
                                                    <p className="text-gray-600 mt-1">{test.lab.location.address}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="lg:w-[30%]">
                    <div className="bg-white rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Book Test</h2>
                        <button
                            onClick={handleBookNow}
                            className="w-full bg-blue-500 text-white rounded-lg py-3 hover:bg-blue-600 transition-colors"
                        >
                            Book Now
                        </button>

                        <div className="mt-6 space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-600">Sample Collection</h3>
                                <p className="text-sm text-gray-800 mt-1">
                                    {test.homeSample ? 'Available at Lab & Home' : 'Available at Lab only'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-600">Report Delivery</h3>
                                <p className="text-sm text-gray-800 mt-1">{test.reportTime || 'Within 24 hours'}</p>
                            </div>
                            {test.lab && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-600">Lab Name</h3>
                                    <p className="text-sm text-gray-800 mt-1">{test.lab.name}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestInfo