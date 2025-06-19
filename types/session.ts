import { User } from "./doctor";

export interface SessionContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    logout: () => void;
    refresh: () => void;
}