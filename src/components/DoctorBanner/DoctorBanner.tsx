import type { FC } from 'react'
import { useState } from 'react'

interface DoctorBannerProps {
    doctorId: string | undefined;
}

const DoctorBanner: FC<DoctorBannerProps> = ({ doctorId }) => {
    const [doctorData] = useState({
        id: doctorId,
        name: 'Dr. James Deen Avora',
        image: '/doctors/doctor1.png',
        qualification: 'MBBS, MD. in Pulmonology',
        specialization: 'Pulmonologist',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...',
        rating: 4.6,
        patientsCount: '1200+',
        patientsHealed: '1200+',
        experience: '15+ years',
        hospital: 'Apollo Super Speciality Hospital',
        fee: '799',
        consultationFee: '₹500',
        availability: 'Mon - Sat, 10:00 AM - 1:00 PM'
    });

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="relative w-[97%] mx-auto h-[400px] sm:h-[320px] md:h-[320px] lg:h-[320px] bg-[#EEF4FF] rounded-lg py-4 px-4 sm:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto h-full">
                <div className="flex flex-col sm:flex-row h-full sm:items-center">
                    <div className="flex-1 sm:pr-[300px] lg:pr-[340px] z-10">
                        <span className="text-gray-500 text-sm">{doctorData.specialization}</span>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mt-1">
                            {doctorData.name}
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base mt-1">{doctorData.qualification}</p>
                        
                        <p className="text-gray-500 mt-2 sm:mt-4 text-xs sm:text-sm lg:text-base">
                            {isExpanded ? doctorData.description : `${doctorData.description.slice(0, 100)}...`}
                            <button 
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-blue-500 hover:text-blue-600 ml-1"
                            >
                                {isExpanded ? 'see less' : 'see more'}
                            </button>
                        </p>

                        <div className="text-lg sm:text-xl font-semibold text-blue-600 mt-2 sm:mt-4 mb-2 sm:mb-4">
                            ₹ {doctorData.fee}<span className="text-gray-500 text-xs sm:text-sm ml-1">/session</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <div className="bg-white rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 min-w-[90px] sm:min-w-[100px] text-center">
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-lg sm:text-xl font-semibold">{doctorData.rating}</span>
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <span className="text-gray-500 text-xs sm:text-sm">Rating</span>
                            </div>

                            <div className="bg-white rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 min-w-[90px] sm:min-w-[100px] text-center">
                                <div className="text-lg sm:text-xl font-semibold">{doctorData.patientsCount}</div>
                                <span className="text-gray-500 text-xs sm:text-sm">Patients treated</span>
                            </div>

                            <div className="bg-white rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 min-w-[90px] sm:min-w-[100px] text-center">
                                <div className="text-lg sm:text-xl font-semibold">{doctorData.patientsHealed}</div>
                                <span className="text-gray-500 text-xs sm:text-sm">Patients healed</span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute right-0 top-0 h-full w-full sm:w-[280px] lg:w-[320px] opacity-10 sm:opacity-100">
                        <img 
                            src={doctorData.image} 
                            alt={doctorData.name}
                            className="h-full w-full object-contain object-right"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorBanner