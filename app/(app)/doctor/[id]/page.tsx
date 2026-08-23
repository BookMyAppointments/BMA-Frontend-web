'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Star, MapPin, GraduationCap, Users, SearchX, CalendarX } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { Button, Card, EmptyState, SectionHeader, Skeleton } from '@/components/ui';
import { api, fetchDoctorById } from '@/services/api';
import { formatDay, rupees } from '@/lib/domain';
import { cn } from '@/lib/utils';

interface Slot {
    dateTime: string;
    time: string;
    available: boolean;
}

/** Next 14 days, starting today. */
function upcomingDays(count = 14) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: count }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return date;
    });
}

const toDateParam = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export default function DoctorPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const doctorId = params?.id;

    const days = useMemo(() => upcomingDays(), []);
    const [selectedDate, setSelectedDate] = useState<Date>(days[0]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    useEffect(() => {
        setSelectedSlot(null);
    }, [selectedDate]);

    const { data: doctor, isLoading, isError } = useQuery({
        queryKey: ['doctor', doctorId],
        queryFn: () => fetchDoctorById(doctorId!),
        enabled: Boolean(doctorId),
    });

    const { data: availability, isLoading: slotsLoading } = useQuery({
        queryKey: ['availability', doctorId, toDateParam(selectedDate)],
        queryFn: () =>
            api<{ slots: Slot[]; message?: string }>(
                `/appointments/doctors/availability/${doctorId}?date=${toDateParam(selectedDate)}`,
                { auth: false }
            ),
        enabled: Boolean(doctorId),
    });

    // The API happily returns slots earlier today; nobody can book those.
    const slots = useMemo(() => {
        const all = availability?.slots ?? [];
        const cutoff = Date.now() + 15 * 60 * 1000;
        return all.filter((slot) => new Date(slot.dateTime).getTime() > cutoff);
    }, [availability]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-28 w-full rounded-[18px]" />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    if (isError || !doctor) {
        return <EmptyState icon={<SearchX size={24} />} title="Doctor not found" />;
    }

    return (
        <div className="space-y-6 pb-40">
            <Link
                href={doctor.hospitalId ? `/hospital/${doctor.hospitalId}` : '/home'}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-3 hover:text-ink"
            >
                <ArrowLeft size={16} />
                Back
            </Link>

            {/* Who you are seeing */}
            <Card className="p-4 sm:p-5">
                <div className="flex gap-4">
                    <ImageWithFallback
                        src={doctor.picture || '/doctors/doctor1.png'}
                        alt=""
                        width={96}
                        height={96}
                        unoptimized
                        className="size-24 rounded-[16px] object-cover bg-canvas shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-brand-600">
                            {doctor.specialization?.join(', ')}
                        </p>
                        <h1 className="mt-0.5 font-display text-2xl font-extrabold text-ink leading-tight">
                            {doctor.name}
                        </h1>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-3">
                            <GraduationCap size={14} className="shrink-0" />
                            {doctor.qualifications?.join(', ')}
                        </p>
                        {typeof doctor.ratings === 'number' && (
                            <div className="mt-2 flex items-center gap-3 text-sm">
                                <span className="inline-flex items-center gap-1 font-semibold text-ink-2">
                                    <Star size={14} className="fill-accent-500 text-accent-500" />
                                    <span className="tabular">{doctor.ratings.toFixed(1)}</span>
                                </span>
                                <span className="inline-flex items-center gap-1 text-ink-3">
                                    <Users size={14} />
                                    <span className="tabular">{doctor.noOfPatients}</span> patients
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {doctor.hospital && (
                    <Link
                        href={`/hospital/${doctor.hospital.id}`}
                        className="mt-4 flex items-start gap-2 pt-4 border-t border-line text-sm text-ink-3 hover:text-brand-600"
                    >
                        <MapPin size={15} className="shrink-0 mt-0.5" />
                        <span>
                            <span className="font-semibold text-ink-2">{doctor.hospital.name}</span>
                            {doctor.hospital.location?.address && <> · {doctor.hospital.location.address}</>}
                        </span>
                    </Link>
                )}
            </Card>

            {doctor.about && (
                <section>
                    <SectionHeader title="About" />
                    <p className="text-ink-2 leading-relaxed">{doctor.about}</p>
                </section>
            )}

            {/* Pick a day */}
            <section>
                <SectionHeader title="Pick a day" />
                <div className="rail flex gap-2 -mx-4 px-4">
                    {days.map((day) => {
                        const active = toDateParam(day) === toDateParam(selectedDate);
                        const isToday = toDateParam(day) === toDateParam(days[0]);
                        return (
                            <button
                                key={day.toISOString()}
                                type="button"
                                onClick={() => setSelectedDate(day)}
                                aria-pressed={active}
                                className={cn(
                                    'shrink-0 w-16 py-2.5 rounded-[14px] border text-center transition-colors',
                                    active
                                        ? 'bg-brand-500 border-brand-500 text-white'
                                        : 'bg-surface border-line text-ink-2 hover:border-brand-300'
                                )}
                            >
                                <span className="block text-[11px] font-semibold uppercase opacity-80">
                                    {isToday ? 'Today' : formatDay(day).split(',')[0]}
                                </span>
                                <span className="block text-lg font-bold tabular leading-tight">
                                    {day.getDate()}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Pick a time */}
            <section>
                <SectionHeader title="Pick a time" />
                {slotsLoading ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-12" />
                        ))}
                    </div>
                ) : slots.length === 0 ? (
                    <Card className="p-6">
                        <EmptyState
                            icon={<CalendarX size={22} />}
                            title="No slots on this day"
                            body={availability?.message ?? 'Try another day from the strip above.'}
                        />
                    </Card>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {slots.map((slot) => {
                            const active = selectedSlot === slot.dateTime;
                            return (
                                <button
                                    key={slot.dateTime}
                                    type="button"
                                    onClick={() => setSelectedSlot(slot.dateTime)}
                                    aria-pressed={active}
                                    className={cn(
                                        'h-12 rounded-[12px] border text-sm font-semibold tabular transition-colors',
                                        active
                                            ? 'bg-brand-500 border-brand-500 text-white'
                                            : 'bg-surface border-line text-ink-2 hover:border-brand-300'
                                    )}
                                >
                                    {new Date(slot.dateTime).toLocaleTimeString('en-IN', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                    })}
                                </button>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Sticky commit bar: fee is never a surprise at payment */}
            <div className="fixed bottom-16 inset-x-0 z-30 border-t border-line bg-surface/95 backdrop-blur pb-safe">
                <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
                    <div className="min-w-0">
                        <p className="text-[13px] text-ink-3">Consultation fee</p>
                        <p className="font-bold text-lg text-ink tabular leading-tight">
                            {rupees(doctor.price)}
                        </p>
                    </div>
                    <Button
                        className="flex-1"
                        size="lg"
                        disabled={!selectedSlot}
                        onClick={() =>
                            router.push(`/book/${doctor.id}?slot=${encodeURIComponent(selectedSlot!)}`)
                        }
                    >
                        {selectedSlot ? 'Continue' : 'Select a time'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
