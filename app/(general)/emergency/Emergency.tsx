'use client'
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/services/api';

interface Hospital {
    id: string;
    name: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    emergencyStatus: boolean;
    noOfEmergencyPatients: number;
    // Add other fields as needed
}

const Emergency = () => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        const fetchUserLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (err) => {
                    console.error('Error fetching location:', err);
                    setError('Unable to fetch your location. Please enable location services.');
                }
            );
        };

        fetchUserLocation();
    }, []);

    useEffect(() => {
        if (!userLocation) return;

        const fetchHospitals = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(
                    `${API_BASE_URL}/hospitals/get` 
                );

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data: Hospital[] = await res.json();

                const emergencyHospitals = data.filter(h => h.emergencyStatus);
                const sortedHospitals = emergencyHospitals.sort((a, b) => b.noOfEmergencyPatients - a.noOfEmergencyPatients);
                setHospitals(sortedHospitals);
            } catch (err) {
                console.error('Error fetching hospitals:', err);
                setError('Failed to fetch hospitals. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchHospitals();
    }, [userLocation]);

    if (loading) {
        return <div>Loading hospitals...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Emergency Hospitals Near You</h1>
            {hospitals.length === 0 ? (
                <p>No hospitals with emergency services found within the specified radius.</p>
            ) : (
                <ul className="space-y-4">
                    {hospitals.map((hospital) => (
                        <li key={hospital.id} className="p-4 border rounded shadow">
                            <h2 className="text-lg font-semibold">{hospital.name}</h2>
                            <p className="text-sm text-gray-600">{hospital.location.address}</p>
                            <p className="text-sm text-gray-600">
                                Distance: {/* Placeholder for distance calculation */} Calculating...
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Emergency;