'use client';

import { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import UserSearchBox from '@/components/miscellaneous/makeAdmin';
import Link from 'next/link';

interface AdminRequest {
    id: string;
    userEmail: string;
    expiryTime: string;
    status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
    hospital: {
        id: string;
        name: string;
        services: string[];
        departments: string[];
        facilities: string[];
        location: {
            lat: number;
            lng: number;
            address: string;
        };
    } | null;
}

export default function Super() {
    const [loading, setLoading] = useState(true);
    const [superAdmin, setSuperAdmin] = useState<boolean>(true);
    const [requests, setRequests] = useState<AdminRequest[]>([]); useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const data = await response.json();

                if (data.role != 'SUPERADMIN') {
                    setSuperAdmin(false);
                    window.location.href = '/';
                    return;
                }

                setSuperAdmin(true);

                await fetchRequests();
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        const fetchRequests = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/get-all-requests`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch requests');
                }

                const data = await response.json();
                const hospitalRequests = data.filter((request: AdminRequest) => request.hospital !== null);
                setRequests(hospitalRequests);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch requests';
                toast.error(errorMessage);
            }
        };

        fetchProfile();
    }, []);

    const handleRequestAction = async (requestId: string, action: 'ACTIVE' | 'SUSPENDED') => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/update-status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requestId,
                    status: action
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to ${action.toLowerCase()} request`);
            }

            // Update the local state
            setRequests(prev => prev.map(request =>
                request.id === requestId
                    ? { ...request, status: action }
                    : request
            ));

            toast.success(`Request ${action.toLowerCase()}d successfully`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Failed to ${action.toLowerCase()} request`;
            toast.error(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    if (!superAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600">You do not have super admin privileges.</p>
                    <Link href={'/'} className='text-blue-500 hover:text-blue-600 cursor-pointer'>Home Page</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg space-y-4 p-6 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <ShieldCheck className="text-blue-600" size={32} />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
                            <p className="text-gray-600">Manage access requests and permissions</p>
                        </div>
                    </div>

                    <UserSearchBox />
                    <Link href="/super-admin/banner-images" className="text-white hover:bg-blue-500 bg-blue-400 px-3 py-2 rounded-xl">
                        Banner Images
                    </Link>
                    {requests.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-600">No pending hospital requests found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {requests.map((request: AdminRequest) => (
                                        <tr key={request.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{request.userEmail}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{request.hospital?.name}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {request.hospital?.services.length || 0} services, {request.hospital?.departments.length || 0} departments
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{request.hospital?.location.address}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        request.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'}`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(request.expiryTime).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {request.status === 'PENDING' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleRequestAction(request.id, 'ACTIVE')}
                                                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                        >
                                                            <CheckCircle size={16} className="mr-1" />
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleRequestAction(request.id, 'SUSPENDED')}
                                                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        >
                                                            <XCircle size={16} className="mr-1" />
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}