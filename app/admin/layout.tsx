'use client';

import { useSession } from "@/context/sessionProvider";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {

    const { user } = useSession();

    if (!user?.role || user.role !== 'ADMIN') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600">You do not have admin privileges.</p>
                    <Link href={'/'} className='text-blue-500 hover:text-blue-600 cursor-pointer'>Home Page</Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            {children}
        </div>
    );
}