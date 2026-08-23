'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Search, MapPin, CalendarCheck, MessageCircle, FlaskConical,
    FileText, Ambulance, ArrowRight, Stethoscope,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { ButtonLink, Card } from '@/components/ui';
import { useSession } from '@/context/sessionProvider';
import { SPECIALTIES } from '@/lib/domain';

const STEPS = [
    {
        icon: Search,
        title: 'Tell us what hurts',
        body: 'Pick a specialty like heart, bones or skin. No medical jargon to decode.',
    },
    {
        icon: MapPin,
        title: 'See who is nearby',
        body: 'Hospitals sorted by distance from you, with ratings and consultation fees shown upfront.',
    },
    {
        icon: CalendarCheck,
        title: 'Pick a time and pay',
        body: 'Choose a slot that suits you. Pay online or at the hospital, your call.',
    },
    {
        icon: MessageCircle,
        title: 'Get it on WhatsApp',
        body: 'Confirmation with the doctor, address and time lands on your phone.',
    },
];

const ALSO = [
    { icon: FlaskConical, title: 'Lab tests', body: 'Book blood work and scans, with home sample collection where offered.' },
    { icon: FileText, title: 'Your reports', body: 'Every test result in one place, ready when the next doctor asks.' },
    { icon: Ambulance, title: 'Emergency, 24/7', body: 'Hospitals with emergency rooms open right now, one tap away.' },
];

export default function LandingPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useSession();

    // A signed-in visitor wants the app, not the pitch.
    useEffect(() => {
        if (!isLoading && isAuthenticated) router.replace('/home');
    }, [isLoading, isAuthenticated, router]);

    return (
        <div className="min-h-screen bg-canvas">
            <header className="sticky top-0 z-40 bg-canvas/85 backdrop-blur border-b border-line">
                <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
                    <Logo />
                    <ButtonLink href="/auth" size="sm">
                        Sign in
                    </ButtonLink>
                </div>
            </header>

            {/* Hero: one composition, one job — get people to start a booking. */}
            <section className="mx-auto max-w-6xl px-5 pt-14 pb-16 md:pt-20 md:pb-24">
                <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
                    <div>
                        <p className="inline-flex items-center gap-2 h-8 px-3 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold">
                            <Stethoscope size={15} />
                            Doctors, labs and emergency care
                        </p>

                        <h1 className="mt-5 font-display text-[2.75rem] leading-[1.05] md:text-[4rem] font-extrabold text-ink">
                            See a doctor
                            <br />
                            <span className="text-brand-500">without the queue.</span>
                        </h1>

                        <p className="mt-5 text-lg text-ink-2 max-w-lg">
                            Find the right specialist near you, book a real time slot, and
                            walk in knowing you are expected.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <ButtonLink href="/auth" size="lg">
                                Book an appointment
                                <ArrowRight size={18} />
                            </ButtonLink>
                            <ButtonLink href="/emergency" size="lg" variant="secondary">
                                <Ambulance size={18} className="text-emergency-500" />
                                Emergency care
                            </ButtonLink>
                        </div>

                        <p className="mt-4 text-sm text-ink-3">
                            Sign in with your mobile number. No password to remember.
                        </p>
                    </div>

                    {/* Specialty preview doubles as proof the catalogue is real */}
                    <Card className="p-5 shadow-md">
                        <p className="text-sm font-semibold text-ink-3">What do you need help with?</p>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {SPECIALTIES.slice(0, 6).map(({ key, label, blurb, icon: Icon }) => (
                                <Link
                                    key={key}
                                    href="/auth"
                                    className="group rounded-[14px] border border-line p-3.5 hover:border-brand-300 hover:bg-brand-50/50 transition-colors"
                                >
                                    <Icon size={20} className="text-brand-500" />
                                    <p className="mt-2.5 font-semibold text-[15px] text-ink leading-tight">
                                        {label}
                                    </p>
                                    <p className="mt-0.5 text-xs text-ink-3 leading-snug">{blurb}</p>
                                </Link>
                            ))}
                        </div>
                        <p className="mt-4 text-center text-sm text-ink-3">
                            and {SPECIALTIES.length - 6} more specialties
                        </p>
                    </Card>
                </div>
            </section>

            {/* How it works */}
            <section className="border-y border-line bg-surface">
                <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
                    <h2 className="font-display text-3xl md:text-4xl font-extrabold text-ink">
                        Four steps, start to confirmed
                    </h2>
                    <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {STEPS.map(({ icon: Icon, title, body }, index) => (
                            <div key={title}>
                                <div className="flex items-center gap-3">
                                    <span className="grid place-items-center size-9 rounded-full bg-brand-500 text-white font-bold text-sm tabular">
                                        {index + 1}
                                    </span>
                                    <Icon size={20} className="text-brand-400" />
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
                                <p className="mt-1.5 text-ink-3 leading-relaxed">{body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Everything else */}
            <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
                <div className="grid gap-5 md:grid-cols-3">
                    {ALSO.map(({ icon: Icon, title, body }) => (
                        <Card key={title} className="p-6">
                            <Icon
                                size={22}
                                className={title === 'Emergency, 24/7' ? 'text-emergency-500' : 'text-brand-500'}
                            />
                            <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
                            <p className="mt-1.5 text-ink-3 leading-relaxed">{body}</p>
                        </Card>
                    ))}
                </div>

                <Card className="mt-12 p-8 md:p-12 bg-brand-500 border-brand-500 text-center">
                    <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white">
                        Ready when you are
                    </h2>
                    <p className="mt-3 text-brand-100 max-w-md mx-auto">
                        Takes about a minute. All you need is your mobile number.
                    </p>
                    <div className="mt-7 flex justify-center">
                        <ButtonLink href="/auth" size="lg" variant="secondary">
                            Get started
                            <ArrowRight size={18} />
                        </ButtonLink>
                    </div>
                </Card>
            </section>

            <footer className="border-t border-line bg-surface">
                <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
                    <Logo tagline />
                    <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-3">
                        <Link href="/help" className="hover:text-brand-600">Help</Link>
                        <Link href="/contact" className="hover:text-brand-600">Contact us</Link>
                        <Link href="/emergency" className="hover:text-brand-600">Emergency</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
