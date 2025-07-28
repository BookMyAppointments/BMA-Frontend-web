'use client'
import { type FC, useEffect, useState } from 'react'
import TestBanner from '../components/TestBanner';
import TestInfo from '../components/TestInfo';
import { API_BASE_URL } from '@/services/api'
import { useParams } from 'next/navigation';

interface Test {
    id: string;
    name: string;
    category: string;
    price: number;
    homeSample: boolean;
    labId: string;
    description?: string;
    preparation?: string;
    reportTime?: string;
    lab?: {
        id: string;
        name: string;
        location: {
            address: string;
            lat: number;
            lng: number;
        };
    };
}

const TestDetails: FC = () => {
    const params = useParams();
    const id = params && typeof params.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;
    const [test, setTest] = useState<Test | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchTest = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${API_BASE_URL}/tests/get/${id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch test details');
                }
                const data = await response.json();
                setTest(data);
            } catch (err) {
                console.error('Error fetching test data:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch test details');
            } finally {
                setLoading(false);
            }
        };

        fetchTest();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <div className="flex-1 flex justify-center items-center">
                    <div className="text-center">
                        <div className="text-red-500 text-2xl mb-4">⚠️</div>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!test) {
        return (
            <div className="min-h-screen flex flex-col">
                <div className="flex-1 flex justify-center items-center">
                    <div className="text-center">
                        <p className="text-gray-600">Test not found</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <TestBanner test={test} />
            <TestInfo test={test} />
        </div>
    );
}

export default TestDetails