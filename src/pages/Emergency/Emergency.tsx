import { useState, useEffect, useMemo } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import MobileNavbar from '../../components/Navbar/MobileNavbar';
import Footer from '../../components/Footer/Footer';
import { fetchDoctors, type DoctorHospitalData } from '../../services/api';
import { useQuery } from '@tanstack/react-query';

interface HospitalData {
    id: string;
    name: string;
    logo: string;
    description: string;
    distance: string;
    isTopRated: boolean;
    departmentsCount: number;
    location: {
        lat: number;
        lng: number;
    }
}

const Emergency: FC = () => {
    const [userLocation, setUserLocation] = useState({ lat: 0, long: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [distances, setDistances] = useState<{[key: string]: string}>({});

    const { data, isLoading, error } = useQuery<DoctorHospitalData[]>({ 
        queryKey: ['emergencyHospitals'],
        queryFn: () => fetchDoctors(true)
    });

    useEffect(() => {
        const fetchLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    });
                }, (error) => {
                    console.error("Error fetching user location:", error);
                });
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        };
        fetchLocation();
    }, []);

    const transformedHospitals = useMemo(() => {
        if (!data) return [];
        const uniqueHospitalsMap = new Map<string, HospitalData>();

        data.forEach(item => {
            if (!uniqueHospitalsMap.has(item.hospital.id)) {
                uniqueHospitalsMap.set(item.hospital.id, {
                    id: item.hospital.id,
                    name: item.hospital.name,
                    logo: '/logos/default.png', 
                    description: `Located at ${item.hospital.location.address}`,
                    distance: 'Calculating...',
                    isTopRated: item.doctor.ratings >= 4, 
                    departmentsCount: item.hospital.departments.length,
                    location: item.hospital.location
                });
            }
        });
        return Array.from(uniqueHospitalsMap.values());
    }, [data]);

    useEffect(() => {
        if (!userLocation.lat || !userLocation.long || !transformedHospitals.length) return;

        const newDistances: {[key: string]: string} = {};
        transformedHospitals.forEach(hospital => {
            const distance = calculateDistance(
                userLocation.lat,
                userLocation.long,
                hospital.location.lat,
                hospital.location.lng
            );
            newDistances[hospital.id] = distance;
        });
        setDistances(newDistances);
    }, [userLocation, transformedHospitals]);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
        const R = 6371; 
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

    const filteredHospitals = transformedHospitals.filter(hospital =>
        hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(hospital => ({
        ...hospital,
        distance: distances[hospital.id] || 'Calculating...'
    }));

    if (isLoading) {
        return (
            <div className="w-full p-3 lg:p-6 flex justify-center items-center min-h-[200px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading Emergency Hospitals...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-3 lg:p-6 flex justify-center items-center min-h-[200px]">
                <div className="text-center">
                    <p className="text-red-600">Failed to fetch emergency hospitals. Please try again.</p>
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
                <div className="mb-6">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
                        Emergency Services 
                        <span role="img" aria-label="ambulance">🚑</span>
                    </h2>
                    <p className="text-gray-600 text-sm lg:text-base">Quick access to emergency medical care</p>
                </div>

                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Search for hospitals"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {filteredHospitals.length === 0 ? (
                        <div className="text-center py-8 text-gray-600">
                            No emergency hospitals found.
                        </div>
                    ) : (
                        filteredHospitals.map((hospital) => (
                            <div key={hospital.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <div className="flex gap-3 items-start">
                                    <img src={hospital.logo} alt={hospital.name} className="w-16 h-16 object-contain" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">{hospital.name}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-2">{hospital.description}</p>
                                        
                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {hospital.distance}
                                            </div>
                                            {hospital.isTopRated && (
                                                <div className="flex items-center gap-1 text-amber-500 font-medium">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    Top Rated
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                                                </svg>
                                                {hospital.departmentsCount}+ Dep...
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Link 
                                    to={`/emergency-booking/${hospital.id}`} 
                                    className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-base"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6.75l-4.25 4.25M10 17.25l-4.25-4.25M17 12l-7 7-7-7" transform="rotate(90 12 12)"/>
                                    </svg>
                                    Reach Out
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Emergency;
