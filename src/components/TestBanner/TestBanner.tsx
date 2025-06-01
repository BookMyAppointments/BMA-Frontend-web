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

interface TestBannerProps {
    test: Test;
}

const TestBanner: FC<TestBannerProps> = ({ test }) => {
    return (
        <div className="relative w-[97%] mx-auto h-[400px] sm:h-[320px] md:h-[320px] lg:h-[320px] bg-[#EEF4FF] rounded-lg py-4 px-4 sm:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto h-full">
                <div className="flex flex-col sm:flex-row h-full sm:items-center">
                    <div className="flex-1">
                        <span className="text-gray-500 text-sm">{test.category}</span>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mt-1">
                            {test.name}
                        </h1>
                        
                        <p className="text-gray-500 mt-2 sm:mt-4 text-xs sm:text-sm lg:text-base">
                            {test.description || 'No description available'}
                        </p>

                        <div className="text-lg sm:text-xl font-semibold text-blue-600 mt-2 sm:mt-4 mb-2 sm:mb-4">
                            ₹{test.price}<span className="text-gray-500 text-xs sm:text-sm ml-1">/test</span>
                        </div>

                        <div className="flex flex-wrap gap-3 sm:gap-4">
                            {test.homeSample && (
                                <div className="bg-white rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 min-w-[90px] sm:min-w-[100px] text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-500 text-xs sm:text-sm">Home Collection</span>
                                </div>
                            )}

                            {test.reportTime && (
                                <div className="bg-white rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 min-w-[90px] sm:min-w-[100px] text-center">
                                    <div className="text-lg sm:text-xl font-semibold">{test.reportTime}</div>
                                    <span className="text-gray-500 text-xs sm:text-sm">Report Time</span>
                                </div>
                            )}

                            {test.lab && (
                                <div className="bg-white rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 min-w-[90px] sm:min-w-[100px] text-center">
                                    <div className="text-lg sm:text-xl font-semibold">{test.lab.name}</div>
                                    <span className="text-gray-500 text-xs sm:text-sm">Lab</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestBanner