'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin, SearchX, CalendarX, Home, FlaskConical } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { Button, Card, EmptyState, SectionHeader, Skeleton, Tag } from '@/components/ui';
import { api } from '@/services/api';
import { formatDay, rupees } from '@/lib/domain';
import { cn } from '@/lib/utils';

interface LabTest {
    id: string;
    name: string;
    category?: string | null;
    price: number;
    homeSample?: boolean;
}

interface LabDetail {
    id: string;
    name: string;
    picture?: string | null;
    banner?: string | null;
    description?: string | null;
    address?: string | null;
    location?: { lat: number; lng: number; address: string } | null;
    hospital?: { id: string; name: string } | null;
    tests: LabTest[];
}

interface Slot {
    dateTime: string;
    time: string;
    available: boolean;
}

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

export default function LabPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const labId = params?.id;

    const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);

    const days = useMemo(() => upcomingDays(), []);
    const [selectedDate, setSelectedDate] = useState<Date>(days[0]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    useEffect(() => {
        setSelectedSlot(null);
    }, [selectedDate, selectedTest]);

    const { data: lab, isLoading, isError } = useQuery({
        queryKey: ['lab', labId],
        queryFn: () => api<LabDetail>(`/labs/get/${labId}`, { auth: false }),
        enabled: Boolean(labId),
    });

    const { data: availability, isLoading: slotsLoading } = useQuery({
        queryKey: ['lab-availability', labId, toDateParam(selectedDate)],
        queryFn: () =>
            api<{ slots: Slot[]; message?: string }>(
                `/appointments/labs/availability/${labId}?date=${toDateParam(selectedDate)}`,
                { auth: false }
            ),
        enabled: Boolean(labId) && Boolean(selectedTest),
    });

    const slots = useMemo(() => {
        const all = availability?.slots ?? [];
        const cutoff = Date.now() + 15 * 60 * 1000;
        return all.filter((slot) => new Date(slot.dateTime).getTime() > cutoff);
    }, [availability]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-32 w-full rounded-[18px]" />
                <Skeleton className="h-40 w-full rounded-[18px]" />
            </div>
        );
    }

    if (isError || !lab) {
        return <EmptyState icon={<SearchX size={24} />} title="Lab not found" />;
    }

    return (
        <div className="space-y-6 pb-40">
            <Link
                href="/labs"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-3 hover:text-ink"
            >
                <ArrowLeft size={16} />
                Back
            </Link>

            <Card className="p-4 sm:p-5">
                <div className="flex gap-3.5">
                    <ImageWithFallback
                        src={lab.picture || '/icons/lab-gray.png'}
                        alt=""
                        width={72}
                        height={72}
                        unoptimized
                        className="size-[72px] rounded-[14px] object-cover bg-canvas shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                        <h1 className="font-display text-xl font-extrabold text-ink leading-tight">
                            {lab.name}
                        </h1>
                        {(lab.location?.address || lab.address) && (
                            <p className="mt-1 flex items-start gap-1.5 text-sm text-ink-3">
                                <MapPin size={14} className="shrink-0 mt-0.5" />
                                {lab.location?.address ?? lab.address}
                            </p>
                        )}
                        {lab.hospital && (
                            <p className="mt-1 text-sm text-ink-3">
                                <Home size={13} className="inline mr-1 -mt-0.5" />
                                {lab.hospital.name}
                            </p>
                        )}
                    </div>
                </div>
                {lab.description && (
                    <p className="mt-4 pt-4 border-t border-line text-ink-2 leading-relaxed">
                        {lab.description}
                    </p>
                )}
            </Card>

            <section>
                <SectionHeader title="Choose a test" />
                {lab.tests.length === 0 ? (
                    <Card className="p-4 text-ink-3">No tests listed at this lab yet.</Card>
                ) : (
                    <div className="space-y-2.5">
                        {lab.tests.map((test) => {
                            const active = selectedTest?.id === test.id;
                            return (
                                <button
                                    key={test.id}
                                    type="button"
                                    onClick={() => setSelectedTest(active ? null : test)}
                                    aria-pressed={active}
                                    className={cn(
                                        'w-full flex items-center gap-3.5 rounded-[14px] border p-3.5 text-left transition-colors',
                                        active
                                            ? 'border-brand-500 bg-brand-50'
                                            : 'border-line bg-surface hover:border-brand-300'
                                    )}
                                >
                                    <span className="grid place-items-center size-10 rounded-full bg-brand-50 text-brand-500 shrink-0">
                                        <FlaskConical size={18} />
                                    </span>
                                    <span className="flex-1 min-w-0">
                                        <span className="block font-semibold text-ink truncate">{test.name}</span>
                                        <span className="flex items-center gap-2 mt-0.5">
                                            {test.category && (
                                                <span className="text-[13px] text-ink-3">{test.category}</span>
                                            )}
                                            {test.homeSample && <Tag tone="brand">Home sample</Tag>}
                                        </span>
                                    </span>
                                    <span className="font-bold text-ink tabular shrink-0">{rupees(test.price)}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </section>

            {selectedTest && (
                <>
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
                </>
            )}

            {selectedTest && (
                <div className="fixed bottom-16 inset-x-0 z-30 border-t border-line bg-surface/95 backdrop-blur pb-safe">
                    <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
                        <div className="min-w-0">
                            <p className="text-[13px] text-ink-3 truncate">{selectedTest.name}</p>
                            <p className="font-bold text-lg text-ink tabular leading-tight">
                                {rupees(selectedTest.price)}
                            </p>
                        </div>
                        <Button
                            className="flex-1"
                            size="lg"
                            disabled={!selectedSlot}
                            onClick={() =>
                                router.push(
                                    `/book-test/${lab.id}/${selectedTest.id}?slot=${encodeURIComponent(selectedSlot!)}`
                                )
                            }
                        >
                            {selectedSlot ? 'Continue' : 'Select a time'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
