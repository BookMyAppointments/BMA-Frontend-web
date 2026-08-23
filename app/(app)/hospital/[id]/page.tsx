'use client';

import { useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Clock, Navigation, SearchX, Users } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { Card, EmptyState, SectionHeader, Skeleton, Tag } from '@/components/ui';
import { DoctorCard } from '@/components/care/DoctorCard';
import { api } from '@/services/api';
import { findSpecialty } from '@/lib/domain';
import type { Doctor } from '@/types/doctor';

interface HospitalDetail {
    id: string;
    name: string;
    picture?: string | null;
    banner?: string | null;
    description?: string | null;
    departments: string[];
    facilities: string[];
    hours?: Record<string, { open?: string; close?: string; closed?: boolean }> | null;
    emergencyStatus?: boolean;
    location?: { lat: number; lng: number; address: string } | null;
    doctors?: Doctor[];
}

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function HospitalPage() {
    const params = useParams<{ id: string }>();
    const searchParams = useSearchParams();
    const specialty = searchParams.get('specialty');
    const patientType = searchParams.get('for');
    const hospitalId = params?.id;

    const { data: hospital, isLoading, isError } = useQuery({
        queryKey: ['hospital', hospitalId],
        queryFn: () => api<HospitalDetail>(`/hospitals/get/${hospitalId}`, { auth: false }),
        enabled: Boolean(hospitalId),
    });

    // Lead with the specialty the user came in for, but never hide the rest.
    const { matching, others } = useMemo(() => {
        const all = hospital?.doctors ?? [];
        if (!specialty) return { matching: all, others: [] as Doctor[] };
        return {
            matching: all.filter((d) => d.specialization?.includes(specialty)),
            others: all.filter((d) => !d.specialization?.includes(specialty)),
        };
    }, [hospital?.doctors, specialty]);

    const openingHours = useMemo(() => {
        if (!hospital?.hours || typeof hospital.hours !== 'object') return [];
        return Object.entries(hospital.hours).sort(
            ([a], [b]) => DAY_ORDER.indexOf(a.toLowerCase()) - DAY_ORDER.indexOf(b.toLowerCase())
        );
    }, [hospital?.hours]);

    const bookingQuery = patientType ? `?for=${patientType}` : '';

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-40 w-full rounded-[18px]" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-20 w-full" />
            </div>
        );
    }

    if (isError || !hospital) {
        return (
            <EmptyState
                icon={<SearchX size={24} />}
                title="Hospital not found"
                body="It may have been removed. Try browsing from the home screen."
            />
        );
    }

    return (
        <div className="space-y-6">
            <Link
                href={specialty ? `/care/${encodeURIComponent(specialty)}` : '/home'}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-3 hover:text-ink"
            >
                <ArrowLeft size={16} />
                Back
            </Link>

            {/* Identity */}
            <Card className="overflow-hidden">
                <div className="relative h-36 bg-brand-100">
                    {hospital.banner && (
                        <ImageWithFallback
                            src={hospital.banner}
                            alt=""
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 900px"
                            className="object-cover"
                        />
                    )}
                </div>

                <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-3.5 -mt-12">
                        <ImageWithFallback
                            src={hospital.picture || '/icons/hospital-gray.png'}
                            alt=""
                            width={80}
                            height={80}
                            unoptimized
                            className="size-20 rounded-[16px] object-cover bg-surface border-4 border-surface shrink-0"
                        />
                        {hospital.emergencyStatus && (
                            <div className="mt-14">
                                <Tag tone="danger">Emergency 24/7</Tag>
                            </div>
                        )}
                    </div>

                    <h1 className="mt-3 font-display text-2xl font-extrabold text-ink">
                        {hospital.name}
                    </h1>

                    {hospital.location?.address && (
                        <p className="mt-1.5 flex items-start gap-1.5 text-ink-3">
                            <MapPin size={16} className="shrink-0 mt-0.5" />
                            {hospital.location.address}
                        </p>
                    )}

                    {hospital.location && (
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${hospital.location.lat},${hospital.location.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-2 h-11 px-4 rounded-full border border-line-strong text-ink font-semibold text-sm hover:border-brand-300"
                        >
                            <Navigation size={16} className="text-brand-500" />
                            Get directions
                        </a>
                    )}
                </div>
            </Card>

            {/* Doctors: the reason people are on this page */}
            <section>
                <SectionHeader
                    title={
                        specialty
                            ? `${findSpecialty(specialty)?.label ?? specialty} doctors`
                            : 'Doctors'
                    }
                />
                {matching.length === 0 ? (
                    <Card className="p-4 text-ink-3">
                        No doctors listed for this specialty here.
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {matching.map((doctor) => (
                            <DoctorCard
                                key={doctor.id}
                                doctor={doctor}
                                href={`/doctor/${doctor.id}${bookingQuery}`}
                            />
                        ))}
                    </div>
                )}
            </section>

            {others.length > 0 && (
                <section>
                    <SectionHeader title="Other specialists here" />
                    <div className="space-y-3">
                        {others.slice(0, 5).map((doctor) => (
                            <DoctorCard
                                key={doctor.id}
                                doctor={doctor}
                                href={`/doctor/${doctor.id}${bookingQuery}`}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Practical detail, deliberately below the doctors */}
            <div className="grid gap-4 sm:grid-cols-2">
                {openingHours.length > 0 && (
                    <Card className="p-4">
                        <h2 className="flex items-center gap-2 font-bold text-ink">
                            <Clock size={17} className="text-brand-500" />
                            Opening hours
                        </h2>
                        <dl className="mt-3 space-y-1.5 text-sm">
                            {openingHours.map(([day, value]) => (
                                <div key={day} className="flex justify-between gap-4">
                                    <dt className="capitalize text-ink-3">{day}</dt>
                                    <dd className="text-ink-2 tabular">
                                        {value?.closed
                                            ? 'Closed'
                                            : `${value?.open ?? '—'} – ${value?.close ?? '—'}`}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </Card>
                )}

                {hospital.facilities?.length > 0 && (
                    <Card className="p-4">
                        <h2 className="flex items-center gap-2 font-bold text-ink">
                            <Users size={17} className="text-brand-500" />
                            Facilities
                        </h2>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {hospital.facilities.map((facility) => (
                                <span
                                    key={facility}
                                    className="h-7 px-2.5 inline-flex items-center rounded-full bg-canvas text-[13px] text-ink-2"
                                >
                                    {facility}
                                </span>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
