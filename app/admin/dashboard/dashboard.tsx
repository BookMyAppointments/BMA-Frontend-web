'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Hospital } from './types';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

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
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-500" size={32} />
            </div>
        );
    }

    return (
        <div>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <p className="text-sm font-semibold text-brand-600 uppercase tracking-wide">Admin Dashboard</p>
                    <h1 className="text-2xl font-bold">{hospital?.name}</h1>
                </div>
                <Link href={`/admin/hospital/update/${hospital?.id}`} className="inline-flex items-center h-11 px-4 rounded-[12px] bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors">
                    Update Hospital Info
                </Link>

            </div>

            {/* Hospital Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-surface border border-line p-5 rounded-[16px]">
                    <h2 className="text-lg font-bold text-ink mb-4">Basic Information</h2>
                    <p>Location: {hospital?.location.address}</p>
                    <div>
                        <h3 className="font-medium mb-2">Hours:</h3>
                        {hospital?.hours && typeof hospital.hours === 'object' ? (
                            <div className="text-sm space-y-1">
                                {Object.entries(hospital.hours)
                                    .sort(([a], [b]) => DAY_ORDER.indexOf(a.toLowerCase()) - DAY_ORDER.indexOf(b.toLowerCase()))
                                    .map(([day, hours]) => (
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
                <div className="bg-surface border border-line p-5 rounded-[16px]">
                    <h2 className="text-lg font-bold text-ink mb-4">Services & Facilities</h2>
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
                    <h2 className="text-lg font-bold text-ink mb-4">Doctors</h2>
                    <Link href={`/admin/hospital/${hospital?.id}/doctors/create`} className="inline-flex items-center h-11 px-4 rounded-[12px] bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors">
                        Create New Doctor
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {hospital?.doctors.map((doctor) => (
                        <div
                            key={doctor.id}
                            className="bg-surface border border-line p-4 rounded-[16px] flex flex-col items-center"
                        >
                            <Image
                                width={100}
                                height={100}
                                src={doctor.picture || '/placeholder.png'}
                                alt={doctor.name}
                                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                            />
                            <h3 className="font-medium text-center">{doctor.name}</h3>
                            <p className="text-sm text-ink-3 text-center">{doctor.email}</p>
                            <p className="text-sm text-ink-3 text-center">{doctor.phone}</p>
                            
                           <div className="flex gap-2 mt-4 w-full">
                              <Link
                                href={`/admin/hospital/${hospital.id}/doctors/${doctor.id}`}
                                className="flex-1 h-11 inline-flex items-center justify-center rounded-[12px] border border-line-strong text-ink font-semibold hover:border-brand-300 transition-colors"
                                onClick={e => e.stopPropagation()}
                            >
                                Edit
                            </Link>
                            <Link
                                href={`/admin/hospital/${hospital.id}/doctors/${doctor.id}/appointments`}
                                className="flex-1 h-11 inline-flex items-center justify-center rounded-[12px] bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors"
                                onClick={e => e.stopPropagation()}
                            >
                                View Appointments
                            </Link>
                           </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Labs */}
            <div>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className="text-lg font-bold text-ink mb-4">Laboratory Facilities</h2>
                    <Link href={`/admin/hospital/${hospital?.id}/labs/create`} className="inline-flex items-center h-11 px-4 rounded-[12px] bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors">
                        Create New Lab
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {hospital?.labs.map((lab) => (
                        <div key={lab.id} className="bg-surface border border-line p-4 rounded-[16px]">
                            <Image
                                width={300}
                                height={200}
                                unoptimized
                                src={lab.picture || "/placeholder.png"}
                                alt={lab.name}
                                className="w-full h-40 object-cover rounded-lg mb-4"
                            />
                            <h3 className="font-medium">{lab.name}</h3>
                            <p className="text-sm text-ink-3">{lab.location.address}</p>
                            <div className="flex gap-2 mt-4">
                                <Link
                                    href={`/admin/hospital/${hospital.id}/labs/${lab.id}`}
                                    className="flex-1 h-11 inline-flex items-center justify-center rounded-[12px] border border-line-strong text-ink font-semibold hover:border-brand-300 transition-colors"
                                >
                                    Edit
                                </Link>
                                <Link
                                    href={`/admin/hospital/${hospital.id}/labs/${lab.id}/bookings`}
                                    className="flex-1 h-11 inline-flex items-center justify-center rounded-[12px] bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors"
                                >
                                    Bookings
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}