// components/BannerImageUploader.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '@/services/api';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

const DynamicAvatarEditor = dynamic(() => import('react-avatar-editor').then(mod => mod.default as any), {
    ssr: false,
}) as React.ComponentType<any>;

interface BannerImage {
    id: string;
    imageUrl: string;
    isActive: boolean;
}

const BannerImageUploader: React.FC = () => {
    const [images, setImages] = useState<BannerImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const editorRef = useRef<any>(null);
    const [loading, setLoading] = useState(false);
    const [scale, setScale] = useState(1.2);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchBannerImages = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/admin/get-banner-images`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setImages(res.data);
        } catch (err) {
            toast.error('Failed to fetch banner images');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async () => {
        if (!editorRef.current || !selectedImage) return;

        const canvas = editorRef.current.getImageScaledToCanvas().toDataURL();
        const blob = await (await fetch(canvas)).blob();
        const formData = new FormData();
        formData.append('file', blob, selectedImage.name);

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/file-upload/upload-admin-banner`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Banner image uploaded');
            setSelectedImage(null);
            fetchBannerImages();
        } catch (err) {
            toast.error('Upload failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateImageStatus = async (id: string, isActive: boolean) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/admin/update-banner-images`, [
                { id, isActive },
            ], {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Status updated');
            fetchBannerImages();
        } catch (err) {
            toast.error('Failed to update status');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBannerImages();
    }, []);

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Manage Banner Images</h2>
            <div className="mb-4">
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setSelectedImage(file);
                    }}
                />
                <button
                    className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors'
                    onClick={() => fileInputRef.current?.click()}>
                    Select Image
                </button>
            </div>

            {selectedImage && (
                <div className="space-y-4">
                    <DynamicAvatarEditor
                        ref={editorRef}
                        image={selectedImage}
                        width={300}
                        height={150}
                        border={10}
                        borderRadius={10}
                        scale={scale}
                        rotate={0}
                    />
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="w-full"
                    />
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        onClick={handleImageUpload} disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload Cropped Image'}
                    </button>
                </div>
            )}

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((img) => (
                    <div key={img.id} className="border rounded p-4 flex flex-col items-center">
                        <Image
                            width={300}
                            height={150}
                            unoptimized
                            src={img.imageUrl} alt="banner" className="w-full h-40 object-cover rounded" />
                        <div className="mt-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={img.isActive}
                                    onChange={(e) => updateImageStatus(img.id, e.target.checked)}
                                />
                                Active
                            </label>
                        </div>
                    </div>
                ))}
            </div>

            {loading && <Loader2 className="animate-spin mt-4 mx-auto text-blue-600" />}
        </div>
    );
};

export default BannerImageUploader;
