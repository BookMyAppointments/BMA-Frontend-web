'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Check } from 'lucide-react';
import { Button, Card, Field, Input, Select } from '@/components/ui';
import { useSession } from '@/context/sessionProvider';
import { ApiError, saveProfile } from '@/services/api';
import { ageFromDob, BLOOD_GROUPS, bloodGroupLabel } from '@/lib/domain';

export default function ProfilePage() {
    const { user, refresh, isLoading } = useSession();
    const [busy, setBusy] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        dob: '',
        gender: '',
        bloodGroup: '',
        heightCm: '',
        weightKg: '',
        address: '',
    });

    // Hydrate once the session lands.
    useEffect(() => {
        if (!user) return;
        setForm({
            name: user.name ?? '',
            // Placeholder emails are generated at OTP signup; don't show them as real.
            email: user.email?.endsWith('@phone.bookmyappointments.local') ? '' : (user.email ?? ''),
            dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
            gender: user.gender ?? '',
            bloodGroup: user.bloodGroup ?? '',
            heightCm: user.heightCm != null ? String(user.heightCm) : '',
            weightKg: user.weightKg != null ? String(user.weightKg) : '',
            address: user.address ?? '',
        });
    }, [user]);

    async function submit(event: React.FormEvent) {
        event.preventDefault();
        setBusy(true);
        try {
            await saveProfile({
                name: form.name,
                email: form.email || undefined,
                dob: form.dob || undefined,
                gender: form.gender || undefined,
                bloodGroup: form.bloodGroup || undefined,
                heightCm: form.heightCm || undefined,
                weightKg: form.weightKg || undefined,
                address: form.address,
            });
            await refresh();
            toast.success('Profile saved');
        } catch (error) {
            toast.error(error instanceof ApiError ? error.message : 'Could not save your profile.');
        } finally {
            setBusy(false);
        }
    }

    const age = ageFromDob(form.dob || user?.dob);

    return (
        <div className="space-y-5">
            <h1 className="font-display text-2xl font-extrabold text-ink">My profile</h1>

            {/* Vitals summary, the thing a doctor asks for first */}
            <Card className="p-4">
                <dl className="grid grid-cols-4 gap-2 text-center">
                    {[
                        { label: 'Age', value: age != null ? String(age) : '—' },
                        { label: 'Blood', value: bloodGroupLabel(form.bloodGroup) ?? '—' },
                        { label: 'Height', value: form.heightCm ? `${form.heightCm} cm` : '—' },
                        { label: 'Weight', value: form.weightKg ? `${form.weightKg} kg` : '—' },
                    ].map((stat) => (
                        <div key={stat.label} className="rounded-[12px] bg-canvas py-3">
                            <dd className="font-bold text-ink tabular leading-none">{stat.value}</dd>
                            <dt className="mt-1.5 text-[11px] text-ink-3">{stat.label}</dt>
                        </div>
                    ))}
                </dl>
            </Card>

            <Card className="p-4 sm:p-5">
                <form onSubmit={submit} className="space-y-4">
                    <Field label="Full name" htmlFor="name">
                        <Input
                            id="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            disabled={isLoading}
                        />
                    </Field>

                    <Field label="Mobile number" htmlFor="phone" hint="Used to sign in. Contact support to change it.">
                        <Input id="phone" value={user?.phone ?? ''} readOnly disabled className="tabular" />
                    </Field>

                    <Field label="Email" htmlFor="email" hint="Optional. For receipts and reports.">
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Date of birth" htmlFor="dob">
                            <Input
                                id="dob"
                                type="date"
                                max={new Date().toISOString().split('T')[0]}
                                value={form.dob}
                                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                            />
                        </Field>
                        <Field label="Gender" htmlFor="gender">
                            <Select
                                id="gender"
                                value={form.gender}
                                onChange={(e) => setForm({ ...form, gender: e.target.value })}
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
                                value={form.bloodGroup}
                                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
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
                                value={form.heightCm}
                                onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
                                className="tabular"
                            />
                        </Field>
                        <Field label="Weight" htmlFor="weightKg" hint="kg">
                            <Input
                                id="weightKg"
                                inputMode="numeric"
                                value={form.weightKg}
                                onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                                className="tabular"
                            />
                        </Field>
                    </div>

                    <Field label="Address" htmlFor="address" hint="Optional. Helps with home sample collection.">
                        <Input
                            id="address"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                        />
                    </Field>

                    <Button type="submit" size="lg" fullWidth loading={busy} className="!mt-6">
                        <Check size={18} />
                        Save changes
                    </Button>
                </form>
            </Card>
        </div>
    );
}
