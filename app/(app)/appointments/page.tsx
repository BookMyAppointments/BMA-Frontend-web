'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQueries, useQuery } from '@tanstack/react-query';
import { CalendarDays, MapPin, Bell, CalendarX, ChevronRight, Clock } from 'lucide-react';
import { ButtonLink, Card, Chip, EmptyState, SectionHeader, Skeleton, Tag } from '@/components/ui';
import { api, fetchAppointmentsByStatus } from '@/services/api';
import { formatDateTime, rupees } from '@/lib/domain';
import type { Appointment } from '@/types/doctor';

const UPCOMING = ['PENDING', 'CONFIRMED', 'RESCHEDULED'] as const;
const PAST = ['COMPLETED', 'CANCELLED'] as const;

interface Reminder {
    id: string;
    title?: string;
    message?: string;
    medicineName?: string;
    time?: string;
    startDate?: string;
    frequency?: string;
}

export default function AppointmentsPage() {
    const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
    const statuses = tab === 'upcoming' ? UPCOMING : PAST;

    const results = useQueries({
        queries: statuses.map((status) => ({
            queryKey: ['appointments', status],
            queryFn: () => fetchAppointmentsByStatus(status),
        })),
    });

    const isLoading = results.some((r) => r.isLoading);
    const appointments = useMemo(() => {
        const all = results.flatMap((r) => r.data ?? []) as Appointment[];
        return all.sort(
            (a, b) =>
                new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
        );
    }, [results]);

    const { data: reminders } = useQuery({
        queryKey: ['reminders'],
        queryFn: () => api<Reminder[]>('/remainders/get'),
        retry: false,
    });

    return (
        <div className="space-y-6">
            <h1 className="font-display text-2xl font-extrabold text-ink">
                Appointments &amp; reminders
            </h1>

            <div className="flex gap-2">
                <Chip active={tab === 'upcoming'} onClick={() => setTab('upcoming')}>
                    Upcoming
                </Chip>
                <Chip active={tab === 'past'} onClick={() => setTab('past')}>
                    Past
                </Chip>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[0, 1].map((i) => (
                        <Skeleton key={i} className="h-28 w-full rounded-[16px]" />
                    ))}
                </div>
            ) : appointments.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={<CalendarX size={24} />}
                        title={tab === 'upcoming' ? 'Nothing booked yet' : 'No past appointments'}
                        body={
                            tab === 'upcoming'
                                ? 'When you book a doctor or a lab test, it shows up here.'
                                : 'Completed and cancelled bookings will appear here.'
                        }
                        action={
                            tab === 'upcoming' ? (
                                <ButtonLink href="/home">Find a doctor</ButtonLink>
                            ) : undefined
                        }
                    />
                </Card>
            ) : (
                <div className="space-y-3">
                    {appointments.map((appointment) => (
                        <AppointmentRow key={appointment.id} appointment={appointment} />
                    ))}
                </div>
            )}

            <section>
                <SectionHeader title="Medicine reminders" />
                {!reminders || reminders.length === 0 ? (
                    <Card className="p-4 flex items-center gap-3">
                        <Bell size={18} className="text-ink-4 shrink-0" />
                        <p className="text-sm text-ink-3">
                            No reminders set. Your doctor can add these after a consultation.
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-2.5">
                        {reminders.map((reminder) => (
                            <Card key={reminder.id} className="p-4 flex items-center gap-3">
                                <span className="grid place-items-center size-10 rounded-full bg-brand-50 text-brand-500 shrink-0">
                                    <Bell size={18} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-ink truncate">
                                        {reminder.medicineName || reminder.title || 'Reminder'}
                                    </p>
                                    <p className="text-sm text-ink-3 truncate">
                                        {[reminder.frequency, reminder.time].filter(Boolean).join(' · ') ||
                                            reminder.message}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

function AppointmentRow({ appointment }: { appointment: Appointment }) {
    const when = new Date(appointment.scheduledAt);
    const doctor = appointment.doctor;
    const isDoctorVisit = Boolean(doctor);
    const title = isDoctorVisit ? doctor?.name : appointment.test?.name ?? 'Lab test';
    const place = isDoctorVisit ? doctor?.hospital?.name : appointment.lab?.name;

    const tone =
        appointment.status === 'CONFIRMED'
            ? 'success'
            : appointment.status === 'CANCELLED'
              ? 'danger'
              : appointment.status === 'COMPLETED'
                ? 'neutral'
                : 'warning';

    return (
        <Link
            href={`/booking/${appointment.id}`}
            className="block rounded-[16px] border border-line bg-surface p-4 hover:border-brand-300 transition-colors"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="font-bold text-ink leading-tight truncate">{title}</h3>
                    {place && <p className="text-sm text-ink-3 truncate">{place}</p>}
                </div>
                <Tag tone={tone as 'success' | 'danger' | 'neutral' | 'warning'}>
                    {appointment.status.toLowerCase()}
                </Tag>
            </div>

            <div className="mt-3 pt-3 border-t border-line flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-sm text-ink-2">
                    <Clock size={14} className="text-brand-500" />
                    {formatDateTime(when)}
                </span>
                <ChevronRight size={16} className="text-ink-4 shrink-0" />
            </div>
        </Link>
    );
}
