'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
    ArrowLeft, CalendarDays, MapPin, CreditCard, Building2, Check, ShieldCheck, Loader2,
} from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { Button, Card, EmptyState, Skeleton } from '@/components/ui';
import {
    api, ApiError, createAppointment, createPaymentOrder, fetchDoctorById, fetchPaymentMethods,
} from '@/services/api';
import { formatDateTime, rupees } from '@/lib/domain';
import { cn } from '@/lib/utils';

type Method = 'RAZORPAY' | 'PAY_AT_HOSPITAL';

declare global {
    interface Window {
        Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
    }
}

export default function BookingPaymentPage() {
    const params = useParams<{ doctorId: string }>();
    const searchParams = useSearchParams();
    const router = useRouter();

    const doctorId = params?.doctorId;
    const slot = searchParams.get('slot');

    const [method, setMethod] = useState<Method | null>(null);
    const [busy, setBusy] = useState(false);

    const { data: doctor, isLoading } = useQuery({
        queryKey: ['doctor', doctorId],
        queryFn: () => fetchDoctorById(doctorId!),
        enabled: Boolean(doctorId),
    });

    const { data: methods } = useQuery({
        queryKey: ['payment-methods'],
        queryFn: fetchPaymentMethods,
    });

    // Default to whatever this deployment can actually do.
    const onlineAvailable = methods?.online ?? false;
    const effectiveMethod: Method = method ?? (onlineAvailable ? 'RAZORPAY' : 'PAY_AT_HOSPITAL');

    async function confirmBooking() {
        if (!doctor || !slot) return;
        setBusy(true);

        try {
            // 1. Hold the slot.
            const appointment = await createAppointment({
                doctorId: doctor.id,
                scheduledAt: slot,
            });

            // 2. Attach a payment to it.
            const order = await createPaymentOrder({
                appointmentId: appointment.id,
                amount: doctor.price,
                method: effectiveMethod,
            });

            // 3. Pay at hospital is done: the backend already sent the confirmation.
            if (!order.requiresCheckout) {
                router.replace(`/booking/${appointment.id}`);
                return;
            }

            // 4. Online: hand off to Razorpay checkout.
            const checkout = order.checkout!;
            const loaded = await loadRazorpay();
            if (!loaded || !window.Razorpay) {
                toast.error('Could not open the payment window. Choose pay at hospital instead.');
                setBusy(false);
                return;
            }

            const razorpay = new window.Razorpay({
                key: checkout.key,
                order_id: checkout.orderId,
                amount: checkout.amount,
                currency: checkout.currency,
                name: 'BookMyAppointments',
                description: `Consultation with ${doctor.name}`,
                handler: async (response: Record<string, string>) => {
                    try {
                        await api('/payment/verify', {
                            method: 'POST',
                            body: {
                                paymentId: order.payment.id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            },
                        });
                        router.replace(`/booking/${appointment.id}`);
                    } catch (error) {
                        toast.error(
                            error instanceof ApiError ? error.message : 'Payment could not be verified.'
                        );
                        setBusy(false);
                    }
                },
                modal: {
                    ondismiss: () => setBusy(false),
                },
                theme: { color: '#0D7A6F' },
            });

            razorpay.open();
        } catch (error) {
            toast.error(error instanceof ApiError ? error.message : 'Could not complete the booking.');
            setBusy(false);
        }
    }

    if (!slot) {
        return (
            <EmptyState
                title="No time selected"
                body="Pick a slot on the doctor's page first."
                action={
                    <Link href={`/doctor/${doctorId}`} className="font-semibold text-brand-600">
                        Choose a time
                    </Link>
                }
            />
        );
    }

    if (isLoading || !doctor) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-28 w-full rounded-[18px]" />
                <Skeleton className="h-40 w-full rounded-[18px]" />
            </div>
        );
    }

    return (
        <div className="space-y-5 pb-40">
            <Link
                href={`/doctor/${doctorId}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-3 hover:text-ink"
            >
                <ArrowLeft size={16} />
                Change time
            </Link>

            <h1 className="font-display text-2xl font-extrabold text-ink">Confirm and pay</h1>

            {/* What you are booking */}
            <Card className="p-4">
                <div className="flex gap-3.5">
                    <ImageWithFallback
                        src={doctor.picture || '/doctors/doctor1.png'}
                        alt=""
                        width={56}
                        height={56}
                        unoptimized
                        className="size-14 rounded-full object-cover bg-canvas shrink-0"
                    />
                    <div className="min-w-0">
                        <h2 className="font-bold text-ink leading-tight">{doctor.name}</h2>
                        <p className="text-sm text-ink-3">{doctor.specialization?.join(', ')}</p>
                    </div>
                </div>

                <dl className="mt-4 pt-4 border-t border-line space-y-2.5 text-sm">
                    <div className="flex items-start gap-2.5">
                        <CalendarDays size={16} className="text-brand-500 shrink-0 mt-0.5" />
                        <div>
                            <dt className="text-ink-3">When</dt>
                            <dd className="font-semibold text-ink">{formatDateTime(new Date(slot))}</dd>
                        </div>
                    </div>
                    {doctor.hospital && (
                        <div className="flex items-start gap-2.5">
                            <MapPin size={16} className="text-brand-500 shrink-0 mt-0.5" />
                            <div>
                                <dt className="text-ink-3">Where</dt>
                                <dd className="font-semibold text-ink">{doctor.hospital.name}</dd>
                                {doctor.hospital.location?.address && (
                                    <dd className="text-ink-3">{doctor.hospital.location.address}</dd>
                                )}
                            </div>
                        </div>
                    )}
                </dl>
            </Card>

            {/* How you want to pay */}
            <section>
                <h2 className="text-lg font-bold text-ink mb-3">Payment</h2>
                <div className="space-y-2.5">
                    <PaymentOption
                        icon={CreditCard}
                        title="Pay now, online"
                        body={
                            onlineAvailable
                                ? 'Card, UPI or netbanking via Razorpay'
                                : 'Not enabled on this environment yet'
                        }
                        selected={effectiveMethod === 'RAZORPAY'}
                        disabled={!onlineAvailable}
                        onSelect={() => setMethod('RAZORPAY')}
                    />
                    <PaymentOption
                        icon={Building2}
                        title="Pay at the hospital"
                        body="Your slot is held. Pay at the reception when you arrive."
                        selected={effectiveMethod === 'PAY_AT_HOSPITAL'}
                        onSelect={() => setMethod('PAY_AT_HOSPITAL')}
                    />
                </div>
            </section>

            <Card className="p-4">
                <div className="flex items-center justify-between">
                    <span className="text-ink-2">Consultation fee</span>
                    <span className="font-bold text-lg text-ink tabular">{rupees(doctor.price)}</span>
                </div>
                <p className="mt-2.5 flex items-start gap-2 text-[13px] text-ink-3">
                    <ShieldCheck size={15} className="shrink-0 mt-0.5 text-brand-500" />
                    You will get a confirmation on WhatsApp with the address and time.
                </p>
            </Card>

            <div className="fixed bottom-16 inset-x-0 z-30 border-t border-line bg-surface/95 backdrop-blur pb-safe">
                <div className="mx-auto max-w-5xl px-4 py-3">
                    <Button size="lg" fullWidth loading={busy} onClick={confirmBooking}>
                        {busy
                            ? 'Booking…'
                            : effectiveMethod === 'RAZORPAY'
                              ? `Pay ${rupees(doctor.price)}`
                              : 'Confirm booking'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function PaymentOption({
    icon: Icon,
    title,
    body,
    selected,
    disabled,
    onSelect,
}: {
    icon: typeof CreditCard;
    title: string;
    body: string;
    selected: boolean;
    disabled?: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            disabled={disabled}
            aria-pressed={selected}
            className={cn(
                'w-full flex items-center gap-3.5 rounded-[16px] border p-4 text-left transition-colors',
                selected ? 'border-brand-500 bg-brand-50' : 'border-line bg-surface hover:border-brand-300',
                disabled && 'opacity-55 cursor-not-allowed hover:border-line'
            )}
        >
            <Icon size={20} className={selected ? 'text-brand-600' : 'text-ink-3'} />
            <span className="flex-1 min-w-0">
                <span className="block font-semibold text-ink">{title}</span>
                <span className="block text-[13px] text-ink-3">{body}</span>
            </span>
            <span
                className={cn(
                    'grid place-items-center size-5 rounded-full border-2 shrink-0',
                    selected ? 'border-brand-500 bg-brand-500 text-white' : 'border-line-strong'
                )}
            >
                {selected && <Check size={12} strokeWidth={3} />}
            </span>
        </button>
    );
}

/** Razorpay's checkout script is only needed if the user actually pays online. */
function loadRazorpay(): Promise<boolean> {
    return new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}
