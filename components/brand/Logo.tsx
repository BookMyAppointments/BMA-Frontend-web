import { cn } from '@/lib/utils';

/**
 * Mark: a calendar square whose "date" is a medical cross — booking plus care,
 * in one shape that still reads at favicon size.
 */
export function LogoMark({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 32 32" fill="none" className={cn('size-8', className)} aria-hidden="true">
            <rect x="2" y="5" width="28" height="25" rx="7" fill="currentColor" />
            <rect x="8" y="2" width="3" height="6" rx="1.5" fill="currentColor" />
            <rect x="21" y="2" width="3" height="6" rx="1.5" fill="currentColor" />
            <path
                d="M16 12.5v9M11.5 17h9"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function Logo({
    className,
    showWordmark = true,
    tagline = false,
}: {
    className?: string;
    showWordmark?: boolean;
    tagline?: boolean;
}) {
    return (
        <span className={cn('inline-flex items-center gap-2.5', className)}>
            <LogoMark className="size-8 text-brand-500 shrink-0" />
            {showWordmark && (
                <span className="leading-none">
                    <span className="block font-display text-[19px] font-extrabold tracking-tight text-ink">
                        Book<span className="text-brand-500">My</span>Appointments
                    </span>
                    {tagline && (
                        <span className="block mt-1 text-xs text-ink-3">
                            Care near you, booked in a minute
                        </span>
                    )}
                </span>
            )}
        </span>
    );
}
