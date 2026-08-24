'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    Home, CalendarDays, FlaskConical, FileText, Ambulance,
    Search, User, LogOut, HelpCircle, Mail, ChevronRight, X, ShieldCheck, Building2,
} from 'lucide-react';
import { Logo, LogoMark } from '@/components/brand/Logo';
import { useSession } from '@/context/sessionProvider';
import { ageFromDob, bloodGroupLabel } from '@/lib/domain';
import { cn } from '@/lib/utils';

const NAV = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/labs', label: 'Labs', icon: FlaskConical },
    { href: '/appointments', label: 'Bookings', icon: CalendarDays },
    { href: '/reports', label: 'Reports', icon: FileText },
];

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isLoading, isAuthenticated, logout } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

    // Everything inside (app) needs a session.
    useEffect(() => {
        if (!isLoading && !isAuthenticated) router.replace('/auth');
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // Stop the page behind the drawer from scrolling under it.
    useEffect(() => {
        if (!menuOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    }, [menuOpen]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen grid place-items-center bg-canvas">
                <LogoMark className="size-10 text-brand-500 animate-pulse" />
            </div>
        );
    }

    const age = ageFromDob(user?.dob);
    const initials = (user?.name || '?')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');

    return (
        <div className="min-h-screen bg-canvas flex flex-col">
            {/* Header: profile left, search middle, emergency right */}
            <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur border-b border-line">
                <div className="mx-auto max-w-5xl px-4 h-16 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setMenuOpen(true)}
                        aria-label="Open your profile menu"
                        className="shrink-0 grid place-items-center size-11 rounded-full bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors"
                    >
                        {initials || <User size={20} />}
                    </button>

                    <Link
                        href="/search"
                        className="flex-1 h-11 px-4 inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-surface text-ink-4 hover:border-brand-300 transition-colors"
                    >
                        <Search size={18} className="shrink-0" />
                        <span className="truncate text-[15px]">Search doctors, hospitals, tests</span>
                    </Link>

                    <Link
                        href="/emergency"
                        aria-label="Emergency care"
                        className="shrink-0 grid place-items-center size-11 rounded-full bg-emergency-100 text-emergency-500 hover:bg-emergency-500 hover:text-white transition-colors"
                    >
                        <Ambulance size={20} />
                    </Link>
                </div>
            </header>

            <main className="flex-1 mx-auto w-full max-w-5xl px-4 pb-28 pt-5">{children}</main>

            {/* Bottom nav: the five places people actually go */}
            <nav className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur border-t border-line">
                <div className="mx-auto max-w-5xl px-2 flex items-stretch pb-safe">
                    {NAV.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href || pathname.startsWith(`${href}/`);
                        return (
                            <Link
                                key={href}
                                href={href}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'flex-1 min-h-14 flex flex-col items-center justify-center gap-0.5 pt-2 text-[11px] font-semibold transition-colors',
                                    active ? 'text-brand-600' : 'text-ink-3 hover:text-ink'
                                )}
                            >
                                <Icon size={21} strokeWidth={active ? 2.4 : 1.9} />
                                {label}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Profile drawer */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setMenuOpen(false)}
                        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
                    />

                    <div className="relative w-[min(20rem,86vw)] bg-surface flex flex-col shadow-lg animate-in">
                        <div className="p-5 border-b border-line">
                            <div className="flex items-start justify-between">
                                <Logo showWordmark={false} />
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen(false)}
                                    aria-label="Close menu"
                                    className="grid place-items-center size-9 -mr-1 -mt-1 rounded-full text-ink-3 hover:bg-canvas"
                                >
                                    <X size={19} />
                                </button>
                            </div>

                            <p className="mt-4 font-display text-xl font-extrabold text-ink truncate">
                                {user?.name || 'Your profile'}
                            </p>
                            <p className="text-sm text-ink-3 tabular">{user?.phone}</p>

                            {/* Vitals at a glance */}
                            <dl className="mt-4 grid grid-cols-4 gap-2 text-center">
                                {[
                                    { label: 'Age', value: age != null ? `${age}` : '—' },
                                    { label: 'Blood', value: bloodGroupLabel(user?.bloodGroup) ?? '—' },
                                    { label: 'Height', value: user?.heightCm ? `${user.heightCm}` : '—' },
                                    { label: 'Weight', value: user?.weightKg ? `${user.weightKg}` : '—' },
                                ].map((stat) => (
                                    <div key={stat.label} className="rounded-[10px] bg-canvas py-2">
                                        <dd className="font-bold text-ink tabular leading-none">{stat.value}</dd>
                                        <dt className="mt-1 text-[11px] text-ink-3">{stat.label}</dt>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        <nav className="flex-1 overflow-y-auto p-2">
                            {[
                                { href: '/profile', label: 'My profile', icon: User },
                                { href: '/appointments', label: 'Appointments & reminders', icon: CalendarDays },
                                { href: '/reports', label: 'My reports', icon: FileText },
                                { href: '/help', label: 'Help', icon: HelpCircle },
                                { href: '/contact', label: 'Contact us', icon: Mail },
                                { href: '/register', label: 'Register a hospital or lab', icon: Building2 },
                            ].map(({ href, label, icon: Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="flex items-center gap-3 px-3 h-12 rounded-[12px] text-ink-2 font-medium hover:bg-canvas"
                                >
                                    <Icon size={19} className="text-ink-3" />
                                    <span className="flex-1">{label}</span>
                                    <ChevronRight size={16} className="text-ink-4" />
                                </Link>
                            ))}

                            {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
                                <Link
                                    href={user.role === 'ADMIN' ? '/admin/dashboard' : '/super-admin'}
                                    className="mt-1 flex items-center gap-3 px-3 h-12 rounded-[12px] text-brand-700 font-semibold bg-brand-50 hover:bg-brand-100"
                                >
                                    <ShieldCheck size={19} />
                                    <span className="flex-1">
                                        {user.role === 'ADMIN' ? 'Hospital admin' : 'Super admin'}
                                    </span>
                                    <ChevronRight size={16} />
                                </Link>
                            )}
                        </nav>

                        <div className="p-2 border-t border-line">
                            <button
                                type="button"
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-3 h-12 rounded-[12px] text-danger-500 font-semibold hover:bg-danger-100"
                            >
                                <LogOut size={19} />
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
