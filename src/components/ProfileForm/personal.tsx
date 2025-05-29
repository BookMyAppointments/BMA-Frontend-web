import { useState } from 'react';
import axios from 'axios';
import { useSession } from '../../context/SessionProvider';

export default function Personal() {
    const { user, refresh } = useSession();
    const [imageUrl, setImageUrl] = useState('/profile-placeholder.png');
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.profile?.address || '',
        gender: user?.profile?.gender || '',
        dob: user?.profile?.dob || ''
    });
    const [isUpdating, setIsUpdating] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        
        const file = e.target.files[0];
        setIsUploading(true);
        
        try {
            const formData = new FormData();
            formData.append('image', file);
            
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/file-upload/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            setImageUrl(response.data.url);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/auth/profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.status === 200) {
                refresh();
                alert('Profile updated successfully');
            }
        } catch (error) {
            console.error('Update failed:', error);
            alert('Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>

            <div className="flex items-center space-x-6">
                <div className="relative h-24 w-24">
                    <img
                        src={imageUrl}
                        alt="Profile"
                        className="rounded-full w-full h-full object-cover"
                    />
                    <input
                        type="file"
                        id="imageUpload"
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                    />
                    <label
                        htmlFor="imageUpload"
                        className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer"
                    >
                        {isUploading ? '...' : '📷'}
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-700 mb-2">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Gender</label>
                    <input
                        type="text"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isUpdating}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
            >
                {isUpdating ? 'Updating...' : 'Update Profile'}
            </button>
        </form>
    );
}