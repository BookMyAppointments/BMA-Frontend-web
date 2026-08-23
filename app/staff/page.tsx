'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Button, Card, Field, Input } from '@/components/ui';
import { ApiError, api, setToken } from '@/services/api';
import { useSession } from '@/context/sessionProvider';

/**
 * Email + password sign-in for hospital admins and super admins.
 *
 * Patients sign in by phone OTP (/auth). Staff accounts are provisioned by a
 * super admin, not self-registered, so email + password fits better here —
 * there is no "forgot my OTP" problem for an account someone else set up.
 */
export default function StaffSignInPage() {
    const router = useRouter();
    const { refresh } = useSession();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function submit(event: React.FormEvent) {
        event.preventDefault();
        setBusy(true);
        setError(null);
        try {
            const result = await api<{ token: string; user: { role: string } }>('/auth/signin', {
                method: 'POST',
                body: { email, password },
                auth: false,
            });
            setToken(result.token);
            await refresh();

            if (result.user.role === 'SUPERADMIN') router.replace('/super-admin');
            else if (result.user.role === 'ADMIN') router.replace('/admin/dashboard');
            else router.replace('/home');
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Could not sign in.');
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="min-h-screen bg-canvas flex flex-col">
            <header className="px-5 h-16 flex items-center">
                <Link href="/" className="inline-flex">
                    <Logo />
                </Link>
            </header>

            <main className="flex-1 flex items-start justify-center px-5 pb-16 pt-4 sm:pt-10">
                <Card className="w-full max-w-md p-6 sm:p-8 shadow-sm">
                    <span className="inline-grid place-items-center size-11 rounded-full bg-brand-50 text-brand-500">
                        <ShieldCheck size={20} />
                    </span>
                    <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">
                        Staff sign in
                    </h1>
                    <p className="mt-1.5 text-ink-3">
                        For hospital admins and super admins. Patients sign in{' '}
                        <Link href="/auth" className="font-semibold text-brand-600">
                            here
                        </Link>
                        .
                    </p>

                    <form className="mt-7 space-y-4" onSubmit={submit}>
                        <Field label="Email" htmlFor="email" error={error ?? undefined}>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="admin@hospital.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Field>

                        <Field label="Password" htmlFor="password">
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Field>

                        <Button
                            type="submit"
                            size="lg"
                            fullWidth
                            loading={busy}
                            disabled={!email || !password}
                            className="!mt-6"
                        >
                            Sign in
                            <ArrowRight size={18} />
                        </Button>
                    </form>
                </Card>
            </main>
        </div>
    );
}
