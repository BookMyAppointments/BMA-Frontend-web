'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Phone, MapPin, Navigation, Ambulance, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, EmptyState, Skeleton } from '@/components/ui';
import { api } from '@/services/api';
import { useLocation } from '@/hooks/useLocation';
import { distanceKm } from '@/lib/domain';

interface EmergencyHospital {
    id: string;
    name: string;
    emergencyStatus?: boolean;
    location?: { lat: number; lng: number; address: string } | null;
}

/** National emergency numbers, shown before anything that needs a network call. */
const HOTLINES = [
    { label: 'Ambulance', number: '108' },
    { label: 'National emergency', number: '112' },
];

export default function EmergencyPage() {
    const { coords, status, request, hasLocation } = useLocation();

    const { data: hospitals, isLoading } = useQuery({
        queryKey: ['emergency-hospitals'],
        queryFn: () => api<EmergencyHospital[]>('/hospitals/get', { auth: false }),
    });

    const nearby = useMemo(() => {
        const open = (hospitals ?? []).filter((h) => h.emergencyStatus);
        const list = open.length > 0 ? open : (hospitals ?? []);
        return list
            .map((hospital) => ({
                ...hospital,
                distance:
                    coords && hospital.location
                        ? distanceKm(coords.lat, coords.lng, hospital.location.lat, hospital.location.lng)
                        : null,
            }))
            .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
            .slice(0, 10);
    }, [hospitals, coords]);

    return (
        <div className="space-y-5">
            {/* Call first. Everything else is secondary in an emergency. */}
            <Card className="p-5 bg-emergency-500 border-emergency-500">
                <div className="flex items-center gap-2.5 text-white">
                    <Ambulance size={22} />
                    <h1 className="font-display text-xl font-extrabold">Emergency help</h1>
                </div>
                <p className="mt-1.5 text-white/85 text-sm">
                    If someone is unresponsive or bleeding heavily, call now.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2.5">
                    {HOTLINES.map((line) => (
                        <a
                            key={line.number}
                            href={`tel:${line.number}`}
                            className="h-14 rounded-[14px] bg-white text-emergency-600 font-bold flex flex-col items-center justify-center leading-none hover:bg-white/90"
                        >
                            <span className="flex items-center gap-1.5 text-lg tabular">
                                <Phone size={16} />
                                {line.number}
                            </span>
                            <span className="mt-1 text-[11px] font-semibold uppercase tracking-wide opacity-70">
                                {line.label}
                            </span>
                        </a>
                    ))}
                </div>
            </Card>

            <section>
                <div className="flex items-baseline justify-between gap-4 mb-3">
                    <h2 className="text-lg font-bold text-ink">Emergency rooms near you</h2>
                    {!hasLocation && status !== 'denied' && (
                        <button
                            type="button"
                            onClick={request}
                            className="text-sm font-semibold text-brand-600 shrink-0"
                        >
                            {status === 'prompting' ? <Loader2 size={15} className="animate-spin" /> : 'Use my location'}
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {[0, 1, 2].map((i) => (
                            <Skeleton key={i} className="h-20 w-full rounded-[16px]" />
                        ))}
                    </div>
                ) : nearby.length === 0 ? (
                    <EmptyState
                        icon={<AlertTriangle size={24} />}
                        title="No hospitals listed"
                        body="Call 108 for an ambulance."
                    />
                ) : (
                    <div className="space-y-3">
                        {nearby.map((hospital) => (
                            <Card key={hospital.id} className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-ink leading-tight">{hospital.name}</h3>
                                        {hospital.location?.address && (
                                            <p className="mt-1 flex items-start gap-1.5 text-sm text-ink-3">
                                                <MapPin size={14} className="shrink-0 mt-0.5" />
                                                {hospital.location.address}
                                            </p>
                                        )}
                                    </div>
                                    {hospital.distance != null && (
                                        <span className="shrink-0 text-sm font-semibold text-ink-2 tabular">
                                            {hospital.distance.toFixed(1)} km
                                        </span>
                                    )}
                                </div>

                                {hospital.location && (
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.location.lat},${hospital.location.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 w-full h-11 inline-flex items-center justify-center gap-2 rounded-[12px] bg-emergency-100 text-emergency-600 font-semibold hover:bg-emergency-500 hover:text-white transition-colors"
                                    >
                                        <Navigation size={16} />
                                        Directions
                                    </a>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
