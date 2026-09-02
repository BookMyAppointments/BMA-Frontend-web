'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Search, SearchX, ArrowLeft, FlaskConical } from 'lucide-react';
import { EmptyState, Input, SectionHeader, Skeleton } from '@/components/ui';
import { DoctorCard } from '@/components/care/DoctorCard';
import { fetchDoctors, fetchLabs } from '@/services/api';
import { SPECIALTIES, rupees } from '@/lib/domain';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const { data: doctors, isLoading: doctorsLoading } = useQuery({
        queryKey: ['doctors', 'all'],
        queryFn: fetchDoctors,
    });

    const { data: labs, isLoading: labsLoading } = useQuery({
        queryKey: ['labs', 'all'],
        queryFn: () => fetchLabs(),
    });

    const isLoading = doctorsLoading || labsLoading;
    const trimmed = query.trim().toLowerCase();

    const matches = useMemo(() => {
        if (trimmed.length < 2) return { specialties: [], doctors: [], hospitals: [], labs: [], tests: [] };

        const specialties = SPECIALTIES.filter(
            (s) =>
                s.label.toLowerCase().includes(trimmed) ||
                s.key.toLowerCase().includes(trimmed) ||
                s.blurb.toLowerCase().includes(trimmed)
        );

        const matchedDoctors = (doctors ?? []).filter(
            (d) =>
                d.name?.toLowerCase().includes(trimmed) ||
                d.specialization?.some((s) => s.toLowerCase().includes(trimmed))
        );

        // Hospitals are derived from the doctor list, deduped by id.
        const hospitalMap = new Map<string, { id: string; name: string; address?: string }>();
        for (const doctor of doctors ?? []) {
            const hospital = doctor.hospital;
            if (!hospital) continue;
            if (!hospital.name?.toLowerCase().includes(trimmed)) continue;
            if (!hospitalMap.has(hospital.id)) {
                hospitalMap.set(hospital.id, {
                    id: hospital.id,
                    name: hospital.name,
                    address: hospital.location?.address,
                });
            }
        }

        // Labs matched by name, address, or a service/test they offer.
        const matchedLabs = (labs ?? []).filter(
            (l) =>
                l.name?.toLowerCase().includes(trimmed) ||
                l.location?.address?.toLowerCase().includes(trimmed) ||
                l.services?.some((s) => s.toLowerCase().includes(trimmed))
        );

        // Individual tests, surfaced with the lab that offers them.
        const matchedTests = (labs ?? [])
            .flatMap((l) => (l.tests ?? []).map((t) => ({ ...t, lab: l })))
            .filter((t) => t.name?.toLowerCase().includes(trimmed));

        return {
            specialties: specialties.slice(0, 6),
            doctors: matchedDoctors.slice(0, 10),
            hospitals: Array.from(hospitalMap.values()).slice(0, 6),
            labs: matchedLabs.slice(0, 6),
            tests: matchedTests.slice(0, 8),
        };
    }, [trimmed, doctors, labs]);

    const nothingFound =
        trimmed.length >= 2 &&
        matches.specialties.length === 0 &&
        matches.doctors.length === 0 &&
        matches.hospitals.length === 0 &&
        matches.labs.length === 0 &&
        matches.tests.length === 0;

    return (
        <div className="space-y-5">
            <Link
                href="/home"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-3 hover:text-ink"
            >
                <ArrowLeft size={16} />
                Back
            </Link>

            <div className="relative">
                <Search size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-4 pointer-events-none" />
                <Input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Doctor, hospital, lab or test"
                    className="pl-11"
                    aria-label="Search"
                />
            </div>

            {trimmed.length < 2 && (
                <section>
                    <SectionHeader title="Browse specialties" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {SPECIALTIES.map(({ key, label, icon: Icon }) => (
                            <Link
                                key={key}
                                href={`/care/${encodeURIComponent(key)}`}
                                className="flex items-center gap-2.5 rounded-[14px] border border-line bg-surface p-3 hover:border-brand-300 transition-colors"
                            >
                                <Icon size={18} className="text-brand-500 shrink-0" />
                                <span className="font-semibold text-sm text-ink truncate">{label}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {isLoading && trimmed.length >= 2 && (
                <div className="space-y-3">
                    {[0, 1, 2].map((i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-[16px]" />
                    ))}
                </div>
            )}

            {nothingFound && (
                <EmptyState
                    icon={<SearchX size={24} />}
                    title={`Nothing matches "${query.trim()}"`}
                    body="Try a specialty, a doctor's name, or a test like blood sugar."
                />
            )}

            {matches.specialties.length > 0 && (
                <section>
                    <SectionHeader title="Specialties" />
                    <div className="grid grid-cols-2 gap-2.5">
                        {matches.specialties.map(({ key, label, icon: Icon }) => (
                            <Link
                                key={key}
                                href={`/care/${encodeURIComponent(key)}`}
                                className="flex items-center gap-2.5 rounded-[14px] border border-line bg-surface p-3 hover:border-brand-300"
                            >
                                <Icon size={18} className="text-brand-500 shrink-0" />
                                <span className="font-semibold text-sm text-ink truncate">{label}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {matches.hospitals.length > 0 && (
                <section>
                    <SectionHeader title="Hospitals" />
                    <div className="space-y-2.5">
                        {matches.hospitals.map((hospital) => (
                            <Link
                                key={hospital.id}
                                href={`/hospital/${hospital.id}`}
                                className="block rounded-[14px] border border-line bg-surface p-3.5 hover:border-brand-300"
                            >
                                <p className="font-bold text-ink truncate">{hospital.name}</p>
                                {hospital.address && (
                                    <p className="text-[13px] text-ink-3 truncate">{hospital.address}</p>
                                )}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {matches.doctors.length > 0 && (
                <section>
                    <SectionHeader title="Doctors" />
                    <div className="space-y-3">
                        {matches.doctors.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} href={`/doctor/${doctor.id}`} />
                        ))}
                    </div>
                </section>
            )}

            {matches.labs.length > 0 && (
                <section>
                    <SectionHeader title="Labs" />
                    <div className="space-y-2.5">
                        {matches.labs.map((lab) => (
                            <Link
                                key={lab.id}
                                href={`/lab/${lab.id}`}
                                className="block rounded-[14px] border border-line bg-surface p-3.5 hover:border-brand-300"
                            >
                                <p className="font-bold text-ink truncate">{lab.name}</p>
                                {lab.location?.address && (
                                    <p className="text-[13px] text-ink-3 truncate">{lab.location.address}</p>
                                )}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {matches.tests.length > 0 && (
                <section>
                    <SectionHeader title="Tests" />
                    <div className="space-y-2.5">
                        {matches.tests.map((test) => (
                            <Link
                                key={test.id}
                                href={`/lab/${test.lab.id}`}
                                className="flex items-center gap-3 rounded-[14px] border border-line bg-surface p-3.5 hover:border-brand-300"
                            >
                                <span className="grid place-items-center size-9 rounded-full bg-brand-50 text-brand-500 shrink-0">
                                    <FlaskConical size={16} />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block font-semibold text-ink truncate">{test.name}</span>
                                    <span className="block text-[13px] text-ink-3 truncate">{test.lab.name}</span>
                                </span>
                                <span className="font-bold text-ink tabular shrink-0">{rupees(test.price)}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
