import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

const UnAuthorized = () => {

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <ShieldAlert className="mx-auto text-red-600 mb-4" size={48} />

                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    Unauthorized Access
                </h1>

                <p className="text-gray-600 mb-6">
                    You are not authorized to create a hospital. Please request an invitation or contact the administrator.
                </p>

                <div className="space-y-4">

                    <Link
                        href="/"
                        className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Return to HomaPage
                    </Link>

                    <Link
                        href="/help"
                        className="block w-full text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UnAuthorized;