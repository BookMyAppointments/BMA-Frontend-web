'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, clearToken, getToken } from '@/services/api';

export interface SessionUser {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: 'NORMAL' | 'ADMIN' | 'SUPERADMIN';
    picture: string | null;
    gender: string | null;
    dob: string | null;
    address: string | null;
    bloodGroup: string | null;
    heightCm: number | null;
    weightKg: number | null;
}

interface SessionContextValue {
    user: SessionUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    /** A signed-in user who has not filled in name + date of birth yet. */
    profileComplete: boolean;
    refresh: () => Promise<void>;
    logout: () => void;
}

const SessionContext = createContext<SessionContextValue>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    profileComplete: false,
    refresh: async () => {},
    logout: () => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<SessionUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = useCallback(async () => {
        if (!getToken()) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const profile = await api<SessionUser>('/auth/profile');
            setUser(profile);
        } catch (error) {
            // A rejected token is a signed-out user, not an app error.
            if (typeof error === 'object' && error && 'status' in error && (error as { status: number }).status === 401) {
                clearToken();
            }
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const logout = useCallback(() => {
        clearToken();
        setUser(null);
        window.location.href = '/';
    }, []);

    return (
        <SessionContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: Boolean(user),
                profileComplete: Boolean(user?.name && user?.dob),
                refresh,
                logout,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
}

export const useSession = () => useContext(SessionContext);
