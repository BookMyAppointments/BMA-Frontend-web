'use client';

import { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

interface Request {
    id: string;
    userEmail: string;
    type: string;
    status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
    expiryTime : Date;
}

interface SuperAdmin {
    id: string;
    name: string;
    email: string;
    requests: Request[];
}

export default function Super() {
    const [loading, setLoading] = useState(true);
    const [superAdmin, setSuperAdmin] = useState<SuperAdmin | null>(null);

    useEffect(() => {
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
                console.log('Super Admin Data:', data);
                setSuperAdmin(data);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleRequestAction = async (requestId: string, action: 'ACTIVE' | 'SUSPENDED') => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/requests/${requestId}/${action}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to ${action} request`);
            }

            setSuperAdmin(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    requests: prev.requests.map(req => 
                        req.id === requestId 
                            ? { ...req, status: action === 'ACTIVE' ? 'ACTIVE' : 'SUSPENDED' }
                            : req
                    )
                };
            });

            toast.success(`Request ${action}d successfully`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Failed to ${action} request`;
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
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <ShieldCheck className="text-blue-600" size={32} />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
                            <p className="text-gray-600">Manage access requests and permissions</p>
                        </div>
                    </div>

                    {superAdmin.requests.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-600">No pending requests found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {superAdmin.requests.map((request) => (
                                        <tr key={request.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{request?.userEmail}</div>
                                                </div>
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
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            <CheckCircle size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRequestAction(request.id, 'SUSPENDED')}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <XCircle size={20} />
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