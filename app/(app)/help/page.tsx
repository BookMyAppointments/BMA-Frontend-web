'use client';

import Link from 'next/link';
import { ChevronDown, MessageCircle, Ambulance } from 'lucide-react';
import { Card, ButtonLink } from '@/components/ui';

const FAQS = [
    {
        q: 'How do I book an appointment?',
        a: 'From the home screen, pick a specialty like Heart or Bones. You will see hospitals near you, then the doctors there. Choose a day and time, then confirm.',
    },
    {
        q: 'Do I have to pay online?',
        a: 'No. You can choose to pay at the hospital reception when you arrive. Your slot is held either way.',
    },
    {
        q: 'Where does my confirmation go?',
        a: 'To WhatsApp on the number you signed in with, including the doctor, address and time. It is also in Bookings inside the app.',
    },
    {
        q: 'Can I cancel or reschedule?',
        a: 'Open Bookings, choose the appointment, and use the options there. Cancellation rules depend on the hospital.',
    },
    {
        q: 'Why does the app ask for my location?',
        a: 'Only to sort hospitals and labs by distance from you. You can decline and still use everything, sorted by rating instead.',
    },
    {
        q: 'Where are my lab reports?',
        a: 'Under Reports. Results appear automatically once the lab uploads them.',
    },
];

export default function HelpPage() {
    return (
        <div className="space-y-5">
            <div>
                <h1 className="font-display text-2xl font-extrabold text-ink">Help</h1>
                <p className="mt-1 text-ink-3">Short answers to the usual questions.</p>
            </div>

            <Card className="p-4 flex items-center gap-3.5 border-emergency-100 bg-emergency-100">
                <Ambulance size={20} className="text-emergency-500 shrink-0" />
                <p className="flex-1 text-sm text-ink-2">
                    Medical emergency? Do not wait for a reply here.
                </p>
                <Link
                    href="/emergency"
                    className="shrink-0 h-10 px-4 inline-flex items-center rounded-full bg-emergency-500 text-white text-sm font-semibold"
                >
                    Emergency
                </Link>
            </Card>

            <div className="space-y-2.5">
                {FAQS.map((faq) => (
                    <details
                        key={faq.q}
                        className="group rounded-[16px] border border-line bg-surface overflow-hidden"
                    >
                        <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer list-none font-semibold text-ink marker:hidden">
                            {faq.q}
                            <ChevronDown
                                size={18}
                                className="shrink-0 text-ink-3 transition-transform group-open:rotate-180"
                            />
                        </summary>
                        <p className="px-4 pb-4 -mt-1 text-ink-2 leading-relaxed">{faq.a}</p>
                    </details>
                ))}
            </div>

            <Card className="p-5 text-center">
                <MessageCircle size={22} className="mx-auto text-brand-500" />
                <h2 className="mt-3 font-bold text-ink">Still stuck?</h2>
                <p className="mt-1 text-sm text-ink-3">
                    Send us the details and we will look into it.
                </p>
                <div className="mt-4 flex justify-center">
                    <ButtonLink href="/contact" variant="secondary">
                        Contact us
                    </ButtonLink>
                </div>
            </Card>
        </div>
    );
}
