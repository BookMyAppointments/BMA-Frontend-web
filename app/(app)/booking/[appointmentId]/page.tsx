'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
    Check, CalendarDays, MapPin, Navigation, MessageCircle, Building2, SearchX,
} from 'lucide-react';
import { ButtonLink, Card, EmptyState, Skeleton, Tag } from '@/components/ui';
import { api, fetchAppointmentById } from '@/services/api';
import { formatDateTime, rupees } from '@/lib/domain';

interface PaymentInfo {
    id: string;
    amount: number;
    status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
    method: 'RAZORPAY' | 'PAY_AT_HOSPITAL';
}

export default function BookingConfirmationPage() {
    const params = useParams<{ appointmentId: string }>();
    const appointmentId = params?.appointmentId;

    const { data: appointment, isLoading, isError } = useQuery({
        queryKey: ['appointment', appointmentId],
        queryFn: () => fetchAppointmentById(appointmentId!),
        enabled: Boolean(appointmentId),
    });

    const { data: payment } = useQuery({
        queryKey: ['payment', appointmentId],
        queryFn: () => api<PaymentInfo | null>(`/payment/by-appointment/${appointmentId}`),
        enabled: Boolean(appointmentId),
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-32 w-full rounded-[18px]" />
                <Skeleton className="h-44 w-full rounded-[18px]" />
            </div>
        );
    }

    if (isError || !appointment) {
        return (
            <EmptyState
                icon={<SearchX size={24} />}
                title="Booking not found"
                action={<ButtonLink href="/appointments" variant="secondary">My appointments</ButtonLink>}
            />
        );
    }

    const doctor = appointment.doctor;
    const lab = appointment.lab;
    const test = appointment.test;
    // A doctor visit happens at the doctor's hospital; a lab test happens at the lab itself.
    const place = doctor ? doctor.hospital : lab;
    const reference = appointment.id.slice(0, 8).toUpperCase();

    return (
        <div className="space-y-5">
            {/* Confirmation, stated plainly */}
            <div className="text-center pt-4 pb-2">
                <span className="inline-grid place-items-center size-16 rounded-full bg-success-100 text-success-500">
                    <Check size={30} strokeWidth={3} />
                </span>
                <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">
                    You&rsquo;re booked
                </h1>
                <p className="mt-1.5 text-ink-3">
                    Booking reference <span className="font-bold text-ink-2 tabular">{reference}</span>
                </p>
            </div>

            <Card className="p-4 flex items-start gap-3 border-brand-100 bg-brand-50">
                <MessageCircle size={19} className="text-brand-600 shrink-0 mt-0.5" />
                <p className="text-sm text-ink-2">
                    A confirmation with the address and time is on its way to your WhatsApp.
                </p>
            </Card>

            <Card className="p-4 sm:p-5">
                <dl className="space-y-4">
                    {doctor && (
                        <div>
                            <dt className="text-sm text-ink-3">Doctor</dt>
                            <dd className="font-bold text-ink">{doctor.name}</dd>
                            <dd className="text-sm text-ink-3">{doctor.specialization?.join(', ')}</dd>
                        </div>
                    )}

                    {test && (
                        <div>
                            <dt className="text-sm text-ink-3">Test</dt>
                            <dd className="font-bold text-ink">{test.name}</dd>
                        </div>
                    )}

                    <div className="flex items-start gap-2.5">
                        <CalendarDays size={17} className="text-brand-500 shrink-0 mt-0.5" />
                        <div>
                            <dt className="text-sm text-ink-3">When</dt>
                            <dd className="font-bold text-ink">
                                {formatDateTime(new Date(appointment.scheduledAt))}
                            </dd>
                        </div>
                    </div>

                    {place && (
                        <div className="flex items-start gap-2.5">
                            <MapPin size={17} className="text-brand-500 shrink-0 mt-0.5" />
                            <div className="min-w-0">
                                <dt className="text-sm text-ink-3">Where</dt>
                                <dd className="font-bold text-ink">{place.name}</dd>
                                {place.location?.address && (
                                    <dd className="text-sm text-ink-3">{place.location.address}</dd>
                                )}
                            </div>
                        </div>
                    )}

                    {payment && (
                        <div className="flex items-start gap-2.5 pt-4 border-t border-line">
                            <Building2 size={17} className="text-brand-500 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <dt className="text-sm text-ink-3">Payment</dt>
                                <dd className="flex items-center gap-2 font-bold text-ink tabular">
                                    {rupees(payment.amount)}
                                    {payment.status === 'PAID' ? (
                                        <Tag tone="success">Paid</Tag>
                                    ) : (
                                        <Tag tone="warning">Pay at reception</Tag>
                                    )}
                                </dd>
                            </div>
                        </div>
                    )}
                </dl>

                {place?.location && (
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${place.location.lat},${place.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 w-full h-12 inline-flex items-center justify-center gap-2 rounded-[12px] border border-line-strong font-semibold text-ink hover:border-brand-300"
                    >
                        <Navigation size={17} className="text-brand-500" />
                        Get directions
                    </a>
                )}
            </Card>

            <div className="grid grid-cols-2 gap-3">
                <ButtonLink href="/appointments" variant="secondary" fullWidth>
                    My appointments
                </ButtonLink>
                <ButtonLink href="/home" fullWidth>
                    Done
                </ButtonLink>
            </div>
        </div>
    );
}
