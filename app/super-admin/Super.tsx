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
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-600" size={32} />
            </div>
        );
    }

    if (!superAdmin) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-ink-3">You do not have super admin privileges.</p>
                    <Link href={'/'} className='text-brand-500 hover:text-brand-600 cursor-pointer'>Home Page</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="">
            <div>
                <div className="bg-surface border border-line rounded-[16px] space-y-4 p-5 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <ShieldCheck className="text-brand-600" size={32} />
                        <div>
                            <h1 className="font-display text-2xl font-extrabold text-ink">Super Admin Dashboard</h1>
                            <p className="text-ink-3">Manage access requests and permissions</p>
                        </div>
                    </div>

                    <UserSearchBox />
                    <Link href="/super-admin/banner-images" className="inline-flex items-center h-11 px-4 rounded-[12px] border border-line-strong font-semibold text-ink hover:border-brand-300 transition-colors">
                        Banner Images
                    </Link>
                    {requests.length === 0 ? (
                        <div className="text-center py-12 bg-canvas rounded-[12px]">
                            <p className="text-ink-3">No pending hospital requests found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-canvas">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-ink-3 uppercase tracking-wide">User Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-ink-3 uppercase tracking-wide">Hospital Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-ink-3 uppercase tracking-wide">Location</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-ink-3 uppercase tracking-wide">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-ink-3 uppercase tracking-wide">Expiry Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-ink-3 uppercase tracking-wide">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-surface divide-y divide-line">
                                    {requests.map((request: AdminRequest) => (
                                        <tr key={request.id}>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-ink">{request.userEmail}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-semibold text-ink">{request.hospital?.name}</div>
                                                    <div className="text-sm text-ink-3">
                                                        {request.hospital?.services.length || 0} services, {request.hospital?.departments.length || 0} departments
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm text-ink">{request.hospital?.location.address}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        request.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'}`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-ink-3">
                                                {new Date(request.expiryTime).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                {request.status === 'PENDING' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleRequestAction(request.id, 'ACTIVE')}
                                                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                                                        >
                                                            <CheckCircle size={16} className="mr-1" />
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleRequestAction(request.id, 'SUSPENDED')}
                                                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-danger-500 hover:bg-danger-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500"
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