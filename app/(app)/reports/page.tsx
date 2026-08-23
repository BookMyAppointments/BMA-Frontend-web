'use client';

import { useQuery } from '@tanstack/react-query';
import { FileText, Download, FlaskConical, ChevronRight } from 'lucide-react';
import { ButtonLink, Card, EmptyState, Skeleton } from '@/components/ui';
import { api } from '@/services/api';
import { formatDay } from '@/lib/domain';

interface TestResult {
    id: string;
    resultUrl?: string | null;
    notes?: string | null;
    issuedAt: string;
    test?: {
        name: string;
        category?: string | null;
        lab?: { name: string } | null;
    } | null;
}

export default function ReportsPage() {
    const { data: results, isLoading } = useQuery({
        queryKey: ['test-results'],
        queryFn: () => api<TestResult[]>('/tests/results/get'),
        retry: false,
    });

    return (
        <div className="space-y-5">
            <div>
                <h1 className="font-display text-2xl font-extrabold text-ink">My reports</h1>
                <p className="mt-1 text-ink-3">
                    Every lab result in one place, ready for your next appointment.
                </p>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[0, 1, 2].map((i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-[16px]" />
                    ))}
                </div>
            ) : !results || results.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={<FileText size={24} />}
                        title="No reports yet"
                        body="When a lab uploads your test result, it lands here automatically."
                        action={
                            <ButtonLink href="/labs" variant="secondary">
                                <FlaskConical size={17} />
                                Book a lab test
                            </ButtonLink>
                        }
                    />
                </Card>
            ) : (
                <div className="space-y-3">
                    {results.map((result) => (
                        <Card key={result.id} className="p-4">
                            <div className="flex items-start gap-3.5">
                                <span className="grid place-items-center size-11 rounded-[12px] bg-brand-50 text-brand-500 shrink-0">
                                    <FileText size={19} />
                                </span>

                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-ink leading-tight truncate">
                                        {result.test?.name ?? 'Test result'}
                                    </h3>
                                    <p className="text-sm text-ink-3 truncate">
                                        {[result.test?.lab?.name, result.test?.category]
                                            .filter(Boolean)
                                            .join(' · ')}
                                    </p>
                                    <p className="mt-0.5 text-[13px] text-ink-4">
                                        {formatDay(new Date(result.issuedAt))}
                                    </p>
                                </div>

                                {result.resultUrl && (
                                    <a
                                        href={result.resultUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 inline-flex items-center gap-1.5 h-10 px-3.5 rounded-full border border-line-strong text-sm font-semibold text-ink hover:border-brand-300"
                                    >
                                        <Download size={15} />
                                        Open
                                    </a>
                                )}
                            </div>

                            {result.notes && (
                                <p className="mt-3 pt-3 border-t border-line text-sm text-ink-2">
                                    {result.notes}
                                </p>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
