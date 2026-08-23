'use client';

import Link from 'next/link';
import { MapPin, Star, Stethoscope } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { Tag } from '@/components/ui';
import { rupees } from '@/lib/domain';

export interface HospitalSummary {
    id: string;
    name: string;
    picture?: string | null;
    address?: string | null;
    distanceKm?: number | null;
    rating?: number | null;
    doctorCount: number;
    fromPrice?: number | null;
    emergency?: boolean;
}

export function HospitalCard({
    hospital,
    href,
}: {
    hospital: HospitalSummary;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="group block rounded-[16px] border border-line bg-surface p-3.5 hover:border-brand-300 transition-colors"
        >
            <div className="flex gap-3.5">
                <ImageWithFallback
                    src={hospital.picture || '/icons/hospital-gray.png'}
                    alt=""
                    width={80}
                    height={80}
                    unoptimized
                    className="size-[72px] rounded-[12px] object-cover bg-canvas shrink-0"
                />

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-ink leading-tight group-hover:text-brand-700 truncate">
                            {hospital.name}
                        </h3>
                        {hospital.emergency && <Tag tone="danger">24/7</Tag>}
                    </div>

                    {hospital.address && (
                        <p className="mt-1 flex items-center gap-1.5 text-[13px] text-ink-3 truncate">
                            <MapPin size={13} className="shrink-0" />
                            {hospital.address}
                        </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[13px]">
                        {hospital.rating != null && (
                            <span className="inline-flex items-center gap-1 font-semibold text-ink-2">
                                <Star size={13} className="fill-accent-500 text-accent-500" />
                                <span className="tabular">{hospital.rating.toFixed(1)}</span>
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-ink-3">
                            <Stethoscope size={13} />
                            {hospital.doctorCount} {hospital.doctorCount === 1 ? 'doctor' : 'doctors'}
                        </span>
                        {hospital.distanceKm != null && (
                            <span className="text-ink-3 tabular">{hospital.distanceKm.toFixed(1)} km</span>
                        )}
                    </div>
                </div>
            </div>

            {hospital.fromPrice != null && (
                <div className="mt-3 pt-3 border-t border-line flex items-center justify-between">
                    <span className="text-[13px] text-ink-3">Consultation from</span>
                    <span className="font-bold text-ink tabular">{rupees(hospital.fromPrice)}</span>
                </div>
            )}
        </Link>
    );
}
