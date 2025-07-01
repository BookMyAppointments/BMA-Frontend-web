'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Hospital } from './types';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
    const [hospital, setHospital] = useState<Hospital | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHospitalDetails = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hospitals/get-hospital-details`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setHospital(response.data);
                console.log('Hospital details fetched:', response.data);
                setLoading(false);
            } catch (err) {
                toast.error('Failed to fetch hospital details');
                console.error('Error fetching hospital details:', err);
                setLoading(false);
            }
        };

        fetchHospitalDetails();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className='flex items-center justify-between mb-6'>
                <h1 className="text-2xl font-bold mb-6">{hospital?.name}</h1>
                <Link href={`/admin/hospital/update/${hospital?.id}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Update Hospital Info
                </Link>

            </div>

            {/* Hospital Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                    <p>Location: {hospital?.location.address}</p>
                    <div>
                        <h3 className="font-medium mb-2">Hours:</h3>
                        {hospital?.hours && typeof hospital.hours === 'object' ? (
                            <div className="text-sm space-y-1">
                                {Object.entries(hospital.hours).map(([day, hours]) => (
                                    <div key={day} className="flex justify-between">
                                        <span className="capitalize font-medium">{day}:</span>
                                        <span>
                                            {typeof hours === 'object' && hours !== null ? (
                                                (hours as any).closed ? 'Closed' :
                                                    `${(hours as any).open || 'N/A'} - ${(hours as any).close || 'N/A'}`
                                            ) : (
                                                hours as string
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>{hospital?.hours}</p>
                        )}
                    </div>
                </div>

                {/* Departments, Facilities, Services */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Services & Facilities</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium">Departments</h3>
                            <ul className="list-disc pl-4">
                                {hospital?.departments.map((dept, index) => (
                                    <li key={index}>{dept}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium">Facilities</h3>
                            <ul className="list-disc pl-4">
                                {hospital?.facilities.map((facility, index) => (
                                    <li key={index}>{facility}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Doctors */}
            <div className="mb-8">
                <div className='flex items-center justify-between mb-4'>
                    <h2 className="text-xl font-semibold mb-4">Doctors</h2>
                    <Link href={`/admin/hospital/${hospital?.id}/doctors/create`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                        Create New Doctor
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {hospital?.doctors.map((doctor) => (
                        <Link href={`/admin/hospital/${hospital.id}/doctors/${doctor.id}`} key={doctor.id} className="bg-white p-4 rounded-lg shadow cursor-pointer">
                            <Image
                                width={100}
                                height={100}
                                src={doctor.picture}
                                alt={doctor.name}
                                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                            />
                            <h3 className="font-medium text-center">{doctor.name}</h3>
                            <p className="text-sm text-gray-600 text-center">{doctor.email}</p>
                            <p className="text-sm text-gray-600 text-center">{doctor.phone}</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Labs */}
            <div>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className="text-xl font-semibold mb-4">Laboratory Facilities</h2>
                    <Link href={`/admin/hospital/${hospital?.id}/labs/create`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                        Create New Lab
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {hospital?.labs.map((lab) => (
                        <Link href={`/admin/hospital/${hospital.id}/labs/${lab.id}`} key={lab.id} className="bg-white p-4 rounded-lg shadow cursor-pointer">
                            <Image
                                width={300}
                                height={200}
                                unoptimized
                                src={lab.picture || "/placeholder.png"}
                                alt={lab.name}
                                className="w-full h-40 object-cover rounded-lg mb-4"
                            />
                            <h3 className="font-medium">{lab.name}</h3>
                            <p className="text-sm text-gray-600">{lab.location.address}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}