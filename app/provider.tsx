import { SessionProvider } from '@/context/sessionProvider';
import { ServiceProvider } from '@/context/serviceProvider';
import { ReactQueryProvider } from "@/context/queryProvider"

import Navbar from '@/components/layout/navbar';
import MobileNavbar from '@/components/layout/mobile-navbar';
import Footer from '@/components/layout/footer';

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <ReactQueryProvider >
            <SessionProvider>
                <ServiceProvider>
                    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">

                        <div className="block lg:hidden sticky top-0 z-30 bg-white">
                            <MobileNavbar />
                        </div>
                        <div className="hidden lg:block">
                            <Navbar />
                        </div>
                        {children}
                        <Footer />
                    </div>
                </ServiceProvider>
            </SessionProvider >
        </ReactQueryProvider>
    );
}