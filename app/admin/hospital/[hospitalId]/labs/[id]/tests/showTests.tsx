'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, FlaskConical, Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';

interface Test {
  id: string;
  name: string;
  description: string;
  price: number;
  sampleType: string;
  duration: string;
}

export default function LabTestsPage() {
  const { id, hospitalId } = useParams<{ id: string; hospitalId: string }>();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/tests/lab/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (!res.ok) throw new Error('Failed to fetch tests');
        const data = await res.json();
        setTests(data);
      } catch (err) {
        toast.error('Could not load tests');
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
            <FlaskConical className="text-blue-600" size={28} />
            Lab Tests
          </h1>
         
        </div>
        {tests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FlaskConical className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tests Found</h3>
            <p className="text-gray-600">Start by adding a new test to this lab.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test) => (
             <Link href={`/admin/hospital/${hospitalId}/labs/${id}/tests/${test.id}`}>
              <div
                className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{test.name}</h2>
                  <p className="text-gray-600 text-sm">{test.description}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-700">
                    <span>Sample: {test.sampleType}</span>
                    <span>Duration: {test.duration}</span>
                  </div>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="text-blue-600 font-bold text-lg">₹{test.price}</span>
                </div>
              </div>
             </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}