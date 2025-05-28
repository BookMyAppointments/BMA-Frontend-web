import type { FC } from 'react'
import { useState } from 'react'

interface TestBannerProps {
    testId: string | undefined;
}

const TestBanner: FC<TestBannerProps> = ({ testId }) => {
    const [testData] = useState({
        id: testId,
        name: 'Complete Blood Count (CBC)',
        description: 'A complete blood count (CBC) is a blood test used to evaluate your overall health and detect a wide range of disorders, including anemia, infection and leukemia.',
        price: 500,
        duration: '1 day',
        rating: 4.8,
        testsCount: '10K+',
        accuracy: '99.9%'
    });

    return (
        <div className="relative w-[97%] mx-auto h-[400px] sm:h-[320px] md:h-[320px] lg:h-[320px] bg-[#EEF4FF] rounded-lg py-4 px-4 sm:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto h-full">
                <div className="flex flex-col sm:flex-row h-full sm:items-center">
                    <div className="flex-1 z-10">
                        <span className="text-gray-500 text-sm">Diagnostic Test</span>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mt-1">
                            {testData.name}
                        </h1>
                        
                        <p className="text-gray-500 mt-2 sm:mt-4 text-xs sm:text-sm lg:text-base">
                            {testData.description}
                        </p>

                        <div className="text-lg sm:text-xl font-semibold text-blue-600 mt-2 sm:mt-4 mb-2 sm:mb-4">
                            ₹{testData.price}<span className="text-gray-500 text-xs sm:text-sm ml-1">/test</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <div className="bg-white rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 min-w-[90px] sm:min-w-[100px] text-center">
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-lg sm:text-xl font-semibold">{testData.rating}</span>
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <span className="text-gray-500 text-xs sm:text-sm">Rating</span>
                            </div>

                            <div className="bg-white rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 min-w-[90px] sm:min-w-[100px] text-center">
                                <div className="text-lg sm:text-xl font-semibold">{testData.testsCount}</div>
                                <span className="text-gray-500 text-xs sm:text-sm">Tests Done</span>
                            </div>

                            <div className="bg-white rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 min-w-[90px] sm:min-w-[100px] text-center">
                                <div className="text-lg sm:text-xl font-semibold">{testData.accuracy}</div>
                                <span className="text-gray-500 text-xs sm:text-sm">Accuracy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestBanner