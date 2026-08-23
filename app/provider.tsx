import { SessionProvider } from '@/context/sessionProvider';
import { ReactQueryProvider } from '@/context/queryProvider';

/**
 * Global data providers only. App chrome (header, bottom nav) lives in the
 * (app) route group layout so the landing page, auth flow, and admin screens
 * are not forced to wear the patient navigation.
 */
export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <ReactQueryProvider>
            <SessionProvider>{children}</SessionProvider>
        </ReactQueryProvider>
    );
}
