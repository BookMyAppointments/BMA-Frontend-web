'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Building2, FlaskConical, Clock, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Card, EmptyState, ButtonLink, Skeleton } from '@/components/ui';
import { api } from '@/services/api';
import { useSession } from '@/context/sessionProvider';

interface OwnRequest {
    id: string;
    status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
    createdAt: string;
    hospital: { id: string; name: string } | null;
    lab: { id: string; name: string } | null;
}

const STATUS_DISPLAY = {
    PENDING: { label: 'Under review', icon: Clock, tone: 'text-warning-500 bg-warning-100' },
    ACTIVE: { label: 'Approved', icon: CheckCircle2, tone: 'text-success-500 bg-success-100' },
    // A rejected request is stored as SUSPENDED at the Request level -- distinct
    // from a hospital/lab that went live and was later suspended.
    SUSPENDED: { label: 'Not approved', icon: XCircle, tone: 'text-danger-500 bg-danger-100' },
} as const;

export default function RegistrationStatusPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: sessionLoading } = useSession();

    useEffect(() => {
        if (!sessionLoading && !isAuthenticated) router.replace('/auth?next=/register/status');
    }, [sessionLoading, isAuthenticated, router]);

    const { data: requests, isLoading } = useQuery({
        queryKey: ['my-requests'],
        queryFn: () => api<OwnRequest[]>('/admin/my-requests'),
        enabled: isAuthenticated,
        // Someone waiting on approval will likely have this tab open; keep it fresh.
        refetchInterval: 30_000,
    });

    return (
        <div className="min-h-screen bg-canvas flex flex-col">
            <header className="px-5 h-16 flex items-center">
                <Link href="/" className="inline-flex">
                    <Logo />
                </Link>
            </header>

            <main className="flex-1 flex items-start justify-center px-5 pb-16 pt-4 sm:pt-10">
                <div className="w-full max-w-lg">
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-3 hover:text-ink"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </Link>

                    <h1 className="mt-3 font-display text-2xl font-extrabold text-ink">
                        Your registrations
                    </h1>
                    <p className="mt-1.5 text-ink-3">
                        Status of every hospital or lab you&rsquo;ve submitted.
                    </p>

                    <div className="mt-6 space-y-3">
                        {isLoading || sessionLoading ? (
                            <>
                                <Skeleton className="h-20 w-full rounded-[16px]" />
                                <Skeleton className="h-20 w-full rounded-[16px]" />
                            </>
                        ) : !requests || requests.length === 0 ? (
                            <Card>
                                <EmptyState
                                    icon={<Building2 size={22} />}
                                    title="Nothing submitted yet"
                                    body="Register a hospital or lab and its review status will show up here."
                                    action={<ButtonLink href="/register">Register one</ButtonLink>}
                                />
                            </Card>
                        ) : (
                            requests.map((request) => {
                                const entity = request.hospital ?? request.lab;
                                const isLab = Boolean(request.lab);
                                const display = STATUS_DISPLAY[request.status];
                                const StatusIcon = display.icon;

                                return (
                                    <Card key={request.id} className="p-4 flex items-start gap-3.5">
                                        <span className="grid place-items-center size-11 rounded-full bg-brand-50 text-brand-500 shrink-0">
                                            {isLab ? <FlaskConical size={19} /> : <Building2 size={19} />}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-ink truncate">{entity?.name ?? 'Untitled'}</p>
                                            <p className="text-sm text-ink-3">
                                                {isLab ? 'Lab' : 'Hospital'} · Submitted{' '}
                                                {new Date(request.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                            {request.status === 'ACTIVE' && (
                                                <p className="mt-1.5 text-sm text-success-500">
                                                    You can manage it from your profile menu now.
                                                </p>
                                            )}
                                            {request.status === 'SUSPENDED' && (
                                                <p className="mt-1.5 text-sm text-ink-3">
                                                    Contact support if you think this is a mistake.
                                                </p>
                                            )}
                                        </div>
                                        <span className={`shrink-0 inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-xs font-bold ${display.tone}`}>
                                            <StatusIcon size={13} />
                                            {display.label}
                                        </span>
                                    </Card>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
