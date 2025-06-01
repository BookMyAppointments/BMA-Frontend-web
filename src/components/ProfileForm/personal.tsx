import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';

interface Profile {
    id: string;
    userId: string;
    gender: string;
    dob: string | null;
    address: string;
    picture?: string;
}

interface User {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: string;
    verified: boolean;
    profile: Profile;
}

export default function Personal() {
    const [, setUser] = useState<User | null>(null);
    const [imageUrl, setImageUrl] = useState('/profile-placeholder.png');
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        gender: '',
        dob: ''
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [editMode, setEditMode] = useState({
        name: false,
        phone: false,
        address: false,
        gender: false,
        dob: false
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/auth/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            console.log(response.data);
            
            setUser(response.data);
            setFormData({
                name: response.data.name || '',
                email: response.data.email || '',
                phone: response.data.phone || '',
                address: response.data.profile?.address || '',
                gender: response.data.profile?.gender || '',
                dob: response.data.profile?.dob || ''
            });
            setImageUrl(response.data.profile?.picture || '/profile-placeholder.png');
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const toggleEdit = (field: keyof typeof editMode) => {
        setEditMode(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        
        const file = e.target.files[0];
        setIsUploading(true);
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await axios.post(
                `${API_BASE_URL}/file-upload/upload-picture`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            setImageUrl(response.data.url);
            fetchUserProfile(); // Refresh user data after image upload
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
                `${API_BASE_URL}/auth/profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.status === 200) {
                fetchUserProfile(); // Refresh user data after update
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
                <div className="flex items-center space-x-4">
                    <div className="flex-1">
                        <label className="block text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!editMode.name}
                            className={`w-full px-4 py-2 rounded-lg border ${editMode.name ? 'border-gray-200 focus:border-blue-500' : 'border-gray-200 bg-gray-50'} focus:outline-none`}
                        />
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-6">
                        <input type="checkbox" className="sr-only peer" checked={editMode.name} onChange={() => toggleEdit('name')} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
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

                <div className="flex items-center space-x-4">
                    <div className="flex-1">
                        <label className="block text-gray-700 mb-2">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!editMode.phone}
                            className={`w-full px-4 py-2 rounded-lg border ${editMode.phone ? 'border-gray-200 focus:border-blue-500' : 'border-gray-200 bg-gray-50'} focus:outline-none`}
                        />
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-6">
                        <input type="checkbox" className="sr-only peer" checked={editMode.phone} onChange={() => toggleEdit('phone')} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex-1">
                        <label className="block text-gray-700 mb-2">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={!editMode.address}
                            className={`w-full px-4 py-2 rounded-lg border ${editMode.address ? 'border-gray-200 focus:border-blue-500' : 'border-gray-200 bg-gray-50'} focus:outline-none`}
                        />
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-6">
                        <input type="checkbox" className="sr-only peer" checked={editMode.address} onChange={() => toggleEdit('address')} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex-1">
                        <label className="block text-gray-700 mb-2">Gender</label>
                        <input
                            type="text"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            disabled={!editMode.gender}
                            className={`w-full px-4 py-2 rounded-lg border ${editMode.gender ? 'border-gray-200 focus:border-blue-500' : 'border-gray-200 bg-gray-50'} focus:outline-none`}
                        />
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-6">
                        <input type="checkbox" className="sr-only peer" checked={editMode.gender} onChange={() => toggleEdit('gender')} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex-1">
                        <label className="block text-gray-700 mb-2">Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob || ''}
                            onChange={handleChange}
                            disabled={!editMode.dob}
                            className={`w-full px-4 py-2 rounded-lg border ${editMode.dob ? 'border-gray-200 focus:border-blue-500' : 'border-gray-200 bg-gray-50'} focus:outline-none`}
                        />
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-6">
                        <input type="checkbox" className="sr-only peer" checked={editMode.dob} onChange={() => toggleEdit('dob')} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
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