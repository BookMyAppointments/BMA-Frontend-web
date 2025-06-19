import { ShieldAlert, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';

const UnAuthorized = () => {
    const [isRequesting, setIsRequesting] = useState(false);

    const handleRequestInvitation = async () => {
        try {
            setIsRequesting(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/admin-request-create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to request invitation');
            }

            toast.success('Invitation request sent successfully! We will notify you once approved.');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to request invitation';
            toast.error(errorMessage);
        } finally {
            setIsRequesting(false);
        }
    };

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
                    <button
                        onClick={handleRequestInvitation}
                        disabled={isRequesting}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isRequesting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Requesting...
                            </>
                        ) : (
                            'Request Invitation'
                        )}
                    </button>

                    <Link 
                        href="/admin/dashboard"
                        className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Return to Dashboard
                    </Link>
                    
                    <Link 
                        href="/support"
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