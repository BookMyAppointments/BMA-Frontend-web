'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Send, Phone, Mail } from 'lucide-react';
import { Button, Card, Field, Input } from '@/components/ui';
import { useSession } from '@/context/sessionProvider';
import { api, ApiError } from '@/services/api';

export default function ContactPage() {
    const { user } = useSession();
    const [busy, setBusy] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    useEffect(() => {
        if (!user) return;
        setForm((current) => ({
            ...current,
            name: current.name || user.name || '',
            email:
                current.email ||
                (user.email?.endsWith('@phone.bookmyappointments.local') ? '' : user.email || ''),
        }));
    }, [user]);

    const complete =
        form.name.trim() && form.email.trim() && form.subject.trim() && form.message.trim();

    async function submit(event: React.FormEvent) {
        event.preventDefault();
        setBusy(true);
        try {
            await api('/contact/send', { method: 'POST', body: form, auth: false });
            toast.success('Message sent. We will get back to you.');
            setForm({ ...form, subject: '', message: '' });
        } catch (error) {
            toast.error(error instanceof ApiError ? error.message : 'Could not send your message.');
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="space-y-5">
            <div>
                <h1 className="font-display text-2xl font-extrabold text-ink">Contact us</h1>
                <p className="mt-1 text-ink-3">
                    Questions about a booking, a refund, or anything else.
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <a
                    href="tel:+911800000000"
                    className="flex items-center gap-3 rounded-[16px] border border-line bg-surface p-4 hover:border-brand-300"
                >
                    <span className="grid place-items-center size-10 rounded-full bg-brand-50 text-brand-500 shrink-0">
                        <Phone size={18} />
                    </span>
                    <span>
                        <span className="block text-[13px] text-ink-3">Call support</span>
                        <span className="block font-bold text-ink tabular">1800 000 000</span>
                    </span>
                </a>
                <a
                    href="mailto:support@bookmyappointments.in"
                    className="flex items-center gap-3 rounded-[16px] border border-line bg-surface p-4 hover:border-brand-300"
                >
                    <span className="grid place-items-center size-10 rounded-full bg-brand-50 text-brand-500 shrink-0">
                        <Mail size={18} />
                    </span>
                    <span className="min-w-0">
                        <span className="block text-[13px] text-ink-3">Email us</span>
                        <span className="block font-bold text-ink truncate">
                            support@bookmyappointments.in
                        </span>
                    </span>
                </a>
            </div>

            <Card className="p-4 sm:p-5">
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-3">
                        <Field label="Your name" htmlFor="name">
                            <Input
                                id="name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </Field>
                        <Field label="Email" htmlFor="email">
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </Field>
                    </div>

                    <Field label="Subject" htmlFor="subject">
                        <Input
                            id="subject"
                            placeholder="What is this about?"
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        />
                    </Field>

                    <Field label="Message" htmlFor="message">
                        <textarea
                            id="message"
                            rows={5}
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            placeholder="Tell us what happened"
                            className="w-full px-4 py-3 rounded-[12px] bg-surface border border-line-strong text-ink placeholder:text-ink-4 focus:border-brand-500 outline-none resize-y"
                        />
                    </Field>

                    <Button type="submit" size="lg" fullWidth loading={busy} disabled={!complete}>
                        <Send size={17} />
                        Send message
                    </Button>
                </form>
            </Card>
        </div>
    );
}
