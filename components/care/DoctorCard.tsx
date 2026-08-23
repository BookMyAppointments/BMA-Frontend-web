'use client';

import Link from 'next/link';
import { Star, ChevronRight } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { rupees } from '@/lib/domain';
import type { Doctor } from '@/types/doctor';

export function DoctorCard({ doctor, href }: { doctor: Doctor; href: string }) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-3.5 rounded-[16px] border border-line bg-surface p-3.5 hover:border-brand-300 transition-colors"
        >
            <ImageWithFallback
                src={doctor.picture || '/doctors/doctor1.png'}
                alt=""
                width={64}
                height={64}
                unoptimized
                className="size-16 rounded-full object-cover bg-canvas shrink-0"
            />

            <div className="min-w-0 flex-1">
                <h3 className="font-bold text-ink leading-tight truncate group-hover:text-brand-700">
                    {doctor.name}
                </h3>
                <p className="text-[13px] text-ink-3 truncate">
                    {doctor.specialization?.join(', ')}
                </p>
                <p className="text-[13px] text-ink-4 truncate">
                    {doctor.qualifications?.join(', ')}
                </p>

                <div className="mt-1.5 flex items-center gap-3 text-[13px]">
                    {typeof doctor.ratings === 'number' && (
                        <span className="inline-flex items-center gap-1 font-semibold text-ink-2">
                            <Star size={13} className="fill-accent-500 text-accent-500" />
                            <span className="tabular">{doctor.ratings.toFixed(1)}</span>
                        </span>
                    )}
                    <span className="font-bold text-brand-600 tabular">{rupees(doctor.price)}</span>
                </div>
            </div>

            <ChevronRight size={18} className="text-ink-4 shrink-0" />
        </Link>
    );
}
