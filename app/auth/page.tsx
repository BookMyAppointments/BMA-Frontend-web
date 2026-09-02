'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Button, Card, Field, Input, Select } from '@/components/ui';
import { ApiError, requestOtp, saveProfile, setToken, verifyOtp } from '@/services/api';
import { useSession } from '@/context/sessionProvider';
import { BLOOD_GROUPS } from '@/lib/domain';

type Step = 'phone' | 'code' | 'profile';

/** Only ever redirect within our own app -- never follow an external URL. */
function safeNext(raw: string | null): string {
    if (raw && raw.startsWith('/') && !raw.startsWith('//')) return raw;
    return '/home';
}

/**
 * useSearchParams() opts a route out of static prerendering unless it sits
 * behind a Suspense boundary, so the page shell below wraps this.
 */
function AuthFlow() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = safeNext(searchParams?.get('next') ?? null);
    const { refresh } = useSession();

    const [step, setStep] = useState<Step>('phone');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [devCode, setDevCode] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [secondsLeft, setSecondsLeft] = useState(0);

    const [profile, setProfile] = useState({
        name: '',
        dob: '',
        gender: '',
        bloodGroup: '',
        heightCm: '',
        weightKg: '',
    });

    const codeInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (step === 'code') codeInputRef.current?.focus();
    }, [step]);

    // Resend cooldown
    useEffect(() => {
        if (secondsLeft <= 0) return;
        const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [secondsLeft]);

    const digits = phone.replace(/\D/g, '');
    const phoneValid = digits.length >= 10;

    async function sendCode() {
        setBusy(true);
        setError(null);
        try {
            const result = await requestOtp(phone);
            setDevCode(result.devCode ?? null);
            setSecondsLeft(30);
            setStep('code');
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Could not send the code. Try again.');
        } finally {
            setBusy(false);
        }
    }

    async function confirmCode() {
        setBusy(true);
        setError(null);
        try {
            const result = await verifyOtp(phone, code);
            setToken(result.token);
            if (result.profileComplete) {
                await refresh();
                router.replace(next);
            } else {
                setStep('profile');
            }
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Could not verify the code.');
        } finally {
            setBusy(false);
        }
    }

    async function submitProfile() {
        setBusy(true);
        setError(null);
        try {
            await saveProfile({
                name: profile.name,
                dob: profile.dob || undefined,
                gender: profile.gender || undefined,
                bloodGroup: profile.bloodGroup || undefined,
                heightCm: profile.heightCm || undefined,
                weightKg: profile.weightKg || undefined,
            });
            await refresh();
            router.replace(next);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Could not save your details.');
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
                {/* Column wrapper: main is a flex row, so the card and the footer
                    line below it must share a single child to stack. */}
                <div className="w-full max-w-md">
                <Card className="p-6 sm:p-8 shadow-sm">
                    {step === 'phone' && (
                        <>
                            <h1 className="font-display text-2xl font-extrabold text-ink">
                                Sign in
                            </h1>
                            <p className="mt-1.5 text-ink-3">
                                We will text you a 6-digit code. No password needed.
                            </p>

                            <form
                                className="mt-7 space-y-5"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (phoneValid) sendCode();
                                }}
                            >
                                <Field label="Mobile number" htmlFor="phone" error={error ?? undefined}>
                                    <div className="flex items-center gap-2">
                                        <span className="h-12 px-3 grid place-items-center rounded-[12px] border border-line-strong bg-canvas text-ink-2 font-semibold shrink-0">
                                            +91
                                        </span>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            inputMode="numeric"
                                            autoComplete="tel"
                                            placeholder="98765 43210"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="tabular"
                                        />
                                    </div>
                                </Field>

                                <Button type="submit" size="lg" fullWidth loading={busy} disabled={!phoneValid}>
                                    Send code
                                    <ArrowRight size={18} />
                                </Button>
                            </form>
                        </>
                    )}

                    {step === 'code' && (
                        <>
                            <button
                                type="button"
                                onClick={() => { setStep('phone'); setCode(''); setError(null); }}
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-3 hover:text-ink"
                            >
                                <ArrowLeft size={16} />
                                Change number
                            </button>

                            <h1 className="mt-5 font-display text-2xl font-extrabold text-ink">
                                Enter the code
                            </h1>
                            <p className="mt-1.5 text-ink-3">
                                Sent to <span className="font-semibold text-ink-2 tabular">+91 {digits.slice(-10)}</span>
                            </p>

                            {devCode && (
                                <div className="mt-5 flex items-start gap-2.5 rounded-[12px] border border-warning-100 bg-warning-100 p-3.5">
                                    <ShieldCheck size={18} className="text-warning-500 shrink-0 mt-0.5" />
                                    <p className="text-sm text-warning-500">
                                        SMS is not configured on this environment, so here is your code:{' '}
                                        <span className="font-bold tabular">{devCode}</span>
                                    </p>
                                </div>
                            )}

                            <form
                                className="mt-6 space-y-5"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (code.length === 6) confirmCode();
                                }}
                            >
                                <Field label="6-digit code" htmlFor="code" error={error ?? undefined}>
                                    <Input
                                        ref={codeInputRef}
                                        id="code"
                                        name="code"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={6}
                                        placeholder="000000"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                        className="tabular text-center text-2xl font-bold tracking-[0.4em]"
                                    />
                                </Field>

                                <Button type="submit" size="lg" fullWidth loading={busy} disabled={code.length !== 6}>
                                    Verify and continue
                                </Button>

                                <button
                                    type="button"
                                    disabled={secondsLeft > 0 || busy}
                                    onClick={sendCode}
                                    className="w-full text-sm font-semibold text-brand-600 disabled:text-ink-4 disabled:cursor-not-allowed"
                                >
                                    {secondsLeft > 0 ? `Resend code in ${secondsLeft}s` : 'Resend code'}
                                </button>
                            </form>
                        </>
                    )}

                    {step === 'profile' && (
                        <>
                            <div className="inline-flex items-center gap-2 h-7 px-2.5 rounded-full bg-success-100 text-success-500 text-sm font-semibold">
                                <Check size={15} />
                                Number verified
                            </div>

                            <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">
                                A few details
                            </h1>
                            <p className="mt-1.5 text-ink-3">
                                Doctors see this when you book. You can change it any time.
                            </p>

                            <form
                                className="mt-6 space-y-4"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (profile.name.trim()) submitProfile();
                                }}
                            >
                                <Field label="Full name" htmlFor="name" error={error ?? undefined}>
                                    <Input
                                        id="name"
                                        autoComplete="name"
                                        placeholder="Your name"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    />
                                </Field>

                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Date of birth" htmlFor="dob">
                                        <Input
                                            id="dob"
                                            type="date"
                                            max={new Date().toISOString().split('T')[0]}
                                            value={profile.dob}
                                            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                                        />
                                    </Field>
                                    <Field label="Gender" htmlFor="gender">
                                        <Select
                                            id="gender"
                                            value={profile.gender}
                                            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                                        >
                                            <option value="">Select</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </Select>
                                    </Field>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <Field label="Blood group" htmlFor="bloodGroup">
                                        <Select
                                            id="bloodGroup"
                                            value={profile.bloodGroup}
                                            onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                                        >
                                            <option value="">—</option>
                                            {BLOOD_GROUPS.map((group) => (
                                                <option key={group.value} value={group.value}>
                                                    {group.label}
                                                </option>
                                            ))}
                                        </Select>
                                    </Field>
                                    <Field label="Height" htmlFor="heightCm" hint="cm">
                                        <Input
                                            id="heightCm"
                                            inputMode="numeric"
                                            placeholder="170"
                                            value={profile.heightCm}
                                            onChange={(e) => setProfile({ ...profile, heightCm: e.target.value })}
                                            className="tabular"
                                        />
                                    </Field>
                                    <Field label="Weight" htmlFor="weightKg" hint="kg">
                                        <Input
                                            id="weightKg"
                                            inputMode="numeric"
                                            placeholder="65"
                                            value={profile.weightKg}
                                            onChange={(e) => setProfile({ ...profile, weightKg: e.target.value })}
                                            className="tabular"
                                        />
                                    </Field>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    fullWidth
                                    loading={busy}
                                    disabled={!profile.name.trim()}
                                    className="!mt-6"
                                >
                                    Continue
                                    <ArrowRight size={18} />
                                </Button>
                            </form>
                        </>
                    )}
                </Card>

                {step === 'phone' && (
                    <p className="mt-5 text-center text-sm text-ink-3">
                        Hospital staff?{' '}
                        <Link href="/staff" className="font-semibold text-brand-600">
                            Sign in here
                        </Link>
                    </p>
                )}
                </div>
            </main>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-canvas flex flex-col">
                    <header className="px-5 h-16 flex items-center">
                        <Logo />
                    </header>
                    <main className="flex-1 flex items-start justify-center px-5 pb-16 pt-4 sm:pt-10">
                        <Card className="w-full max-w-md p-6 sm:p-8 shadow-sm">
                            <div className="h-6 w-24 rounded bg-line animate-pulse" />
                            <div className="mt-4 h-4 w-56 rounded bg-line animate-pulse" />
                            <div className="mt-8 h-12 w-full rounded-[12px] bg-line animate-pulse" />
                            <div className="mt-5 h-14 w-full rounded-[14px] bg-line animate-pulse" />
                        </Card>
                    </main>
                </div>
            }
        >
            <AuthFlow />
        </Suspense>
    );
}
