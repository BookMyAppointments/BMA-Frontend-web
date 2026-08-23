'use client';

import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, SearchX, MapPin } from 'lucide-react';
import { Card, Chip, EmptyState, Skeleton, ButtonLink } from '@/components/ui';
import { HospitalCard, type HospitalSummary } from '@/components/care/HospitalCard';
import { fetchDoctorsBySpecialization } from '@/services/api';
import { useLocation } from '@/hooks/useLocation';
import { distanceKm, findSpecialty, PATIENT_TYPES } from '@/lib/domain';
import type { Doctor } from '@/types/doctor';

type SortKey = 'near' | 'rating';

export default function CarePage() {
    const params = useParams<{ specialty: string }>();
    const searchParams = useSearchParams();
    const specialtyKey = decodeURIComponent(params?.specialty ?? '');
    const patientType = searchParams.get('for');

    const { coords, hasLocation, request, status } = useLocation();
    const [sort, setSort] = useState<SortKey>('near');

    const specialty = findSpecialty(specialtyKey);
    const patientLabel = PATIENT_TYPES.find((p) => p.key === patientType)?.label;

    const { data: doctors, isLoading, isError } = useQuery({
        queryKey: ['doctors', specialtyKey, patientType],
        queryFn: () => fetchDoctorsBySpecialization(specialtyKey, patientType ?? undefined),
    });

    /** Doctors come back per-doctor; the user is choosing a hospital, so roll up. */
    const hospitals = useMemo<HospitalSummary[]>(() => {
        if (!doctors) return [];

        const byHospital = new Map<string, { doctors: Doctor[]; hospital: NonNullable<Doctor['hospital']> }>();
        for (const doctor of doctors) {
            if (!doctor.hospital) continue;
            const entry = byHospital.get(doctor.hospital.id);
            if (entry) entry.doctors.push(doctor);
            else byHospital.set(doctor.hospital.id, { doctors: [doctor], hospital: doctor.hospital });
        }

        const rows = Array.from(byHospital.values()).map(({ doctors: docs, hospital }) => {
            const rated = docs.filter((d) => typeof d.ratings === 'number');
            const prices = docs.map((d) => d.price).filter((p): p is number => typeof p === 'number');

            return {
                id: hospital.id,
                name: hospital.name,
                picture: hospital.picture,
                address: hospital.location?.address ?? null,
                rating: rated.length
                    ? rated.reduce((sum, d) => sum + (d.ratings ?? 0), 0) / rated.length
                    : null,
                doctorCount: docs.length,
                fromPrice: prices.length ? Math.min(...prices) : null,
                emergency: Boolean((hospital as { emergencyStatus?: boolean }).emergencyStatus),
                distanceKm:
                    coords && hospital.location
                        ? distanceKm(coords.lat, coords.lng, hospital.location.lat, hospital.location.lng)
                        : null,
            } satisfies HospitalSummary;
        });

        // Fall back to rating when we have no location to sort by.
        const effectiveSort = sort === 'near' && !hasLocation ? 'rating' : sort;
        return rows.sort((a, b) =>
            effectiveSort === 'near'
                ? (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)
                : (b.rating ?? 0) - (a.rating ?? 0)
        );
    }, [doctors, coords, hasLocation, sort]);

    return (
        <div className="space-y-5">
            <div>
                <Link
                    href="/home"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-3 hover:text-ink"
                >
                    <ArrowLeft size={16} />
                    Back
                </Link>
                <h1 className="mt-3 font-display text-2xl font-extrabold text-ink">
                    {specialty?.label ?? specialtyKey}
                </h1>
                <p className="mt-1 text-ink-3">
                    {specialty?.blurb}
                    {patientLabel && <> · for {patientLabel.toLowerCase()}</>}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <Chip active={sort === 'near'} onClick={() => (hasLocation ? setSort('near') : request())}>
                    Nearest
                </Chip>
                <Chip active={sort === 'rating'} onClick={() => setSort('rating')}>
                    Top rated
                </Chip>
            </div>

            {!hasLocation && sort === 'near' && status !== 'prompting' && (
                <Card className="p-3.5 flex items-center gap-3 border-brand-100 bg-brand-50">
                    <MapPin size={18} className="text-brand-500 shrink-0" />
                    <p className="flex-1 text-sm text-ink-2">
                        Showing top rated. Allow location to sort by distance.
                    </p>
                    <button
                        type="button"
                        onClick={request}
                        className="shrink-0 h-9 px-3.5 rounded-full bg-brand-500 text-white text-sm font-semibold"
                    >
                        Allow
                    </button>
                </Card>
            )}

            {isLoading && (
                <div className="space-y-3">
                    {[0, 1, 2].map((i) => (
                        <Card key={i} className="p-3.5">
                            <div className="flex gap-3.5">
                                <Skeleton className="size-[72px] shrink-0" />
                                <div className="flex-1 space-y-2 pt-1">
                                    <Skeleton className="h-4 w-2/3" />
                                    <Skeleton className="h-3 w-1/2" />
                                    <Skeleton className="h-3 w-1/3" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {isError && (
                <EmptyState
                    icon={<SearchX size={24} />}
                    title="Could not load hospitals"
                    body="Check your connection and try again."
                />
            )}

            {!isLoading && !isError && hospitals.length === 0 && (
                <EmptyState
                    icon={<SearchX size={24} />}
                    title="No hospitals found"
                    body={
                        patientLabel
                            ? `No ${specialty?.label ?? specialtyKey} doctors for ${patientLabel.toLowerCase()} yet. Try clearing the filter.`
                            : 'Nothing listed for this specialty yet.'
                    }
                    action={<ButtonLink href="/home" variant="secondary">Browse specialties</ButtonLink>}
                />
            )}

            {hospitals.length > 0 && (
                <>
                    <p className="text-sm text-ink-3">
                        {hospitals.length} {hospitals.length === 1 ? 'hospital' : 'hospitals'}
                    </p>
                    <div className="space-y-3">
                        {hospitals.map((hospital) => (
                            <HospitalCard
                                key={hospital.id}
                                hospital={hospital}
                                href={`/hospital/${hospital.id}?specialty=${encodeURIComponent(specialtyKey)}${patientType ? `&for=${patientType}` : ''}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
