'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { FlaskConical, MapPin, SearchX, ChevronRight } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { Chip, EmptyState, Skeleton, Tag } from '@/components/ui';
import { fetchLabs } from '@/services/api';
import { useLocation } from '@/hooks/useLocation';
import { distanceKm, LAB_SERVICES, rupees } from '@/lib/domain';

interface LabRow {
    id: string;
    name: string;
    picture?: string | null;
    services: string[];
    location?: { lat: number; lng: number; address: string } | null;
    tests?: { id: string; name: string; price: number; homeSample?: boolean }[];
}

export default function LabsPage() {
    const [service, setService] = useState<string | null>(null);
    const { coords } = useLocation();

    const { data: labs, isLoading, isError } = useQuery({
        queryKey: ['labs'],
        queryFn: () => fetchLabs(),
    });

    const rows = useMemo(() => {
        const all = (labs ?? []) as unknown as LabRow[];
        const filtered = service ? all.filter((lab) => lab.services?.includes(service)) : all;

        return filtered
            .map((lab) => ({
                ...lab,
                distance:
                    coords && lab.location
                        ? distanceKm(coords.lat, coords.lng, lab.location.lat, lab.location.lng)
                        : null,
                fromPrice: lab.tests?.length
                    ? Math.min(...lab.tests.map((t) => t.price))
                    : null,
                hasHomeSample: lab.tests?.some((t) => t.homeSample) ?? false,
            }))
            .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }, [labs, service, coords]);

    return (
        <div className="space-y-5">
            <div>
                <h1 className="font-display text-2xl font-extrabold text-ink">Lab tests</h1>
                <p className="mt-1 text-ink-3">Blood work, scans and diagnostics near you.</p>
            </div>

            <div className="rail flex gap-2 -mx-4 px-4">
                <Chip active={service === null} onClick={() => setService(null)}>
                    All
                </Chip>
                {LAB_SERVICES.map((item) => (
                    <Chip
                        key={item}
                        active={service === item}
                        onClick={() => setService(service === item ? null : item)}
                    >
                        {item}
                    </Chip>
                ))}
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[0, 1, 2].map((i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-[16px]" />
                    ))}
                </div>
            ) : isError ? (
                <EmptyState icon={<SearchX size={24} />} title="Could not load labs" />
            ) : rows.length === 0 ? (
                <EmptyState
                    icon={<SearchX size={24} />}
                    title="No labs found"
                    body={service ? `No lab offers ${service} yet.` : 'No labs listed yet.'}
                />
            ) : (
                <div className="space-y-3">
                    {rows.map((lab) => (
                        <Link
                            key={lab.id}
                            href={`/lab/${lab.id}`}
                            className="group block rounded-[16px] border border-line bg-surface p-3.5 hover:border-brand-300 transition-colors"
                        >
                            <div className="flex gap-3.5">
                                <ImageWithFallback
                                    src={lab.picture || '/icons/lab-gray.png'}
                                    alt=""
                                    width={72}
                                    height={72}
                                    unoptimized
                                    className="size-[72px] rounded-[12px] object-cover bg-canvas shrink-0"
                                />

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-bold text-ink leading-tight truncate group-hover:text-brand-700">
                                            {lab.name}
                                        </h3>
                                        {lab.hasHomeSample && <Tag tone="brand">Home visit</Tag>}
                                    </div>

                                    {lab.location?.address && (
                                        <p className="mt-1 flex items-center gap-1.5 text-[13px] text-ink-3 truncate">
                                            <MapPin size={13} className="shrink-0" />
                                            {lab.location.address}
                                        </p>
                                    )}

                                    <div className="mt-2 flex items-center gap-3 text-[13px]">
                                        <span className="inline-flex items-center gap-1 text-ink-3">
                                            <FlaskConical size={13} />
                                            {lab.tests?.length ?? 0} tests
                                        </span>
                                        {lab.distance != null && (
                                            <span className="text-ink-3 tabular">
                                                {lab.distance.toFixed(1)} km
                                            </span>
                                        )}
                                        {lab.fromPrice != null && (
                                            <span className="font-bold text-brand-600 tabular">
                                                from {rupees(lab.fromPrice)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <ChevronRight size={18} className="text-ink-4 shrink-0 self-center" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
