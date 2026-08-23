'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Logo, LogoMark } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui';
import { useSession } from '@/context/sessionProvider';

/**
 * Chrome for the staff-facing areas. Deliberately plainer than the patient
 * shell: no bottom nav, and a badge so it is always obvious which console
 * you are looking at.
 */
export function AdminShell({
    children,
    role,
}: {
    children: React.ReactNode;
    role: 'ADMIN' | 'SUPERADMIN';
}) {
    const { user, isLoading, logout } = useSession();

    if (isLoading) {
        return (
            <div className="min-h-screen grid place-items-center bg-canvas">
                <LogoMark className="size-10 text-brand-500 animate-pulse" />
            </div>
        );
    }

    if (user?.role !== role) {
        return (
            <div className="min-h-screen grid place-items-center bg-canvas px-5">
                <div className="text-center max-w-sm">
                    <span className="inline-grid place-items-center size-14 rounded-full bg-danger-100 text-danger-500">
                        <ShieldCheck size={26} />
                    </span>
                    <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">
                        Not your console
                    </h1>
                    <p className="mt-2 text-ink-3">
                        This area is for {role === 'ADMIN' ? 'hospital admins' : 'super admins'}.
                        You are signed in as {user?.role?.toLowerCase() ?? 'a guest'}.
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                        <ButtonLink href="/home" variant="secondary">
                            Go to the app
                        </ButtonLink>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-canvas flex flex-col">
            <header className="sticky top-0 z-40 bg-surface border-b border-line">
                <div className="mx-auto max-w-6xl px-5 h-16 flex items-center gap-4">
                    <Link href="/home" className="inline-flex shrink-0">
                        <Logo showWordmark={false} />
                    </Link>

                    <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wide">
                        <ShieldCheck size={13} />
                        {role === 'ADMIN' ? 'Hospital admin' : 'Super admin'}
                    </span>

                    <div className="flex-1" />

                    <Link
                        href="/home"
                        className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-ink-3 hover:text-ink"
                    >
                        <ArrowLeft size={15} />
                        Back to app
                    </Link>

                    <button
                        type="button"
                        onClick={logout}
                        className="text-sm font-semibold text-ink-3 hover:text-danger-500"
                    >
                        Sign out
                    </button>
                </div>
            </header>

            <main className="flex-1 mx-auto w-full max-w-6xl px-5 py-6">{children}</main>
        </div>
    );
}
