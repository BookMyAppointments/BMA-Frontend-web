'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, FlaskConical, ArrowRight, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Card } from '@/components/ui';
import { useSession } from '@/context/sessionProvider';

const OPTIONS = [
    {
        href: '/admin/hospital/create',
        icon: Building2,
        title: 'Register a hospital',
        body: 'List your hospital, its doctors and departments. A super admin reviews it before it goes live to patients.',
    },
    {
        href: '/admin/labs/create',
        icon: FlaskConical,
        title: 'Register a lab',
        body: 'List a diagnostic lab, on its own or under an existing hospital. Reviewed before it becomes bookable.',
    },
];

export default function RegisterPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useSession();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) router.replace('/auth?next=/register');
    }, [isLoading, isAuthenticated, router]);

    return (
        <div className="min-h-screen bg-canvas flex flex-col">
            <header className="px-5 h-16 flex items-center">
                <Link href="/" className="inline-flex">
                    <Logo />
                </Link>
            </header>

            <main className="flex-1 flex items-start justify-center px-5 pb-16 pt-4 sm:pt-10">
                <div className="w-full max-w-lg">
                    <h1 className="font-display text-2xl font-extrabold text-ink">
                        List your hospital or lab
                    </h1>
                    <p className="mt-1.5 text-ink-3">
                        Submit your details once. A super admin reviews and approves
                        before patients can find or book you.
                    </p>

                    <div className="mt-7 space-y-3">
                        {OPTIONS.map(({ href, icon: Icon, title, body }) => (
                            <Link
                                key={href}
                                href={href}
                                className="group flex items-start gap-4 rounded-[16px] border border-line bg-surface p-5 hover:border-brand-300 transition-colors"
                            >
                                <span className="grid place-items-center size-12 rounded-full bg-brand-50 text-brand-500 shrink-0">
                                    <Icon size={22} />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="flex items-center gap-2 font-bold text-ink group-hover:text-brand-700">
                                        {title}
                                        <ArrowRight size={16} className="text-ink-4 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-transform" />
                                    </span>
                                    <span className="block mt-1 text-sm text-ink-3 leading-relaxed">
                                        {body}
                                    </span>
                                </span>
                            </Link>
                        ))}
                    </div>

                    <Card className="mt-6 p-4 flex items-start gap-3 border-brand-100 bg-brand-50">
                        <ShieldCheck size={18} className="text-brand-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-ink-2">
                            Nothing you submit is visible to patients until a super admin
                            approves it. You&rsquo;ll be able to manage it as its admin
                            once approved.
                        </p>
                    </Card>
                </div>
            </main>
        </div>
    );
}
