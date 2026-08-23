'use client';

import { useCallback, useEffect, useState } from 'react';

export type LocationStatus = 'idle' | 'prompting' | 'granted' | 'denied' | 'unsupported';

export interface Coords {
    lat: number;
    lng: number;
}

const STORAGE_KEY = 'bma:coords';

/**
 * Browser geolocation with the states the UI actually needs to show.
 *
 * The last known position is cached so a returning visitor sees distances
 * immediately instead of a row of "Calculating…" that never resolves when the
 * permission prompt is dismissed.
 */
export function useLocation() {
    const [coords, setCoords] = useState<Coords | null>(null);
    const [status, setStatus] = useState<LocationStatus>('idle');

    useEffect(() => {
        try {
            const cached = window.localStorage.getItem(STORAGE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached) as Coords;
                if (typeof parsed?.lat === 'number' && typeof parsed?.lng === 'number') {
                    setCoords(parsed);
                    setStatus('granted');
                }
            }
        } catch {
            /* private mode or cleared storage: fall through to asking */
        }
    }, []);

    const request = useCallback(() => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            setStatus('unsupported');
            return;
        }

        setStatus('prompting');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const next = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setCoords(next);
                setStatus('granted');
                try {
                    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                } catch {
                    /* non-fatal */
                }
            },
            () => setStatus('denied'),
            { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60 * 1000 }
        );
    }, []);

    return { coords, status, request, hasLocation: coords !== null };
}
