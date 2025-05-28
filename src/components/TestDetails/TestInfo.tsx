import { useState } from 'react'
import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'

const TestInfo: FC = () => {
    const [activeTab, setActiveTab] = useState<'about' | 'preparation' | 'others'>('about');
    const navigate = useNavigate();

    return (
        <div className="w-[97%] mx-auto mt-6">
            <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
                {/* Left Section */}
                <div className="lg:w-[70%]">
                    <div className="bg-white rounded-lg p-4">
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setActiveTab('about')}
                                className={`px-4 py-2 rounded-full ${
                                    activeTab === 'about' 
                                        ? 'bg-blue-100 text-blue-600' 
                                        : 'text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                About
                            </button>
                            <button 
                                onClick={() => setActiveTab('preparation')}
                                className={`px-4 py-2 rounded-full ${
                                    activeTab === 'preparation' 
                                        ? 'bg-blue-100 text-blue-600' 
                                        : 'text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                Preparation
                            </button>
                            <button 
                                onClick={() => setActiveTab('others')}
                                className={`px-4 py-2 rounded-full ${
                                    activeTab === 'others' 
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
                                            A complete blood count (CBC) is one of the most commonly performed blood tests. It reveals important information about the types and numbers of cells in your blood. It helps your doctor check for various diseases and conditions.
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-md font-semibold text-gray-800">What It Measures</h4>
                                        <ul className="mt-2 text-gray-600 list-disc list-inside">
                                            <li>Red blood cells (RBCs)</li>
                                            <li>White blood cells (WBCs)</li>
                                            <li>Platelets</li>
                                            <li>Hemoglobin levels</li>
                                            <li>Hematocrit percentage</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="text-md font-semibold text-gray-800">When It's Needed</h4>
                                        <ul className="mt-2 text-gray-600 list-disc list-inside">
                                            <li>During routine medical checkups</li>
                                            <li>To monitor existing blood conditions</li>
                                            <li>To diagnose various disorders</li>
                                            <li>Before surgery</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'preparation' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">Test Preparation</h3>
                                        <ul className="mt-4 space-y-4">
                                            <li className="flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    1
                                                </span>
                                                <div>
                                                    <h4 className="font-medium text-gray-800">Fasting Required</h4>
                                                    <p className="text-gray-600 mt-1">Fast for 8-12 hours before the test</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    2
                                                </span>
                                                <div>
                                                    <h4 className="font-medium text-gray-800">Avoid Smoking</h4>
                                                    <p className="text-gray-600 mt-1">Do not smoke for at least 1 hour before the test</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    3
                                                </span>
                                                <div>
                                                    <h4 className="font-medium text-gray-800">Medications</h4>
                                                    <p className="text-gray-600 mt-1">Inform about any medications you're currently taking</p>
                                                </div>
                                            </li>
                                        </ul>
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
                                                <p className="text-gray-600 mt-1">Reports will be available within 24 hours</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Sample Collection</h4>
                                                <p className="text-gray-600 mt-1">Home collection available</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Payment Options</h4>
                                                <p className="text-gray-600 mt-1">Cash, Cards, UPI accepted</p>
                                            </div>
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
                            onClick={() => navigate('/test-booking')}
                            className="w-full bg-blue-500 text-white rounded-lg py-3 hover:bg-blue-600 transition-colors"
                        >
                            Book Now
                        </button>
                        
                        <div className="mt-6 space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-600">Sample Collection</h3>
                                <p className="text-sm text-gray-800 mt-1">Available at Lab & Home</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-600">Report Delivery</h3>
                                <p className="text-sm text-gray-800 mt-1">Within 24 hours</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-600">Lab Timing</h3>
                                <p className="text-sm text-gray-800 mt-1">Mon - Sat: 7:00 AM - 9:00 PM</p>
                                <p className="text-sm text-gray-800">Sun: 8:00 AM - 6:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestInfo