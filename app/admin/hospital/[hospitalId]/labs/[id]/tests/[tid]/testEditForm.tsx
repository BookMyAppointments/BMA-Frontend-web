'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

export default function TestEditPage() {
  const { hospitalId, id, tid } = useParams<{
    hospitalId: string;
    id: string;
    tid: string;
  }>();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    homeSample: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/tests/get/${tid}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        if (!res.ok) throw new Error('Failed to fetch test');
        const data = await res.json();
        setForm({
          name: data.name || '',
          category: data.category || '',
          price: data.price?.toString() || '',
          homeSample: !!data.homeSample,
        });
      } catch {
        toast.error('Could not load test details');
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [tid]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/tests/${tid}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            name: form.name,
            category: form.category,
            price: parseFloat(form.price),
            homeSample: form.homeSample,
            id,
          }),
        }
      );
      if (!res.ok) throw new Error('Failed to update test');
      toast.success('Test updated!');
      router.push(`/admin/hospital/${hospitalId}/labs/${id}/tests`);
    } catch {
      toast.error('Could not update test');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Test</h2>
        <div>
          <label className="block text-gray-700 mb-1">Test Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min={0}
            step="0.01"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="homeSample"
            checked={form.homeSample}
            onChange={handleChange}
            id="homeSample"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="homeSample" className="text-gray-700">
            Home Sample Collection Available
          </label>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          {saving && <Loader2 className="animate-spin" size={18} />}
          Save Changes
        </button>
      </form>
    </div>
  );
}