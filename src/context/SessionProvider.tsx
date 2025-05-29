import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";

interface Profile {
    id: string;
    userId: string;
    gender: string;
    dob: string | null;
    address: string;
}

interface User {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: string;
    verified: boolean;
    profile: Profile;
}

interface SessionContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    logout: () => void;
    refresh: () => void;
}

const SessionContext = createContext<SessionContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    logout: () => { },
    refresh: () => { }
});

export function SessionProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/auth/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUser(response.data);
        } catch (error) {
            console.log(error);
            localStorage.removeItem("token");
        } finally {
            setIsLoading(false);
        }
    };

    const refresh = async () => {
        fetchUserProfile();
    }

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <SessionContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                logout,
                refresh
            }}
        >
            {children}
        </SessionContext.Provider>
    );
}

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};