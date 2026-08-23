'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { MapPin, Navigation, FlaskConical, FileText, Ambulance, ChevronRight, Loader2 } from 'lucide-react';
import { Card, Chip, SectionHeader, Tag } from '@/components/ui';
import { useSession } from '@/context/sessionProvider';
import { useLocation } from '@/hooks/useLocation';
import { PATIENT_TYPES, SPECIALTIES, type PatientTypeKey } from '@/lib/domain';
import { cn } from '@/lib/utils';

const QUICK_LINKS = [
    { href: '/labs', label: 'Lab tests', body: 'Blood work, scans', icon: FlaskConical, tone: 'brand' as const },
    { href: '/reports', label: 'My reports', body: 'Results in one place', icon: FileText, tone: 'brand' as const },
    { href: '/emergency', label: 'Emergency', body: 'Open 24/7 near you', icon: Ambulance, tone: 'emergency' as const },
];

export default function HomePage() {
    const { user } = useSession();
    const { status, request, hasLocation } = useLocation();
    const [patientType, setPatientType] = useState<PatientTypeKey | null>(null);

    const firstName = useMemo(() => (user?.name || '').split(' ')[0], [user?.name]);

    // Narrow the specialty list to what makes sense for the selected person.
    const specialties = useMemo(() => {
        if (patientType === 'CHILDREN') {
            return SPECIALTIES.filter((s) => s.key !== 'Gynecology');
        }
        if (patientType === 'MEN') {
            return SPECIALTIES.filter((s) => s.key !== 'Gynecology');
        }
        return SPECIALTIES;
    }, [patientType]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-display text-[1.75rem] leading-tight font-extrabold text-ink">
                    {firstName ? `Hello, ${firstName}` : 'Hello'}
                </h1>
                <p className="mt-1 text-ink-3">What do you need help with today?</p>
            </div>

            {/* Location: one clear ask, one clear confirmed state */}
            {!hasLocation ? (
                <Card className="p-4 flex items-center gap-3.5 border-brand-100 bg-brand-50">
                    <span className="grid place-items-center size-10 rounded-full bg-brand-500 text-white shrink-0">
                        <MapPin size={19} />
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-ink leading-snug">
                            {status === 'denied'
                                ? 'Location is blocked'
                                : 'Show hospitals near me'}
                        </p>
                        <p className="text-sm text-ink-3 leading-snug">
                            {status === 'denied'
                                ? 'Allow location in your browser settings to sort by distance.'
                                : 'We use it only to sort results by distance.'}
                        </p>
                    </div>
                    {status !== 'denied' && (
                        <button
                            type="button"
                            onClick={request}
                            disabled={status === 'prompting'}
                            className="shrink-0 h-10 px-4 rounded-full bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 disabled:opacity-60"
                        >
                            {status === 'prompting' ? <Loader2 size={16} className="animate-spin" /> : 'Allow'}
                        </button>
                    )}
                </Card>
            ) : (
                <div className="flex items-center gap-2 text-sm text-ink-3">
                    <Navigation size={15} className="text-brand-500" />
                    Sorting by distance from your location
                </div>
            )}

            {/* Who is this for */}
            <section>
                <SectionHeader title="Who is this for?" />
                <div className="grid grid-cols-3 gap-3">
                    {PATIENT_TYPES.map(({ key, label, icon: Icon }) => {
                        const active = patientType === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                aria-pressed={active}
                                onClick={() => setPatientType(active ? null : key)}
                                className={cn(
                                    'rounded-[16px] border py-4 flex flex-col items-center gap-2 transition-colors',
                                    active
                                        ? 'border-brand-500 bg-brand-500 text-white'
                                        : 'border-line bg-surface text-ink-2 hover:border-brand-300'
                                )}
                            >
                                <Icon size={22} />
                                <span className="text-sm font-semibold">{label}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Specialties */}
            <section>
                <SectionHeader
                    title="Choose a specialty"
                    action={
                        patientType && (
                            <button
                                type="button"
                                onClick={() => setPatientType(null)}
                                className="text-sm font-semibold text-brand-600"
                            >
                                Clear filter
                            </button>
                        )
                    }
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {specialties.map(({ key, label, blurb, icon: Icon }) => (
                        <Link
                            key={key}
                            href={`/care/${encodeURIComponent(key)}${patientType ? `?for=${patientType}` : ''}`}
                            className="group rounded-[16px] border border-line bg-surface p-4 hover:border-brand-300 hover:bg-brand-50/40 transition-colors"
                        >
                            <span className="grid place-items-center size-10 rounded-full bg-brand-50 text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                                <Icon size={20} />
                            </span>
                            <p className="mt-3 font-bold text-ink leading-tight">{label}</p>
                            <p className="mt-0.5 text-[13px] text-ink-3 leading-snug">{blurb}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Everything else */}
            <section>
                <SectionHeader title="Also here" />
                <div className="grid gap-3 sm:grid-cols-3">
                    {QUICK_LINKS.map(({ href, label, body, icon: Icon, tone }) => (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'rounded-[16px] border p-4 flex items-center gap-3.5 transition-colors bg-surface',
                                tone === 'emergency'
                                    ? 'border-emergency-100 hover:border-emergency-500'
                                    : 'border-line hover:border-brand-300'
                            )}
                        >
                            <span
                                className={cn(
                                    'grid place-items-center size-10 rounded-full shrink-0',
                                    tone === 'emergency'
                                        ? 'bg-emergency-100 text-emergency-500'
                                        : 'bg-brand-50 text-brand-500'
                                )}
                            >
                                <Icon size={19} />
                            </span>
                            <span className="flex-1 min-w-0">
                                <span className="block font-bold text-ink leading-tight">{label}</span>
                                <span className="block text-[13px] text-ink-3 leading-snug">{body}</span>
                            </span>
                            <ChevronRight size={17} className="text-ink-4 shrink-0" />
                        </Link>
                    ))}
                </div>
            </section>

            {!user?.bloodGroup && (
                <Card className="p-4 flex items-center gap-3">
                    <Tag tone="warning">Incomplete</Tag>
                    <p className="flex-1 text-sm text-ink-2">
                        Add your blood group and vitals so doctors have them on hand.
                    </p>
                    <Link href="/profile" className="text-sm font-semibold text-brand-600 shrink-0">
                        Add
                    </Link>
                </Card>
            )}
        </div>
    );
}
