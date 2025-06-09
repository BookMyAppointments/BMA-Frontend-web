import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import MobileNavbar from '../../components/Navbar/MobileNavbar';
import Footer from '../../components/Footer/Footer';
import { fetchDoctorsByHospitalId, type DoctorHospitalData } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import BookingForm from '../../components/BookingForm/BookingForm';

const EmergencyBooking: FC = () => {
    const { hospitalId } = useParams<{ hospitalId: string }>();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorHospitalData | null>(null);

    const { data: doctors, isLoading, error } = useQuery<DoctorHospitalData[]>({ 
        queryKey: ['hospitalDoctors', hospitalId],
        queryFn: () => fetchDoctorsByHospitalId(hospitalId || ''),
        enabled: !!hospitalId && !selectedDoctor,
    });

    const filteredDoctors = doctors?.filter(doc =>
        doc.doctor.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.doctor.specialization.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    const handleDoctorClick = (docData: DoctorHospitalData) => {
        setSelectedDoctor(docData);
    };

    if (isLoading) {
        return (
            <div className="w-full p-3 lg:p-6 flex justify-center items-center min-h-[200px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading Doctors...</p>
                </div>
            </div>
        );
    }

    if (error) {
        toast.error("Failed to fetch doctors for this hospital.");
        return (
            <div className="w-full p-3 lg:p-6 flex justify-center items-center min-h-[200px]">
                <div className="text-center">
                    <p className="text-red-600">Failed to fetch doctors. Please try again.</p>
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
        <div className="min-h-screen flex flex-col">
            <div className="hidden lg:block">
                <Navbar />
            </div>
            <div className="block lg:hidden sticky top-0 z-30 bg-white">
                <MobileNavbar />
            </div>
            
            <main className="flex-1 w-full p-4 lg:p-6">
                {!selectedDoctor ? (
                    <div className="space-y-6">
                        <div className="mb-6">
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Doctors at {doctors?.[0]?.hospital?.name || 'Selected Hospital'}</h2>
                            <p className="text-gray-600 text-sm lg:text-base">Find a doctor for your emergency needs</p>
                        </div>

                        <div className="relative mb-6">
                            <input
                                type="text"
                                placeholder="Search doctors by name or specialization"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredDoctors.length === 0 ? (
                                <div className="text-center py-8 text-gray-600 col-span-full">
                                    No doctors found for this hospital.
                                </div>
                            ) : (
                                filteredDoctors.map((docData) => (
                                    <div 
                                        key={docData.doctor.id} 
                                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:border-blue-300 transition-colors"
                                        onClick={() => handleDoctorClick(docData)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={docData.doctor.user.profile || '/profile-placeholder.png'} 
                                                alt={docData.doctor.user.name} 
                                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-800 text-lg">Dr. {docData.doctor.user.name}</h3>
                                                <p className="text-blue-600 text-sm">{docData.doctor.specialization.join(', ')}</p>
                                                <div className="flex items-center gap-1 text-yellow-500 text-xs mt-1">
                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="text-gray-600">{docData.doctor.ratings} ({docData.doctor.noOfPatients})</span>
                                                </div>
                                                <p className="text-gray-700 text-sm mt-1">Price: ₹{docData.doctor.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <button
                                onClick={() => setSelectedDoctor(null)}
                                className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                                Back to Doctors
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">
                                Book Appointment with Dr. {selectedDoctor.doctor.user.name}
                            </h1>
                        </div>
                        <BookingForm doctor={selectedDoctor} />
                    </div>
                )}
            </main>
            
            <Footer />
        </div>
    );
};

export default EmergencyBooking; 