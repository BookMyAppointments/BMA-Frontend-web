import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/services/api';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { User } from '@/types/doctor';

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
    const [isEditMode, setIsEditMode] = useState(false);
    const [initialFormData, setInitialFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        gender: '',
        dob: ''
    });
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [showVerificationModal, setShowVerificationModal] = useState(false);

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
            console.log(response.data.profile);
            setUser(response.data);
            const newFormData = {
                name: response.data.name || '',
                email: response.data.email || '',
                phone: response.data.phone || '',
                address: response.data.address || '',
                gender: response.data.gender || '',
                dob: response.data.dob ? new Date(response.data.dob).toISOString().split('T')[0] : ''
            };

            setFormData(newFormData);
            setInitialFormData(newFormData);
            setImageUrl(response.data.picture || '/profile-placeholder.png');
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const hasChanges = () => {
        return Object.keys(formData).some(key => formData[key as keyof typeof formData] !== initialFormData[key as keyof typeof initialFormData]);
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
            toast.error('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const sendVerificationCode = async () => {
        try {
            setIsSendingCode(true);
            await axios.post(
                `${API_BASE_URL}/auth/send-verification-code`,
                { email: formData.email },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setShowVerificationModal(true);
            toast.success('Verification code sent to your email');
        } catch (error: any) {
            console.error('Failed to send verification code:', error);
            toast.error(error.response?.data?.message || 'Failed to send verification code');
        } finally {
            setIsSendingCode(false);
        }
    };

    const verifyEmail = async () => {
        try {
            setIsVerifying(true);
            const response = await axios.post(
                `${API_BASE_URL}/auth/verify`,
                {
                    email: formData.email,
                    code: verificationCode
                }
            );

            if (response.status === 200) {
                setShowVerificationModal(false);
                toast.success('Email verified successfully');
                return true;
            }
            return false;
        } catch (error: any) {
            console.error('Verification failed:', error);
            toast.error(error.response?.data?.message || 'Invalid verification code');
            return false;
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!hasChanges()) {
            toast.error('No changes made to update');
            return;
        }

        // If email is changed, verify it first
        if (formData.email !== initialFormData.email) {
            await sendVerificationCode();
            return;
        }
        if (formData.phone.startsWith("+") || formData.phone.length < 10 || formData.phone.length > 10 || formData.phone.startsWith("0")) {
            toast.error("Invalid phone number")
            return;
        }
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
                setInitialFormData(formData);
                setIsEditMode(false);
                fetchUserProfile();
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            console.error('Update failed:', error);
            toast.error('Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleVerificationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isVerified = await verifyEmail();
        if (isVerified) {
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
                    setInitialFormData(formData);
                    setIsEditMode(false);
                    fetchUserProfile();
                    toast.success('Profile updated successfully');
                }
            } catch (error) {
                console.error('Update failed:', error);
                toast.error('Failed to update profile');
            } finally {
                setIsUpdating(false);
            }
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isEditMode}
                            onChange={() => setIsEditMode(!isEditMode)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-2 text-sm font-medium text-gray-700">Edit Mode</span>
                    </label>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="relative h-24 w-24">
                        <Image
                            fill
                            priority
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
                            {isUploading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : '📷'}
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
                            disabled={!isEditMode}
                            className={`w-full px-4 py-2 rounded-lg border ${isEditMode ? 'border-gray-200 focus:border-blue-500' : 'border-gray-200 bg-gray-50'} focus:outline-none`}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditMode}
                            className={`w-full px-4 py-2 rounded-lg border ${isEditMode ? 'border-gray-200 focus:border-blue-500' : 'border-gray-200 bg-gray-50'} focus:outline-none`}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditMode}
                            className={`w-full px-4 py-2 rounded-lg border ${isEditMode ? 'border-gray-200 focus:border-blue-500' : 'border-gray-200 bg-gray-50'} focus:outline-none`}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={!isEditMode}
                            className={`w-full px-4 py-2 rounded-lg border ${isEditMode ? 'border-gray-200 focus:border-blue-500' : 'border-gray-200 bg-gray-50'} focus:outline-none`}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            disabled={!isEditMode}
                            className={`w-full px-4 py-2 rounded-lg border ${isEditMode ? 'border-gray-200 focus:border-blue-500' : 'border-gray-200 bg-gray-50'} focus:outline-none`}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob || ''}
                            onChange={handleChange}
                            disabled={!isEditMode}
                            className={`w-full px-4 py-2 rounded-lg border ${isEditMode ? 'border-gray-200 focus:border-blue-500' : 'border-gray-200 bg-gray-50'} focus:outline-none`}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isUpdating || !isEditMode || isSendingCode}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center justify-center gap-2"
                >
                    {isUpdating ? 'Updating...' : isSendingCode ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending Code...
                        </>
                    ) : 'Update Profile'}
                </button>
            </form>

            {/* Email Verification Modal */}
            {showVerificationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Verify Your Email</h3>
                        <p className="text-gray-600 mb-4">
                            Please enter the verification code sent to your email address.
                        </p>
                        <form onSubmit={handleVerificationSubmit}>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="Enter verification code"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none mb-4"
                            />
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowVerificationModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-700"
                                    disabled={isVerifying}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isVerifying}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center gap-2"
                                >
                                    {isVerifying ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Verifying...
                                        </>
                                    ) : 'Verify & Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
