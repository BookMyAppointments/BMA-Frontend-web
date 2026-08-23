'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { ArrowLeft, Loader2, Phone, Mail, CalendarX } from 'lucide-react';
import { Card, EmptyState, Tag } from '@/components/ui';
import { api, ApiError } from '@/services/api';
import { formatDateTime, rupees } from '@/lib/domain';

interface LabBooking {
    id: string;
    scheduledAt: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
    user: { id: string; name: string; email: string; phone: string | null };
    test: { id: string; name: string; price: number } | null;
}

const STATUS_TONE = {
    PENDING: 'warning',
    CONFIRMED: 'success',
    COMPLETED: 'neutral',
    CANCELLED: 'danger',
    RESCHEDULED: 'warning',
} as const;

export default function LabBookingsPage() {
    const params = useParams<{ hospitalId: string; id: string }>();
    const [bookings, setBookings] = useState<LabBooking[] | null>(null);

    useEffect(() => {
        if (!params?.id) return;
        api<{ appointments: LabBooking[] }>(`/labs/${params.id}/appointments`)
            .then((data) => setBookings(data.appointments))
            .catch((error) => {
                toast.error(error instanceof ApiError ? error.message : 'Could not load bookings.');
                setBookings([]);
            });
    }, [params?.id]);

    return (
        <div>
            <Link
                href={`/admin/hospital/${params?.hospitalId}/labs/${params?.id}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-3 hover:text-ink"
            >
                <ArrowLeft size={16} />
                Back to lab
            </Link>

            <h1 className="mt-3 font-display text-2xl font-extrabold text-ink">Lab bookings</h1>

            {bookings === null ? (
                <div className="mt-10 flex justify-center">
                    <Loader2 className="animate-spin text-brand-500" size={28} />
                </div>
            ) : bookings.length === 0 ? (
                <Card className="mt-6">
                    <EmptyState
                        icon={<CalendarX size={22} />}
                        title="No bookings yet"
                        body="Test bookings for this lab will show up here."
                    />
                </Card>
            ) : (
                <div className="mt-6 space-y-3">
                    {bookings.map((booking) => (
                        <Card key={booking.id} className="p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h3 className="font-bold text-ink leading-tight">
                                        {booking.test?.name ?? 'Test'}
                                    </h3>
                                    <p className="text-sm text-ink-3">{booking.user.name}</p>
                                </div>
                                <Tag tone={STATUS_TONE[booking.status]}>{booking.status.toLowerCase()}</Tag>
                            </div>

                            <div className="mt-3 pt-3 border-t border-line flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-2">
                                <span>{formatDateTime(new Date(booking.scheduledAt))}</span>
                                {booking.test && (
                                    <span className="font-semibold tabular">{rupees(booking.test.price)}</span>
                                )}
                                {booking.user.phone && (
                                    <a
                                        href={`tel:${booking.user.phone}`}
                                        className="inline-flex items-center gap-1.5 text-brand-600 font-semibold"
                                    >
                                        <Phone size={13} />
                                        {booking.user.phone}
                                    </a>
                                )}
                                {!booking.user.email.endsWith('@phone.bookmyappointments.local') && (
                                    <a
                                        href={`mailto:${booking.user.email}`}
                                        className="inline-flex items-center gap-1.5 text-ink-3 truncate"
                                    >
                                        <Mail size={13} />
                                        {booking.user.email}
                                    </a>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
