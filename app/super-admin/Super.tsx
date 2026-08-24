'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, ShieldCheck, CheckCircle, XCircle, Building2, FlaskConical, Ban, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import UserSearchBox from '@/components/miscellaneous/makeAdmin';
import Link from 'next/link';
import { api, ApiError } from '@/services/api';
import { Tag } from '@/components/ui';

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
        location: { address: string };
    } | null;
    lab: {
        id: string;
        name: string;
        services: string[];
        hospital: { id: string; name: string } | null;
        location: { address: string };
    } | null;
}

interface RosterHospital {
    id: string;
    name: string;
    status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE' | 'DELETED';
    location: { address: string } | null;
    admin: { name: string; email: string; phone: string | null } | null;
    _count: { doctors: number; labs: number };
}

interface RosterLab {
    id: string;
    name: string;
    status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE' | 'DELETED';
    location: { address: string } | null;
    hospital: { id: string; name: string } | null;
    admin: { name: string; email: string; phone: string | null } | null;
    _count: { tests: number };
}

const STATUS_TONE = {
    ACTIVE: 'success',
    PENDING: 'warning',
    SUSPENDED: 'danger',
    INACTIVE: 'neutral',
    DELETED: 'neutral',
} as const;

type Tab = 'requests' | 'hospitals' | 'labs';

export default function Super() {
    const [loading, setLoading] = useState(true);
    const [superAdmin, setSuperAdmin] = useState<boolean>(true);
    const [tab, setTab] = useState<Tab>('requests');

    const [requests, setRequests] = useState<AdminRequest[]>([]);
    const [hospitals, setHospitals] = useState<RosterHospital[] | null>(null);
    const [labs, setLabs] = useState<RosterLab[] | null>(null);

    const fetchRequests = useCallback(async () => {
        try {
            const data = await api<AdminRequest[]>('/admin/get-all-requests');
            setRequests(data.filter((r) => r.hospital !== null || r.lab !== null));
        } catch (error) {
            toast.error(error instanceof ApiError ? error.message : 'Failed to fetch requests');
        }
    }, []);

    const fetchHospitals = useCallback(async () => {
        try {
            setHospitals(await api<RosterHospital[]>('/hospitals/admin/all'));
        } catch (error) {
            toast.error(error instanceof ApiError ? error.message : 'Failed to fetch hospitals');
        }
    }, []);

    const fetchLabs = useCallback(async () => {
        try {
            setLabs(await api<RosterLab[]>('/labs/admin/all'));
        } catch (error) {
            toast.error(error instanceof ApiError ? error.message : 'Failed to fetch labs');
        }
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await api<{ role: string }>('/auth/profile');
                if (data.role !== 'SUPERADMIN') {
                    setSuperAdmin(false);
                    window.location.href = '/';
                    return;
                }
                setSuperAdmin(true);
                await Promise.all([fetchRequests(), fetchHospitals(), fetchLabs()]);
            } catch (error) {
                toast.error(error instanceof ApiError ? error.message : 'Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [fetchRequests, fetchHospitals, fetchLabs]);

    const handleRequestAction = async (requestId: string, action: 'ACTIVE' | 'SUSPENDED') => {
        try {
            await api('/admin/update-status', { method: 'PUT', body: { requestId, status: action } });
            setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: action } : r)));
            toast.success(action === 'ACTIVE' ? 'Approved' : 'Rejected');
            // Approving changes the underlying hospital/lab's status too.
            if (action === 'ACTIVE') {
                fetchHospitals();
                fetchLabs();
            }
        } catch (error) {
            toast.error(error instanceof ApiError ? error.message : 'Could not update the request');
        }
    };

    const toggleHospital = async (id: string, next: 'ACTIVE' | 'SUSPENDED') => {
        try {
            await api(`/hospitals/suspend?id=${id}`, { method: 'PUT', body: { status: next } });
            setHospitals((prev) => prev?.map((h) => (h.id === id ? { ...h, status: next } : h)) ?? null);
            toast.success(next === 'SUSPENDED' ? 'Hospital suspended' : 'Hospital reactivated');
        } catch (error) {
            toast.error(error instanceof ApiError ? error.message : 'Could not update the hospital');
        }
    };

    const toggleLab = async (id: string, next: 'ACTIVE' | 'SUSPENDED') => {
        try {
            await api(`/labs/suspend?id=${id}`, { method: 'PUT', body: { status: next } });
            setLabs((prev) => prev?.map((l) => (l.id === id ? { ...l, status: next } : l)) ?? null);
            toast.success(next === 'SUSPENDED' ? 'Lab suspended' : 'Lab reactivated');
        } catch (error) {
            toast.error(error instanceof ApiError ? error.message : 'Could not update the lab');
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

    const pendingCount = requests.filter((r) => r.status === 'PENDING').length;

    return (
        <div className="bg-surface border border-line rounded-[16px] p-5">
            <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="text-brand-600" size={32} />
                <div>
                    <h1 className="font-display text-2xl font-extrabold text-ink">Super Admin Dashboard</h1>
                    <p className="text-ink-3">Manage access requests and permissions</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
                <UserSearchBox />
                <Link href="/super-admin/banner-images" className="inline-flex items-center h-11 px-4 rounded-[12px] border border-line-strong font-semibold text-ink hover:border-brand-300 transition-colors">
                    Banner Images
                </Link>
            </div>

            <div className="flex gap-1 mb-5 border-b border-line">
                <TabButton active={tab === 'requests'} onClick={() => setTab('requests')}>
                    Requests {pendingCount > 0 && <span className="ml-1 text-warning-500">({pendingCount})</span>}
                </TabButton>
                <TabButton active={tab === 'hospitals'} onClick={() => setTab('hospitals')}>
                    Hospitals {hospitals && <span className="ml-1 text-ink-4">({hospitals.length})</span>}
                </TabButton>
                <TabButton active={tab === 'labs'} onClick={() => setTab('labs')}>
                    Labs {labs && <span className="ml-1 text-ink-4">({labs.length})</span>}
                </TabButton>
            </div>

            {tab === 'requests' && (
                requests.length === 0 ? (
                    <div className="text-center py-12 bg-canvas rounded-[12px]">
                        <p className="text-ink-3">No pending requests found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-canvas">
                                <tr>
                                    <Th>Type</Th>
                                    <Th>User Email</Th>
                                    <Th>Name</Th>
                                    <Th>Location</Th>
                                    <Th>Status</Th>
                                    <Th>Expiry Date</Th>
                                    <Th>Actions</Th>
                                </tr>
                            </thead>
                            <tbody className="bg-surface divide-y divide-line">
                                {requests.map((request) => {
                                    const entity = request.hospital ?? request.lab;
                                    const isLab = Boolean(request.lab);
                                    return (
                                        <tr key={request.id}>
                                            <Td>
                                                <span className="inline-flex items-center gap-1.5 text-sm text-ink-2">
                                                    {isLab ? <FlaskConical size={14} /> : <Building2 size={14} />}
                                                    {isLab ? 'Lab' : 'Hospital'}
                                                </span>
                                            </Td>
                                            <Td><span className="text-sm font-semibold text-ink">{request.userEmail}</span></Td>
                                            <Td>
                                                <div className="text-sm font-semibold text-ink">{entity?.name}</div>
                                                <div className="text-sm text-ink-3">
                                                    {entity?.services.length || 0} services
                                                    {request.lab?.hospital && ` · under ${request.lab.hospital.name}`}
                                                </div>
                                            </Td>
                                            <Td><span className="text-sm text-ink">{entity?.location.address}</span></Td>
                                            <Td><Tag tone={STATUS_TONE[request.status]}>{request.status}</Tag></Td>
                                            <Td><span className="text-sm text-ink-3">{new Date(request.expiryTime).toLocaleDateString()}</span></Td>
                                            <Td>
                                                {request.status === 'PENDING' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleRequestAction(request.id, 'ACTIVE')}
                                                            className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-white bg-brand-500 hover:bg-brand-600"
                                                        >
                                                            <CheckCircle size={16} className="mr-1" />
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleRequestAction(request.id, 'SUSPENDED')}
                                                            className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-white bg-danger-500 hover:bg-danger-600"
                                                        >
                                                            <XCircle size={16} className="mr-1" />
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </Td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )
            )}

            {tab === 'hospitals' && (
                !hospitals ? (
                    <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand-500" size={24} /></div>
                ) : hospitals.length === 0 ? (
                    <div className="text-center py-12 bg-canvas rounded-[12px]"><p className="text-ink-3">No hospitals yet.</p></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-canvas">
                                <tr>
                                    <Th>Hospital</Th>
                                    <Th>Location</Th>
                                    <Th>Admin</Th>
                                    <Th>Doctors / Labs</Th>
                                    <Th>Status</Th>
                                    <Th>Actions</Th>
                                </tr>
                            </thead>
                            <tbody className="bg-surface divide-y divide-line">
                                {hospitals.map((hospital) => (
                                    <tr key={hospital.id}>
                                        <Td><span className="text-sm font-semibold text-ink">{hospital.name}</span></Td>
                                        <Td><span className="text-sm text-ink-3">{hospital.location?.address ?? '—'}</span></Td>
                                        <Td>
                                            {hospital.admin ? (
                                                <div>
                                                    <div className="text-sm text-ink">{hospital.admin.name}</div>
                                                    <div className="text-sm text-ink-3">{hospital.admin.email}</div>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-ink-4">Unassigned</span>
                                            )}
                                        </Td>
                                        <Td><span className="text-sm text-ink-3 tabular">{hospital._count.doctors} / {hospital._count.labs}</span></Td>
                                        <Td><Tag tone={STATUS_TONE[hospital.status]}>{hospital.status}</Tag></Td>
                                        <Td>
                                            {hospital.status === 'SUSPENDED' ? (
                                                <button
                                                    onClick={() => toggleHospital(hospital.id, 'ACTIVE')}
                                                    className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-white bg-brand-500 hover:bg-brand-600"
                                                >
                                                    <RotateCcw size={14} className="mr-1" />
                                                    Reactivate
                                                </button>
                                            ) : hospital.status === 'ACTIVE' ? (
                                                <button
                                                    onClick={() => toggleHospital(hospital.id, 'SUSPENDED')}
                                                    className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-white bg-danger-500 hover:bg-danger-600"
                                                >
                                                    <Ban size={14} className="mr-1" />
                                                    Suspend
                                                </button>
                                            ) : (
                                                <span className="text-sm text-ink-4">Awaiting approval</span>
                                            )}
                                        </Td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}

            {tab === 'labs' && (
                !labs ? (
                    <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand-500" size={24} /></div>
                ) : labs.length === 0 ? (
                    <div className="text-center py-12 bg-canvas rounded-[12px]"><p className="text-ink-3">No labs yet.</p></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-canvas">
                                <tr>
                                    <Th>Lab</Th>
                                    <Th>Location</Th>
                                    <Th>Hospital</Th>
                                    <Th>Admin</Th>
                                    <Th>Tests</Th>
                                    <Th>Status</Th>
                                    <Th>Actions</Th>
                                </tr>
                            </thead>
                            <tbody className="bg-surface divide-y divide-line">
                                {labs.map((lab) => (
                                    <tr key={lab.id}>
                                        <Td><span className="text-sm font-semibold text-ink">{lab.name}</span></Td>
                                        <Td><span className="text-sm text-ink-3">{lab.location?.address ?? '—'}</span></Td>
                                        <Td><span className="text-sm text-ink-3">{lab.hospital?.name ?? 'Standalone'}</span></Td>
                                        <Td>
                                            {lab.admin ? (
                                                <div>
                                                    <div className="text-sm text-ink">{lab.admin.name}</div>
                                                    <div className="text-sm text-ink-3">{lab.admin.email}</div>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-ink-4">Unassigned</span>
                                            )}
                                        </Td>
                                        <Td><span className="text-sm text-ink-3 tabular">{lab._count.tests}</span></Td>
                                        <Td><Tag tone={STATUS_TONE[lab.status]}>{lab.status}</Tag></Td>
                                        <Td>
                                            {lab.status === 'SUSPENDED' ? (
                                                <button
                                                    onClick={() => toggleLab(lab.id, 'ACTIVE')}
                                                    className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-white bg-brand-500 hover:bg-brand-600"
                                                >
                                                    <RotateCcw size={14} className="mr-1" />
                                                    Reactivate
                                                </button>
                                            ) : lab.status === 'ACTIVE' ? (
                                                <button
                                                    onClick={() => toggleLab(lab.id, 'SUSPENDED')}
                                                    className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-white bg-danger-500 hover:bg-danger-600"
                                                >
                                                    <Ban size={14} className="mr-1" />
                                                    Suspend
                                                </button>
                                            ) : (
                                                <span className="text-sm text-ink-4">Awaiting approval</span>
                                            )}
                                        </Td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </div>
    );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                active ? 'border-brand-500 text-brand-600' : 'border-transparent text-ink-3 hover:text-ink'
            }`}
        >
            {children}
        </button>
    );
}

function Th({ children }: { children: React.ReactNode }) {
    return <th className="px-4 py-3 text-left text-xs font-bold text-ink-3 uppercase tracking-wide">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
    return <td className="px-4 py-4 whitespace-nowrap">{children}</td>;
}
