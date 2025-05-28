import { useState } from 'react'
import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'

const DoctorInfo: FC = () => {
    const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'others'>('about');
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
                                onClick={() => setActiveTab('reviews')}
                                className={`px-4 py-2 rounded-full ${
                                    activeTab === 'reviews' 
                                        ? 'bg-blue-100 text-blue-600' 
                                        : 'text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                Reviews
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
                                        <h3 className="text-lg font-semibold text-gray-800">About Doctor</h3>
                                        <p className="mt-2 text-gray-600">
                                            Dr. James Deen Avora is a highly skilled Pulmonologist with over 15 years of experience in treating respiratory conditions. He specializes in the diagnosis and treatment of lung diseases, including asthma, COPD, and respiratory infections.
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-md font-semibold text-gray-800">Specializations</h4>
                                        <ul className="mt-2 text-gray-600 list-disc list-inside">
                                            <li>Pulmonary Disease Treatment</li>
                                            <li>Asthma Management</li>
                                            <li>COPD Care</li>
                                            <li>Sleep Apnea</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="text-md font-semibold text-gray-800">Education & Experience</h4>
                                        <ul className="mt-2 text-gray-600 space-y-2">
                                            <li>MBBS - All India Institute of Medical Sciences, 2005</li>
                                            <li>MD in Pulmonology - Apollo Medical College, 2008</li>
                                            <li>Senior Consultant - Apollo Hospitals, 2008-Present</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'reviews' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Patient Reviews</h3>
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <span className="text-yellow-400">★★★★★</span>
                                                <span className="font-medium">Great Experience</span>
                                            </div>
                                            <p className="mt-2 text-gray-600">Very knowledgeable doctor. Explained everything clearly.</p>
                                            <p className="mt-1 text-sm text-gray-500">- John D.</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <span className="text-yellow-400">★★★★☆</span>
                                                <span className="font-medium">Good Treatment</span>
                                            </div>
                                            <p className="mt-2 text-gray-600">Professional and caring approach. Would recommend.</p>
                                            <p className="mt-1 text-sm text-gray-500">- Sarah M.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'others' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Other Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-gray-800">Languages</h4>
                                            <p className="mt-1 text-gray-600">English, Hindi, Telugu</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-800">Awards & Recognition</h4>
                                            <ul className="mt-1 text-gray-600 list-disc list-inside">
                                                <li>Best Doctor Award - 2020</li>
                                                <li>Excellence in Patient Care - 2019</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="lg:w-[30%]">
                    <div className="bg-white rounded-lg p-4 space-y-4 sticky top-4">
                        <h3 className="text-lg font-semibold text-gray-800">Book Appointment</h3>
                        
                        <div className="space-y-2">
                            <p className="text-gray-600">Consultation Fee</p>
                            <p className="text-2xl font-semibold text-blue-600">₹799</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-gray-600">Available Time Slots</p>
                            <p className="text-gray-800">Mon - Sat</p>
                            <p className="text-gray-800">10:00 AM - 1:00 PM</p>
                        </div>

                        <button 
                            onClick={() => navigate('/booking')}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                        >
                            Book Appointment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorInfo